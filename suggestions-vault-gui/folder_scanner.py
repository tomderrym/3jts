"""
Heuristic folder scan → structured Suggestion candidates (no network, no AI).
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Callable, Optional

from git_ops import find_git_root, git_ls_files
from react_scanner import scan_react_suggestions

# Re-use types from main via late import avoided — scanner returns dicts compatible with Suggestion ctor

SKIP_DIR_NAMES = {
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    ".mypy_cache",
    ".pytest_cache",
    ".tox",
    "dist",
    "build",
    ".next",
    "target",
    ".idea",
    ".vs",
    "coverage",
    ".nuxt",
    ".output",
}

TEXT_SUFFIXES = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".toml",
    ".css",
    ".html",
    ".vue",
    ".svelte",
    ".rs",
    ".go",
    ".java",
    ".kt",
    ".cs",
    ".rb",
    ".php",
    ".sql",
}


def _should_skip_dir(p: Path) -> bool:
    if p.name in SKIP_DIR_NAMES:
        return True
    # Skip most dot-folders except CI/docs helpers
    if p.name.startswith(".") and p.name not in {".github"}:
        return True
    return False


def _basename_key(path: Path) -> str:
    """Same filename in different folders compares equal (case-insensitive on Windows)."""
    return path.name.lower() if os.name == "nt" else path.name


def _path_recency_tuple(path: Path) -> tuple[float, float, str]:
    """
    Sort key: prefer latest of (mtime, ctime), then mtime, then path for stability.
    """
    try:
        st = path.stat()
    except OSError:
        return (0.0, 0.0, "")
    latest = max(st.st_mtime, st.st_ctime)
    return (latest, st.st_mtime, str(path.resolve()))


def _dedupe_text_files_latest_by_basename(
    pairs: list[tuple[Path, int]],
) -> tuple[list[tuple[Path, int]], list[tuple[Path, int]]]:
    """
    For each basename, keep exactly one path — the one with the newest created-or-modified time.
    Returns (small_files, large_files) split at 400_000 bytes using the winning path's size.
    """
    best: dict[str, tuple[Path, int]] = {}
    for ent, sz in pairs:
        key = _basename_key(ent)
        cand = (ent, sz)
        if key not in best:
            best[key] = cand
            continue
        old_ent, old_sz = best[key]
        if _path_recency_tuple(ent) > _path_recency_tuple(old_ent):
            best[key] = cand
    uniq = list(best.values())
    small = [(p, s) for p, s in uniq if s <= 400_000]
    large = [(p, s) for p, s in uniq if s > 400_000]
    return small, large


def scan_folder(
    root: Path,
    max_depth: int = 10,
    max_files_walk: int = 8000,
    max_content_files: int = 120,
    progress: Optional[Callable[[str], None]] = None,
) -> list[dict]:
    """
    Returns list of dicts with keys matching Suggestion fields (except id, created_at, status).
    """
    root = root.resolve()
    if not root.is_dir():
        return []

    def log(msg: str) -> None:
        if progress:
            progress(msg)

    git_root = find_git_root(root)
    suggestions: list[dict] = []

    # --- Repo / lockfile / manifest signals (fast) ---
    pkg = root / "package.json"
    req = root / "requirements.txt"
    pyproject = root / "pyproject.toml"

    if pkg.is_file():
        locks = any(
            (root / name).is_file()
            for name in (
                "package-lock.json",
                "pnpm-lock.yaml",
                "yarn.lock",
                "bun.lockb",
            )
        )
        if not locks:
            suggestions.append(
                {
                    "title": "Add a package lockfile",
                    "short": "Pin dependency versions for reproducible installs",
                    "long": (
                        f"Found package.json at {pkg.relative_to(root)} but no lockfile "
                        "(package-lock.json, pnpm-lock.yaml, or yarn.lock). "
                        "Add one to reduce drift and supply-chain surprises."
                    ),
                    "category": "reliability",
                    "source": "scanner_agent",
                    "confidence": 0.78,
                    "impact": "medium",
                    "effort": "low",
                    "tags": ["dependencies", "nodejs", "lockfile"],
                }
            )

    if req.is_file():
        text = ""
        try:
            text = req.read_text(encoding="utf-8", errors="replace")
        except OSError:
            pass
        lines = [ln.strip() for ln in text.splitlines() if ln.strip() and not ln.strip().startswith("#")]
        unpinned = sum(1 for ln in lines if ln and "==" not in ln and "@" not in ln and not ln.startswith("-e"))
        if lines and unpinned / max(len(lines), 1) > 0.5:
            suggestions.append(
                {
                    "title": "Pin Python dependencies",
                    "short": "Use == pins or a lock file (pip-tools/poetry/uv)",
                    "long": (
                        f"requirements.txt appears mostly unpinned ({unpinned}/{len(lines)} lines). "
                        "Pin versions or adopt a lockfile workflow for reproducible builds."
                    ),
                    "category": "reliability",
                    "source": "scanner_agent",
                    "confidence": 0.72,
                    "impact": "medium",
                    "effort": "medium",
                    "tags": ["python", "dependencies"],
                }
            )

    if pyproject.is_file() and not (root / "poetry.lock").is_file() and not (root / "uv.lock").is_file():
        try:
            ppt = pyproject.read_text(encoding="utf-8", errors="replace")
        except OSError:
            ppt = ""
        if "[project]" in ppt or "[tool.poetry]" in ppt:
            suggestions.append(
                {
                    "title": "Lock pyproject dependencies",
                    "short": "Add poetry.lock or uv.lock for deterministic installs",
                    "long": (
                        "pyproject.toml present without a companion lock file. "
                        "Generate and commit a lockfile for CI and production parity."
                    ),
                    "category": "reliability",
                    "source": "scanner_agent",
                    "confidence": 0.7,
                    "impact": "medium",
                    "effort": "low",
                    "tags": ["python", "pyproject"],
                }
            )

    # --- Tests presence ---
    has_tests_dir = (root / "tests").is_dir() or (root / "test").is_dir()
    has_pkg_test_script = False
    if pkg.is_file():
        try:
            pj = pkg.read_text(encoding="utf-8", errors="replace")
            has_pkg_test_script = any(
                k in pj for k in ('"test"', "jest", "vitest", "mocha", "cypress", "playwright")
            )
        except OSError:
            pass
    if (req.is_file() or pkg.is_file()) and not has_tests_dir and not has_pkg_test_script:
        suggestions.append(
            {
                "title": "Introduce automated tests",
                "short": "No tests/ directory or obvious test script in package.json",
                "long": (
                    "Project has dependency manifests but no clear test tree. "
                    "Add a minimal test suite (even smoke tests) before scaling changes."
                ),
                "category": "feature",
                "source": "scanner_agent",
                "confidence": 0.65,
                "impact": "high",
                "effort": "high",
                "tags": ["testing", "quality"],
            }
        )

    # --- README ---
    if not (root / "README.md").is_file() and not (root / "README.rst").is_file():
        suggestions.append(
            {
                "title": "Add a README",
                "short": "Document setup, run, and deploy steps",
                "long": "No README found at repo root. Future you (and collaborators) will need onboarding docs.",
                "category": "feature",
                "source": "scanner_agent",
                "confidence": 0.8,
                "impact": "medium",
                "effort": "low",
                "tags": ["docs", "onboarding"],
            }
        )

    # --- .env in tree (working tree) ---
    env_files = list(root.glob("**/.env")) + list(root.glob("**/.env.*"))
    env_files = [p for p in env_files if p.is_file() and ".git" not in p.parts]
    if env_files:
        sample = env_files[0].relative_to(root)
        suggestions.append(
            {
                "title": "Review secrets in working tree",
                "short": f"Found env file(s); ensure none are committed",
                "long": (
                    f"Detected environment files (e.g. {sample}). "
                    "Confirm .gitignore coverage and rotate any leaked credentials."
                ),
                "category": "security",
                "source": "scanner_agent",
                "confidence": 0.85,
                "impact": "high",
                "effort": "low",
                "tags": ["secrets", "env"],
            }
        )

    if git_root:
        tracked_env = git_ls_files(git_root, ".env") + git_ls_files(git_root, ".env.*")
        tracked_env = [f for f in tracked_env if f and not f.endswith("/")]
        if tracked_env:
            suggestions.append(
                {
                    "title": "Remove tracked .env files from Git",
                    "short": "Tracked env files are a critical security risk",
                    "long": (
                        "Git is tracking environment files: "
                        + ", ".join(tracked_env[:5])
                        + (f" (+{len(tracked_env)-5} more)" if len(tracked_env) > 5 else "")
                        + ". Remove from index, add to .gitignore, rotate secrets."
                    ),
                    "category": "security",
                    "source": "scanner_agent",
                    "confidence": 0.96,
                    "impact": "high",
                    "effort": "medium",
                    "tags": ["git", "secrets"],
                }
            )

    # --- Walk: large files, TODOs (respects skip dirs; no unbounded rglob) ---
    log("Walking files…")
    walked = 0
    todo_hits = 0
    text_file_pairs: list[tuple[Path, int]] = []
    todo_re = re.compile(r"\b(TODO|FIXME|HACK|XXX)\b", re.IGNORECASE)

    def walk(cur: Path, depth: int) -> None:
        nonlocal walked
        if depth > max_depth or walked >= max_files_walk:
            return
        try:
            entries = list(cur.iterdir())
        except OSError:
            return
        for ent in entries:
            if walked >= max_files_walk:
                break
            if ent.is_dir():
                if _should_skip_dir(ent):
                    continue
                walk(ent, depth + 1)
            elif ent.is_file():
                walked += 1
                try:
                    st = ent.stat()
                except OSError:
                    continue
                suf = ent.suffix.lower()
                if suf not in TEXT_SUFFIXES:
                    continue
                if st.st_size <= 0:
                    continue
                text_file_pairs.append((ent, st.st_size))

    walk(root, 0)

    log("Dedupe by filename — keeping latest (max of mtime & ctime)…")
    small_pairs, large_files = _dedupe_text_files_latest_by_basename(text_file_pairs)
    content_candidates = [p for p, _ in small_pairs]

    react_paths = [
        p
        for p in content_candidates
        if p.suffix.lower() in (".tsx", ".jsx", ".ts", ".js")
    ]
    log("Scraping React components…")
    suggestions.extend(scan_react_suggestions(root, react_paths[:220], max_suggestions=30))

    log("Scanning file contents…")
    content_candidates.sort(key=lambda p: p.stat().st_size if p.exists() else 0)
    for path in content_candidates[:max_content_files]:
        try:
            data = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        todo_hits += len(todo_re.findall(data))

    if large_files:
        biggest = max(large_files, key=lambda x: x[1])
        rel = biggest[0].relative_to(root)
        suggestions.append(
            {
                "title": "Split or lazy-load large source files",
                "short": f"Largest text-like file ~{biggest[1] // 1024} KB: {rel}",
                "long": (
                    f"Found at least one very large text file ({rel}, {biggest[1]} bytes). "
                    "Consider splitting modules, code-splitting, or moving generated assets out of VCS."
                ),
                "category": "performance",
                "source": "scanner_agent",
                "confidence": 0.68,
                "impact": "medium",
                "effort": "medium",
                "tags": ["bundle-size", "maintainability"],
            }
        )

    if todo_hits >= 8:
        suggestions.append(
            {
                "title": "Burn down TODO/FIXME backlog",
                "short": f"Found {todo_hits}+ TODO/FIXME markers in sampled files",
                "long": (
                    "High density of TODO/FIXME/HACK markers suggests deferred risk. "
                    "Triage, ticket, or remove stale comments."
                ),
                "category": "reliability",
                "source": "scanner_agent",
                "confidence": min(0.55 + todo_hits / 200, 0.9),
                "impact": "medium",
                "effort": "high",
                "tags": ["tech-debt", "cleanup"],
            }
        )

    # Dedupe by title
    seen: set[str] = set()
    out: list[dict] = []
    for s in suggestions:
        t = s["title"]
        if t in seen:
            continue
        seen.add(t)
        out.append(s)
    return out
