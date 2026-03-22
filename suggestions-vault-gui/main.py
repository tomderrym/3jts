"""
Suggestions Vault — Python GUI (Module 1: Controlled Self-Improvement Loop).
Scanner → Vault → Approve → Deploy (diff) → Track → Rollback.
"""

from __future__ import annotations

import json
import os
import random
import re
import string
import subprocess
import sys
import tempfile
import threading
import tkinter as tk
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from tkinter import filedialog, messagebox
from typing import Literal, Optional, Tuple

import customtkinter as ctk

from folder_scanner import scan_folder
from git_ops import (
    deploy_suggestion_record,
    find_git_root,
    git_available,
    rollback_deploy_branch,
)

Category = Literal["reliability", "performance", "security", "feature"]
Source = Literal["ai_generated", "user_feedback", "scanner_agent"]
Impact = Literal["low", "medium", "high"]
Effort = Literal["low", "medium", "high"]
Status = Literal["pending", "approved", "rejected", "applied"]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _rand_id(prefix: str) -> str:
    tail = "".join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return f"{prefix}_{tail}"


def slug_feature_name(title: str) -> str:
    """Filesystem-safe slug derived from vault feature / suggestion title."""
    raw = re.sub(r"[^a-zA-Z0-9]+", "_", title.strip()).strip("_")
    return (raw or "feature")[:56]


def pascal_from_slug(slug: str) -> str:
    parts = [p for p in slug.split("_") if p]
    if not parts:
        return "VaultFeature"
    return "".join(p[0].upper() + p[1:].lower() for p in parts)


def react_component_name_from_title(title: str) -> str:
    t = title.strip()
    if t.lower().startswith("react:"):
        rest = t.split(":", 1)[1].strip()
        return (rest.split()[0] if rest else slug_feature_name(t))
    return pascal_from_slug(slug_feature_name(t))


def safe_ts_identifier(name: str) -> str:
    n = re.sub(r"[^0-9a-zA-Z_$]", "", name.replace(" ", ""))
    if not n:
        return "VaultFeature"
    if n[0].isdigit():
        n = "Cmp" + n
    return n[:80]


def run_temp_python(code: str, timeout: float = 12.0) -> Tuple[int, str, str]:
    """
    Write code to a temp .py file, run with the current interpreter, delete file.
    """
    fd, path_str = tempfile.mkstemp(prefix="csil_scratch_", suffix=".py", text=True)
    path = Path(path_str)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(code)
        proc = subprocess.run(
            [sys.executable, str(path)],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=tempfile.gettempdir(),
        )
        return proc.returncode, proc.stdout or "", proc.stderr or ""
    except subprocess.TimeoutExpired:
        return 124, "", "Execution timed out."
    finally:
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass


def execute_named_feature_harness(feature_title: str, timeout: float = 12.0) -> Tuple[int, str, str, str]:
    """
    Temporary code execution: temp file name includes the feature slug; prints JSON summary.
    Returns (exit_code, stdout, stderr, temp_filename).
    """
    slug = slug_feature_name(feature_title)
    prefix = f"csil_{slug}_"[:32]
    code = f"""# CSIL temporary harness (auto-deleted after run)
FEATURE_TITLE = {json.dumps(feature_title)}
FEATURE_SLUG = {json.dumps(slug)}

def feature_summary():
    return {{
        "title": FEATURE_TITLE,
        "slug": FEATURE_SLUG,
        "kind": "vault_named_harness",
    }}

if __name__ == "__main__":
    import json as _j
    print(_j.dumps(feature_summary(), indent=2))
"""
    fd, path_str = tempfile.mkstemp(prefix=prefix, suffix=".py", text=True)
    path = Path(path_str)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(code)
        proc = subprocess.run(
            [sys.executable, str(path)],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=tempfile.gettempdir(),
        )
        return proc.returncode, proc.stdout or "", proc.stderr or "", path.name
    except subprocess.TimeoutExpired:
        return 124, "", "Execution timed out.", path.name
    finally:
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass


