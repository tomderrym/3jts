"""
Git CLI helpers for CSIL deploy / rollback (branch + commit, no auto-merge).
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path
from typing import Optional, Tuple

from dataclasses import dataclass


def _cleanup_csil_file(abs_file: Path, abs_dir: Path) -> None:
    try:
        if abs_file.exists():
            abs_file.unlink()
    except OSError:
        pass
    try:
        if abs_dir.exists() and abs_dir.name == ".csil-suggestions" and not any(abs_dir.iterdir()):
            abs_dir.rmdir()
    except OSError:
        pass


@dataclass
class GitDeployResult:
    ok: bool
    commit_sha: str
    branch_name: str
    base_sha: str
    original_branch: Optional[str]
    message: str


def _run_git(cwd: Path, *args: str, timeout: int = 120) -> Tuple[int, str, str]:
    try:
        p = subprocess.run(
            ["git", *args],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=timeout,
            shell=False,
        )
        return p.returncode, (p.stdout or "").strip(), (p.stderr or "").strip()
    except FileNotFoundError:
        return 127, "", "git executable not found in PATH"
    except subprocess.TimeoutExpired:
        return 124, "", "git command timed out"


def git_available() -> bool:
    code, _, _ = _run_git(Path.cwd(), "--version", timeout=5)
    return code == 0


def find_git_root(start: Path) -> Optional[Path]:
    start = start.resolve()
    if not start.is_dir():
        return None
    code, out, _ = _run_git(start, "rev-parse", "--show-toplevel")
    if code != 0 or not out:
        return None
    return Path(out)


def get_current_branch(repo: Path) -> Optional[str]:
    code, out, _ = _run_git(repo, "branch", "--show-current")
    if code != 0:
        return None
    return out or None


def rev_parse_head(repo: Path) -> Optional[str]:
    code, out, _ = _run_git(repo, "rev-parse", "HEAD")
    if code != 0:
        return None
    return out


def git_ls_files(repo: Path, pattern: str) -> list[str]:
    code, out, _ = _run_git(repo, "ls-files", "-z", "--", pattern)
    if code != 0:
        return []
    return [x for x in out.split("\0") if x]


def sanitize_branch_fragment(s: str, max_len: int = 48) -> str:
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", s).strip("-")
    return (s or "suggestion")[:max_len]


def branch_exists(repo: Path, name: str) -> bool:
    code, _, _ = _run_git(repo, "show-ref", "-q", "--verify", f"refs/heads/{name}")
    return code == 0


def unique_branch_name(repo: Path, base: str) -> str:
    for i in range(0, 100):
        candidate = base if i == 0 else f"{base}-{i}"
        if not branch_exists(repo, candidate):
            return candidate
    return f"{base}-x{abs(hash(base)) % 10000}"


def deploy_suggestion_record(
    repo: Path,
    suggestion_id: str,
    title: str,
    body_markdown: str,
) -> GitDeployResult:
    """
    Create branch csil/<id>, add .csil-suggestions/<id>.md, commit, return to previous HEAD/branch.
    """
    repo = repo.resolve()
    root = find_git_root(repo)
    if not root:
        return GitDeployResult(
            False, "", "", "", None, "Not a Git repository (or scan path is outside a repo)."
        )

    code, dirty_out, _ = _run_git(root, "status", "--porcelain")
    if code != 0:
        return GitDeployResult(False, "", "", "", None, "Could not read git status.")

    base_sha = rev_parse_head(root)
    if not base_sha:
        return GitDeployResult(False, "", "", "", None, "Could not resolve HEAD.")

    orig_branch = get_current_branch(root)
    frag = sanitize_branch_fragment(suggestion_id)
    branch = unique_branch_name(root, f"csil/{frag}")

    rel_dir = Path(".csil-suggestions")
    rel_file = rel_dir / f"{frag}.md"
    abs_dir = root / rel_dir
    abs_file = root / rel_file

    checkout_new = _run_git(root, "checkout", "-b", branch)
    if checkout_new[0] != 0:
        return GitDeployResult(
            False,
            "",
            "",
            base_sha,
            orig_branch,
            f"Could not create branch: {checkout_new[2] or checkout_new[1]}",
        )

    try:
        abs_dir.mkdir(parents=True, exist_ok=True)
        abs_file.write_text(body_markdown, encoding="utf-8")
    except OSError as e:
        _run_git(root, "checkout", base_sha)
        _run_git(root, "branch", "-D", branch)
        return GitDeployResult(
            False, "", "", base_sha, orig_branch, f"Failed to write file: {e}"
        )

    add = _run_git(root, "add", "--", str(rel_file))
    if add[0] != 0:
        _run_git(root, "restore", "--staged", str(rel_file))
        _cleanup_csil_file(abs_file, abs_dir)
        _run_git(root, "checkout", base_sha)
        _run_git(root, "branch", "-D", branch)
        return GitDeployResult(
            False, "", "", base_sha, orig_branch, f"git add failed: {add[2] or add[1]}"
        )

    msg = f"CSIL: record suggestion {suggestion_id} — {title[:60]}"
    commit = _run_git(root, "commit", "-m", msg)
    if commit[0] != 0:
        _run_git(root, "restore", "--staged", str(rel_file))
        _cleanup_csil_file(abs_file, abs_dir)
        _run_git(root, "checkout", base_sha)
        _run_git(root, "branch", "-D", branch)
        return GitDeployResult(
            False,
            "",
            "",
            base_sha,
            orig_branch,
            f"git commit failed: {commit[2] or commit[1]}",
        )

    new_sha = rev_parse_head(root)
    if not new_sha:
        new_sha = ""

    # Return to previous branch or detached SHA
    if orig_branch:
        back = _run_git(root, "checkout", orig_branch)
    else:
        back = _run_git(root, "checkout", base_sha)

    if back[0] != 0:
        return GitDeployResult(
            True,
            new_sha,
            branch,
            base_sha,
            orig_branch,
            f"Committed on {branch} but could not checkout back: {back[2] or back[1]}",
        )

    note = ""
    if dirty_out:
        note = " (working tree had existing changes; left untouched)"

    return GitDeployResult(
        True,
        new_sha,
        branch,
        base_sha,
        orig_branch,
        f"Branch {branch} @ {new_sha[:7]}{note}",
    )


def rollback_deploy_branch(repo: Path, branch_name: str) -> Tuple[bool, str]:
    root = find_git_root(repo)
    if not root:
        return False, "Not a Git repository."

    del_br = _run_git(root, "branch", "-D", branch_name)
    if del_br[0] != 0:
        return False, del_br[2] or del_br[1] or f"Could not delete branch {branch_name}"

    return True, f"Deleted local branch {branch_name}"
