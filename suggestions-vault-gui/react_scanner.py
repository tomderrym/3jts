"""
Scrape React component exports from .tsx / .jsx files (regex-based, no full TS parse).
"""

from __future__ import annotations

import re
from pathlib import Path
HOOK_RE = re.compile(r"\buse(State|Effect|LayoutEffect|Memo|Callback|Ref|Context|Reducer|Id)\b")

# Named exports / default patterns (PascalCase component names)
PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("default_function", re.compile(r"export\s+default\s+function\s+([A-Z][\w$]*)")),
    ("default_class", re.compile(r"export\s+default\s+class\s+([A-Z][\w$]*)")),
    ("named_function", re.compile(r"export\s+function\s+([A-Z][\w$]*)")),
    (
        "const_arrow",
        re.compile(
            r"export\s+const\s+([A-Z][\w$]*)\s*(?::\s*[^=]+)?=\s*(?:\([^)]*\)|[\w.<>\[\],\s]+)?\s*=>"
        ),
    ),
    (
        "const_fc",
        re.compile(
            r"export\s+const\s+([A-Z][\w$]*)\s*:\s*React\.(?:FC|FunctionComponent|VFC|VoidFunctionComponent)"
        ),
    ),
    ("default_memo", re.compile(r"export\s+default\s+React\.memo\s*\(\s*([A-Z][\w$]*)")),
    ("forward_ref", re.compile(r"export\s+const\s+([A-Z][\w$]*)\s*=\s*(?:React\.)?forwardRef")),
]


def _analyze_hooks(source: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for m in HOOK_RE.finditer(source):
        name = m.group(1)
        counts[name] = counts.get(name, 0) + 1
    return counts


def _extract_component_names(source: str) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    seen: set[str] = set()
    for kind, pat in PATTERNS:
        for m in pat.finditer(source):
            name = m.group(1)
            if name in seen:
                continue
            seen.add(name)
            found.append((kind, name))
    return found


def _confidence_for(kind: str, hooks: dict[str, int]) -> float:
    base = 0.62
    if kind.startswith("default"):
        base += 0.12
    if hooks:
        base += min(0.15, 0.02 * sum(hooks.values()))
    return min(0.93, base)


def _effort_from_hooks(hooks: dict[str, int]) -> str:
    n = sum(hooks.values())
    if n > 12:
        return "high"
    if n > 4:
        return "medium"
    return "low"


def scan_react_suggestions(
    root: Path,
    paths: list[Path],
    max_suggestions: int = 28,
) -> list[dict]:
    """
    Build vault-style suggestion dicts for discovered React components.
    """
    root = root.resolve()
    out: list[dict] = []
    titles_seen: set[str] = set()

    for path in paths:
        if len(out) >= max_suggestions:
            break
        suf = path.suffix.lower()
        if suf not in (".tsx", ".jsx", ".ts", ".js"):
            continue
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        if suf not in (".tsx", ".jsx") and "react" not in text.lower():
            continue

        hooks = _analyze_hooks(text)
        comps = _extract_component_names(text)
        if not comps:
            # Heuristic: file might use `export default` anonymous — skip or file-level feature
            if re.search(r"export\s+default\s+", text) and "function" in text:
                rel = path.relative_to(root)
                title = f"React module: {rel.as_posix()}"
                if title in titles_seen:
                    continue
                titles_seen.add(title)
                out.append(
                    {
                        "title": title,
                        "short": f"Default export without clear PascalCase name in {rel.as_posix()}",
                        "long": (
                            f"File `{rel}` appears to default-export a component. "
                            "Open to confirm structure, add explicit name, or split concerns."
                        ),
                        "category": "feature",
                        "source": "scanner_agent",
                        "confidence": 0.55,
                        "impact": "low",
                        "effort": "low",
                        "tags": ["react", "scraped", rel.parts[0] if rel.parts else "root"],
                    }
                )
            continue

        try:
            rel = path.relative_to(root)
        except ValueError:
            rel = path

        for kind, name in comps:
            if len(out) >= max_suggestions:
                break
            title = f"React: {name}"
            if title in titles_seen:
                continue
            titles_seen.add(title)

            hook_bits = ", ".join(f"{k}×{v}" for k, v in sorted(hooks.items())[:6])
            if not hook_bits:
                hook_bits = "none sampled"

            out.append(
                {
                    "title": title,
                    "short": f"`{name}` in {rel.as_posix()}",
                    "long": (
                        f"Scraped React component `{name}` ({kind}) from `{rel}`. "
                        f"Hook usage snapshot: {hook_bits}. "
                        "Use for docs, tests, or vault-backed refactors."
                    ),
                    "category": "feature",
                    "source": "scanner_agent",
                    "confidence": _confidence_for(kind, hooks),
                    "impact": "medium" if sum(hooks.values()) > 8 else "low",
                    "effort": _effort_from_hooks(hooks),
                    "tags": ["react", "component", name, rel.parts[0] if rel.parts else "root"],
                }
            )

    return out