def write_react_stub_for_feature(scan_root: Path, feature_title: str) -> Tuple[bool, str]:
    """
    Create {slug}.tsx under .csil-stubs/ named after the feature; export matches scraped name when possible.
    """
    scan_root = scan_root.resolve()
    if not scan_root.is_dir():
        return False, "Scan folder is not a valid directory."
    comp = safe_ts_identifier(react_component_name_from_title(feature_title))
    slug = slug_feature_name(feature_title)
    stubs = scan_root / ".csil-stubs"
    try:
        stubs.mkdir(parents=True, exist_ok=True)
    except OSError as e:
        return False, str(e)
    out_path = stubs / f"{slug}.tsx"
    body = f"""/**
 * CSIL generated stub — feature: {feature_title}
 * File name follows feature slug: {slug}.tsx
 */
import React from 'react';

export const {comp}: React.FC = () => {{
  return null;
}};
"""
    try:
        out_path.write_text(body, encoding="utf-8")
    except OSError as e:
        return False, str(e)
    return True, str(out_path)


@dataclass
class Suggestion:
    id: str
    title: str
    short: str
    long: str
    category: Category
    source: Source
    confidence: float
    impact: Impact
    effort: Effort
    status: Status
    tags: list[str]
    created_at: str
    applied_commit: Optional[str] = None
    git_branch: Optional[str] = None

    def to_dict(self) -> dict:
        d = asdict(self)
        return d


def build_record_markdown(s: Suggestion, scan_root: str) -> str:
    """Payload written to .csil-suggestions/<id>.md on deploy."""
    lines = [
        "---",
        f"csil_id: {s.id}",
        f"title: {json.dumps(s.title)}",
        f"category: {s.category}",
        f"source: {s.source}",
        f"impact: {s.impact}",
        f"effort: {s.effort}",
        "status: vault_record",
        f"scan_root: {scan_root}",
        f"created_at: {s.created_at}",
        "tags:",
        *[f"  - {t}" for t in s.tags],
        "---",
        "",
        f"## {s.title}",
        "",
        s.short,
        "",
        s.long,
    ]
    return "\n".join(lines)


class SuggestionsVaultApp(ctk.CTk):
    def __init__(self) -> None:
        super().__init__()
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("dark-blue")

        self.title("Suggestions Vault — CSIL")
        self.geometry("1100x780")
        self.minsize(900, 600)

        self._vault: list[Suggestion] = [
            Suggestion(
                id="opt_001",
                title="Context Window Compression",
                short="Summarize long histories",
                long=(
                    "Implement a recursive summarization agent to compress conversation "
                    "history when approaching token limits."
                ),
                category="performance",
                source="scanner_agent",
                confidence=0.94,
                impact="high",
                effort="medium",
                status="pending",
                tags=["llm", "token-management", "context"],
                created_at=_now_iso(),
            )
        ]
        self._is_scanning = False
        self._applying_id: Optional[str] = None
        self._rolling_back_id: Optional[str] = None

        self._card_frames: list[ctk.CTkFrame] = []

        self._scan_path_var = tk.StringVar(value=str(Path.cwd().resolve()))
        self._scan_path_var.trace_add("write", lambda *_: self.after(100, self._sync_git_banner))

        self._build_ui()
        self._sync_git_banner()
        self._refresh_cards()

    def _run_scratch_python(self) -> None:
        code = self._scratch_code.get("1.0", "end").strip("\n")
        if not code.strip():
            messagebox.showinfo("Temp Python", "Enter some Python in the scratch area.")
            return

        def worker() -> None:
            exit_c, out, err = run_temp_python(code)

            def done() -> None:
                text = f"exit {exit_c}\n\n--- stdout ---\n{out}\n--- stderr ---\n{err}"
                messagebox.showinfo("Temp Python", text[:4000])

            self.after(0, done)

        threading.Thread(target=worker, daemon=True).start()

    def _run_named_harness(self, feature_title: str) -> None:
        def worker() -> None:
            exit_c, out, err, fname = execute_named_feature_harness(feature_title)

            def done() -> None:
                text = (
                    f"Temp file: {fname}\n(named from feature slug)\n\n"
                    f"exit {exit_c}\n\n--- stdout ---\n{out}\n--- stderr ---\n{err}"
                )
                messagebox.showinfo("Named harness", text[:4000])

            self.after(0, done)

        threading.Thread(target=worker, daemon=True).start()

    def _save_react_stub(self, feature_title: str) -> None:
        raw = self._scan_path_var.get().strip()
        root = Path(raw) if raw else None
        if not root or not root.is_dir():
            messagebox.showerror("Stub", "Set a valid scan folder first.")
            return
        ok, msg = write_react_stub_for_feature(root, feature_title)
        if ok:
            messagebox.showinfo("React stub", f"Created:\n{msg}")
        else:
            messagebox.showerror("React stub", msg)

    def _build_ui(self) -> None:
        self.configure(fg_color=("#0f172a", "#0f172a"))

        header = ctk.CTkFrame(self, fg_color="transparent")
        header.pack(fill="x", padx=28, pady=(24, 12))

        left = ctk.CTkFrame(header, fg_color="transparent")
        left.pack(side="left", fill="y")

        ctk.CTkLabel(
            left,
            text="CONTROLLED IMPROVEMENT LOOP",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="#f8fafc",
        ).pack(anchor="w")
        ctk.CTkLabel(
            left,
            text="Module 1 — Suggestions Vault",
            font=ctk.CTkFont(size=12),
            text_color="#94a3b8",
        ).pack(anchor="w", pady=(4, 0))

        right = ctk.CTkFrame(header, fg_color="transparent")
        right.pack(side="right")

        self._pending_label_title = ctk.CTkLabel(
            right,
            text="PENDING",
            font=ctk.CTkFont(size=10, weight="bold"),
            text_color="#64748b",
        )
        self._pending_label_title.pack(anchor="e")
        self._pending_count = ctk.CTkLabel(
            right,
            text="0",
            font=ctk.CTkFont(size=28, weight="bold"),
            text_color="#c084fc",
        )
        self._pending_count.pack(anchor="e")

        path_row = ctk.CTkFrame(self, fg_color="transparent")
        path_row.pack(fill="x", padx=28, pady=(0, 6))

        ctk.CTkLabel(
            path_row,
            text="Scan folder",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#94a3b8",
            width=88,
        ).pack(side="left", padx=(0, 8))

        self._path_entry = ctk.CTkEntry(
            path_row,
            textvariable=self._scan_path_var,
            height=36,
            font=ctk.CTkFont(family="Consolas", size=12),
            placeholder_text="Absolute path to project folder…",
        )
        self._path_entry.pack(side="left", fill="x", expand=True, padx=(0, 8))

        ctk.CTkButton(
            path_row,
            text="Browse…",
            width=100,
            height=36,
            fg_color="#334155",
            hover_color="#475569",
            command=self._browse_scan_folder,
        ).pack(side="left")

        self._git_banner = ctk.CTkLabel(
            self,
            text="Git: …",
            font=ctk.CTkFont(family="Consolas", size=11),
            text_color="#64748b",
        )
        self._git_banner.pack(anchor="w", padx=28, pady=(0, 4))

        actions = ctk.CTkFrame(self, fg_color="transparent")
        actions.pack(fill="x", padx=28, pady=(0, 8))

        self._scan_btn = ctk.CTkButton(
            actions,
            text="Initiate Scan",
            width=160,
            height=36,
            fg_color="#7c3aed",
            hover_color="#6d28d9",
            command=self._on_initiate_scan,
        )
        self._scan_btn.pack(side="left", padx=(0, 10))

        self._status_line = ctk.CTkLabel(
            actions,
            text="SCANNER_STATUS: STANDBY",
            font=ctk.CTkFont(family="Consolas", size=11),
            text_color="#64748b",
        )
        self._status_line.pack(side="left", pady=8)

        exec_row = ctk.CTkFrame(self, fg_color="transparent")
        exec_row.pack(fill="x", padx=28, pady=(0, 6))

        ctk.CTkLabel(
            exec_row,
            text="Temp Python",
            font=ctk.CTkFont(size=11, weight="bold"),
            text_color="#94a3b8",
            width=88,
        ).pack(side="left", padx=(0, 8), anchor="n")

        self._scratch_code = ctk.CTkTextbox(
            exec_row,
            height=72,
            font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="#020617",
            text_color="#e2e8f0",
            border_color="#334155",
            border_width=1,
        )
        self._scratch_code.pack(side="left", fill="x", expand=True, padx=(0, 8))
        self._scratch_code.insert("1.0", 'print("CSIL temp execution OK")')

        ctk.CTkButton(
            exec_row,
            text="Run",
            width=88,
            height=32,
            fg_color="#0ea5e9",
            hover_color="#0284c7",
            command=self._run_scratch_python,
        ).pack(side="left")

        self._scroll = ctk.CTkScrollableFrame(
            self,
            fg_color="#020617",
            corner_radius=12,
            border_width=1,
            border_color="#1e293b",
        )
        self._scroll.pack(fill="both", expand=True, padx=28, pady=(8, 28))

    def _scan_path_display(self) -> str:
        raw = self._scan_path_var.get().strip() or "."
        try:
            return str(Path(raw).resolve())
        except OSError:
            return raw

    def _browse_scan_folder(self) -> None:
        initial = self._scan_path_var.get().strip() or str(Path.cwd())
        picked = filedialog.askdirectory(initialdir=initial, title="Select folder to scan")
        if picked:
            self._scan_path_var.set(picked)

    def _sync_git_banner(self) -> None:
        if not git_available():
            self._git_banner.configure(
                text="Git: not found in PATH — install Git for Windows and restart the app.",
                text_color="#f87171",
            )
            return
        raw = self._scan_path_var.get().strip()
        if not raw:
            self._git_banner.configure(text="Git: enter a scan folder path.", text_color="#94a3b8")
            return
        p = Path(raw)
        if not p.is_dir():
            self._git_banner.configure(text="Git: scan path is not a directory.", text_color="#fbbf24")
            return
        root = find_git_root(p)
        if root:
            self._git_banner.configure(
                text=f"Git: repository root → {root}",
                text_color="#34d399",
            )
        else:
            self._git_banner.configure(
                text="Git: no repository — deploy needs a folder inside a Git working tree.",
                text_color="#fbbf24",
            )

    def _pending_n(self) -> int:
        return sum(1 for s in self._vault if s.status == "pending")

    def _update_header_stats(self) -> None:
        self._pending_count.configure(text=str(self._pending_n()))

    def _clear_cards(self) -> None:
        for w in self._card_frames:
            w.destroy()
        self._card_frames.clear()

    def _refresh_cards(self) -> None:
        self._clear_cards()
        self._update_header_stats()

        if not self._vault and not self._is_scanning:
            empty = ctk.CTkLabel(
                self._scroll,
                text="NO SYSTEMIC IMPROVEMENTS IN VAULT",
                font=ctk.CTkFont(family="Consolas", size=13),
                text_color="#475569",
            )
            empty.pack(pady=48)
            self._card_frames.append(empty)
            return

        for s in self._vault:
            card = self._make_card(s)
            card.pack(fill="x", padx=12, pady=10)
            self._card_frames.append(card)

    def _impact_color(self, impact: Impact) -> str:
        if impact == "high":
            return "#fb923c"
        if impact == "medium":
            return "#38bdf8"
        return "#94a3b8"

    def _make_card(self, s: Suggestion) -> ctk.CTkFrame:
        border = "#334155"
        bg = "#0f172a"
        if s.status == "approved":
            border = "#05966980"
            bg = "#022c2218"
        elif s.status == "applied":
            border = "#10b98155"
            bg = "#064e3a15"
        elif s.status == "rejected":
            border = "#7f1d1d55"
            bg = "#450a0a12"

        outer = ctk.CTkFrame(
            self._scroll,
            fg_color=bg,
            corner_radius=16,
            border_width=1,
            border_color=border,
        )

        top = ctk.CTkFrame(outer, fg_color="transparent")
        top.pack(fill="x", padx=20, pady=(18, 8))

        id_row = ctk.CTkFrame(top, fg_color="transparent")
        id_row.pack(fill="x")

        ctk.CTkLabel(
            id_row,
            text=s.id.upper(),
            font=ctk.CTkFont(size=10, weight="bold"),
            text_color="#64748b",
            fg_color="#1e293b",
            corner_radius=6,
            width=0,
        ).pack(side="left", padx=(0, 10))
        ctk.CTkLabel(
            id_row,
            text=s.title,
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#f1f5f9",
        ).pack(side="left")

        status_colors = {
            "pending": ("#a78bfa", "#4c1d95"),
            "approved": ("#34d399", "#064e3a"),
            "applied": ("#6ee7b7", "#022c22"),
            "rejected": ("#f87171", "#450a0a"),
        }
        sc, bc = status_colors[s.status]
        ctk.CTkLabel(
            id_row,
            text=s.status.upper(),
            font=ctk.CTkFont(size=10, weight="bold"),
            fg_color=bc,
            text_color=sc,
            corner_radius=8,
        ).pack(side="right")

        ctk.CTkLabel(
            outer,
            text=s.long,
            font=ctk.CTkFont(size=13),
            text_color="#94a3b8",
            wraplength=920,
            justify="left",
        ).pack(anchor="w", padx=20, pady=(0, 12))

        meta = ctk.CTkFrame(outer, fg_color="transparent")
        meta.pack(fill="x", padx=20, pady=(0, 8))

        ctk.CTkLabel(
            meta,
            text=f"Category: {s.category}",
            font=ctk.CTkFont(size=11, weight="bold"),
            text_color="#cbd5e1",
        ).pack(side="left", padx=(0, 16))
        ctk.CTkLabel(
            meta,
            text=f"Source: {s.source}",
            font=ctk.CTkFont(family="Consolas", size=11),
            text_color="#64748b",
        ).pack(side="left", padx=(0, 16))
        ctk.CTkLabel(
            meta,
            text=f"Effort: {s.effort}",
            font=ctk.CTkFont(size=11),
            text_color="#94a3b8",
        ).pack(side="left")

        right_meta = ctk.CTkFrame(meta, fg_color="transparent")
        right_meta.pack(side="right")

        ctk.CTkLabel(
            right_meta,
            text=f"{s.impact.upper()} impact",
            font=ctk.CTkFont(size=10, weight="bold"),
            text_color=self._impact_color(s.impact),
        ).pack(anchor="e")
        bar = ctk.CTkProgressBar(right_meta, width=120, height=8, progress_color="#a855f7")
        bar.set(max(0.05, min(1.0, s.confidence)))
        bar.pack(anchor="e", pady=(4, 0))
        ctk.CTkLabel(
            right_meta,
            text=f"Confidence: {s.confidence * 100:.0f}%",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color="#475569",
        ).pack(anchor="e")

        tags_row = ctk.CTkFrame(outer, fg_color="transparent")
        tags_row.pack(fill="x", padx=20, pady=(4, 12))
        for tag in s.tags:
            ctk.CTkLabel(
                tags_row,
                text=f" #{tag}",
                font=ctk.CTkFont(family="Consolas", size=10),
                text_color="#64748b",
            ).pack(side="left", padx=(0, 8))

        sep = ctk.CTkFrame(outer, fg_color="#1e293b", height=1)
        sep.pack(fill="x", padx=16, pady=(0, 12))

        if s.status == "approved":
            diff_frame = ctk.CTkFrame(outer, fg_color="#020617", corner_radius=10, border_width=1, border_color="#334155")
            diff_frame.pack(fill="x", padx=20, pady=(0, 12))
            ctk.CTkLabel(
                diff_frame,
                text="Diff preview → .csil-suggestions/<id>.md (Git commit payload)",
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color="#64748b",
            ).pack(anchor="w", padx=12, pady=(10, 4))
            tb = ctk.CTkTextbox(
                diff_frame,
                height=140,
                font=ctk.CTkFont(family="Consolas", size=12),
                fg_color="#020617",
                text_color="#e2e8f0",
                border_width=0,
            )
            tb.pack(fill="x", padx=8, pady=(0, 10))
            tb.insert("1.0", build_record_markdown(s, self._scan_path_display()))
            tb.configure(state="disabled")

        if s.status == "applied":
            eval_frame = ctk.CTkFrame(outer, fg_color="#022c2218", corner_radius=12, border_width=1, border_color="#065f46")
            eval_frame.pack(fill="x", padx=20, pady=(0, 12))
            ctk.CTkLabel(
                eval_frame,
                text="Post-deployment evaluator (simulated)",
                font=ctk.CTkFont(size=12, weight="bold"),
                text_color="#6ee7b7",
            ).pack(anchor="w", padx=14, pady=(12, 8))

            grid = ctk.CTkFrame(eval_frame, fg_color="transparent")
            grid.pack(fill="x", padx=12, pady=(0, 12))

            metrics = [
                ("Latency delta", "-12.4% (-82ms)", "#34d399"),
                ("Error rate", "0.02% (stable)", "#94a3b8"),
                ("Cost efficiency", "+4.1% (+$0.12/k tok)", "#f87171"),
            ]
            for i, (name, val, col) in enumerate(metrics):
                cell = ctk.CTkFrame(grid, fg_color="#0f172a", corner_radius=8, border_width=1, border_color="#1e293b")
                cell.grid(row=0, column=i, padx=6, pady=4, sticky="nsew")
                grid.grid_columnconfigure(i, weight=1)
                ctk.CTkLabel(
                    cell,
                    text=name.upper(),
                    font=ctk.CTkFont(size=9, weight="bold"),
                    text_color="#64748b",
                ).pack(anchor="w", padx=10, pady=(10, 4))
                ctk.CTkLabel(
                    cell,
                    text=val,
                    font=ctk.CTkFont(size=15, weight="bold"),
                    text_color=col,
                ).pack(anchor="w", padx=10, pady=(0, 10))

            ctk.CTkLabel(
                eval_frame,
                text="Evaluator: ~92% confidence in performance gain (mock).",
                font=ctk.CTkFont(size=11),
                text_color="#94a3b8",
            ).pack(anchor="w", padx=14, pady=(0, 12))

        footer = ctk.CTkFrame(outer, fg_color="transparent")
        footer.pack(fill="x", padx=20, pady=(0, 18))

        if s.applied_commit and s.git_branch:
            commit_txt = f"{s.applied_commit[:7]}  ·  {s.git_branch}"
        elif s.applied_commit:
            commit_txt = f"COMMIT: {s.applied_commit}"
        else:
            commit_txt = "STAGED — no commit yet"
        ctk.CTkLabel(
            footer,
            text=commit_txt,
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color="#475569",
        ).pack(side="left")

        btn_frame = ctk.CTkFrame(footer, fg_color="transparent")
        btn_frame.pack(side="right")

        if s.status == "pending":
            ctk.CTkButton(
                btn_frame,
                text="Harness",
                width=88,
                height=32,
                fg_color="#0369a1",
                hover_color="#075985",
                command=lambda t=s.title: self._run_named_harness(t),
            ).pack(side="right", padx=(8, 0))
            if "react" in s.tags:
                ctk.CTkButton(
                    btn_frame,
                    text="Stub .tsx",
                    width=96,
                    height=32,
                    fg_color="#4338ca",
                    hover_color="#3730a3",
                    command=lambda t=s.title: self._save_react_stub(t),
                ).pack(side="right", padx=(8, 0))
            ctk.CTkButton(
                btn_frame,
                text="Reject",
                width=100,
                height=32,
                fg_color="#450a0a",
                hover_color="#7f1d1d",
                border_width=1,
                border_color="#991b1b",
                command=lambda sid=s.id: self._approve(sid, approved=False),
            ).pack(side="right", padx=(8, 0))
            ctk.CTkButton(
                btn_frame,
                text="Approve evolution",
                width=160,
                height=32,
                fg_color="#f8fafc",
                text_color="#0f172a",
                hover_color="#e2e8f0",
                command=lambda sid=s.id: self._approve(sid, approved=True),
            ).pack(side="right")

        elif s.status == "approved":
            busy = self._applying_id == s.id
            ctk.CTkButton(
                btn_frame,
                text="Committing…" if busy else "Deploy change",
                width=140,
                height=32,
                fg_color="#059669",
                hover_color="#047857",
                state="disabled" if busy else "normal",
                command=lambda sid=s.id: self._apply_change(sid),
            ).pack(side="right")

        elif s.status == "applied":
            busy = self._rolling_back_id == s.id
            ctk.CTkButton(
                btn_frame,
                text="Reverting…" if busy else "Emergency rollback",
                width=170,
                height=32,
                fg_color="#7f1d1d",
                hover_color="#b91c1c",
                state="disabled" if busy else "normal",
                command=lambda sid=s.id: self._rollback(sid),
            ).pack(side="right")

        return outer

    def _approve(self, sid: str, approved: bool) -> None:
        def upd(s: Suggestion) -> Suggestion:
            if s.id != sid:
                return s
            if approved:
                return Suggestion(**{**asdict(s), "status": "approved"})
            return Suggestion(
                **{**asdict(s), "status": "rejected", "applied_commit": None, "git_branch": None}
            )

        self._vault = [upd(s) for s in self._vault]
        self._refresh_cards()

    def _apply_change(self, sid: str) -> None:
        if not git_available():
            messagebox.showerror("Git", "git executable not found in PATH.")
            return
        raw = self._scan_path_var.get().strip()
        if not raw:
            messagebox.showerror("Deploy", "Set a scan folder inside your Git repository.")
            return
        repo = find_git_root(Path(raw))
        if not repo:
            messagebox.showerror(
                "Deploy",
                "Scan path is not inside a Git repository. Open a repo root or subfolder.",
            )
            return
        sug = next((x for x in self._vault if x.id == sid), None)
        if not sug:
            return

        self._applying_id = sid
        self._refresh_cards()
        scan_display = self._scan_path_display()
        body = build_record_markdown(sug, scan_display)

        def worker() -> None:
            res = deploy_suggestion_record(repo, sug.id, sug.title, body)

            def done() -> None:
                self._applying_id = None
                if res.ok:
                    self._vault = [
                        (
                            Suggestion(
                                **{
                                    **asdict(x),
                                    "status": "applied",
                                    "applied_commit": res.commit_sha,
                                    "git_branch": res.branch_name,
                                }
                            )
                            if x.id == sid
                            else x
                        )
                        for x in self._vault
                    ]
                    messagebox.showinfo("Deploy", res.message)
                else:
                    messagebox.showerror("Deploy failed", res.message)
                self._refresh_cards()

            self.after(0, done)

        threading.Thread(target=worker, daemon=True).start()

    def _rollback(self, sid: str) -> None:
        sug = next((x for x in self._vault if x.id == sid), None)
        if not sug:
            return

        def clear_vault_state() -> None:
            self._vault = [
                (
                    Suggestion(
                        **{
                            **asdict(s),
                            "status": "rejected",
                            "applied_commit": None,
                            "git_branch": None,
                        }
                    )
                    if s.id == sid
                    else s
                )
                for s in self._vault
            ]
            self._rolling_back_id = None
            self._refresh_cards()

        if not sug.git_branch:
            self._rolling_back_id = sid
            self._refresh_cards()
            self.after(1500, clear_vault_state)
            return

        if not git_available():
            messagebox.showerror("Git", "git executable not found in PATH.")
            return
        raw = self._scan_path_var.get().strip()
        repo = find_git_root(Path(raw)) if raw else None
        if not repo:
            messagebox.showerror("Rollback", "Scan path is not inside a Git repository.")
            return

        self._rolling_back_id = sid
        self._refresh_cards()
        branch = sug.git_branch

        def worker() -> None:
            ok, msg = rollback_deploy_branch(repo, branch)

            def done() -> None:
                self._rolling_back_id = None
                if ok:
                    self._vault = [
                        (
                            Suggestion(
                                **{
                                    **asdict(s),
                                    "status": "rejected",
                                    "applied_commit": None,
                                    "git_branch": None,
                                }
                            )
                            if s.id == sid
                            else s
                        )
                        for s in self._vault
                    ]
                else:
                    messagebox.showwarning("Rollback", msg)
                self._refresh_cards()

            self.after(0, done)

        threading.Thread(target=worker, daemon=True).start()

    def _on_initiate_scan(self) -> None:
        if self._is_scanning:
            return
        raw = self._scan_path_var.get().strip()
        root = Path(raw) if raw else None
        if not root or not root.is_dir():
            messagebox.showerror("Scan", "Choose a valid folder to scan.")
            return

        self._is_scanning = True
        self._scan_btn.configure(state="disabled")
        self._status_line.configure(
            text="SCANNER_AGENT: WALKING_TREE…",
            text_color="#c084fc",
        )
        self._refresh_cards()

        def progress(msg: str) -> None:
            self.after(0, lambda m=msg: self._status_line.configure(text=m))

        def worker() -> None:
            found = scan_folder(root, progress=progress)

            def done() -> None:
                existing = {s.title for s in self._vault}
                added = 0
                for item in found:
                    if item["title"] in existing:
                        continue
                    existing.add(item["title"])
                    self._vault.insert(
                        0,
                        Suggestion(
                            id=_rand_id("scan"),
                            title=item["title"],
                            short=item["short"],
                            long=item["long"],
                            category=item["category"],  # type: ignore[arg-type]
                            source="scanner_agent",
                            confidence=float(item["confidence"]),
                            impact=item["impact"],  # type: ignore[arg-type]
                            effort=item["effort"],  # type: ignore[arg-type]
                            status="pending",
                            tags=list(item["tags"]),
                            created_at=_now_iso(),
                        ),
                    )
                    added += 1
                self._is_scanning = False
                self._scan_btn.configure(state="normal")
                self._status_line.configure(
                    text=f"SCANNER_STATUS: STANDBY — +{added} suggestion(s)",
                    text_color="#64748b",
                )
                self._refresh_cards()

            self.after(0, done)

        threading.Thread(target=worker, daemon=True).start()


def main() -> None:
    app = SuggestionsVaultApp()
    app.mainloop()


if __name__ == "__main__":
    main()
