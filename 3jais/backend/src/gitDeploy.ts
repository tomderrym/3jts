import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Suggestion } from "./types.js";

function runGit(cwd: string, args: string[]): { ok: boolean; out: string; err: string } {
  try {
    const out = execSync(`git ${args.join(" ")}`, {
      cwd,
      encoding: "utf8",
      maxBuffer: 512_000,
    });
    return { ok: true, out: out.trim(), err: "" };
  } catch (e: unknown) {
    const err = e as { stderr?: Buffer; message?: string };
    return { ok: false, out: "", err: err.stderr?.toString() || err.message || String(e) };
  }
}

export function findGitRoot(start: string): string | null {
  const r = runGit(start, ["rev-parse", "--show-toplevel"]);
  return r.ok ? r.out : null;
}

function slugId(id: string): string {
  return id.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 48) || "suggestion";
}

export function buildRecordMarkdown(s: Suggestion, workspaceLabel: string): string {
  return [
    "---",
    `3jais_id: ${s.id}`,
    `title: ${JSON.stringify(s.title)}`,
    `category: ${s.category}`,
    `status: approved_record`,
    `workspace: ${workspaceLabel}`,
    `created_at: ${s.created_at}`,
    "tags:",
    ...s.tags.map((t) => `  - ${t}`),
    "---",
    "",
    `## ${s.title}`,
    "",
    s.short,
    "",
    s.long,
    "",
    "### Scores",
    "",
    `- priority (at deploy): ${s.priorityScore ?? "n/a"}`,
    `- impact: ${s.impact}, effort: ${s.effort}, risk: ${s.risk}`,
    "",
  ].join("\n");
}

export type DeployResult = {
  ok: boolean;
  commitSha?: string;
  branch?: string;
  relativePath?: string;
  message: string;
};

export function getDeployPreview(
  s: Suggestion,
  workspaceLabel: string
): { relativePath: string; body: string } {
  const frag = slugId(s.id);
  const relativePath = path.join(".3jais-applied", `${frag}.md`).replace(/\\/g, "/");
  return {
    relativePath,
    body: buildRecordMarkdown(s, workspaceLabel),
  };
}

/**
 * Creates branch 3jais/<slug>, writes .3jais-applied/<id>.md, commits, checks out previous branch.
 */
export function deploySuggestionToGit(s: Suggestion, workspaceRoot: string): DeployResult {
  const root = findGitRoot(workspaceRoot);
  if (!root) {
    return { ok: false, message: "Not a git repository (set WORKSPACE_ROOT to a repo root or subfolder)." };
  }

  const base = runGit(root, ["rev-parse", "HEAD"]);
  if (!base.ok) return { ok: false, message: "Could not read HEAD." };

  const origBranch = runGit(root, ["branch", "--show-current"]);
  const branchBase = `3jais/${slugId(s.id)}`;
  let branch = branchBase;
  for (let i = 0; i < 50; i++) {
    const cand = i === 0 ? branchBase : `${branchBase}-${i}`;
    const exists = runGit(root, ["show-ref", "-q", "--verify", `refs/heads/${cand}`]);
    if (!exists.ok) {
      branch = cand;
      break;
    }
  }

  const co = runGit(root, ["checkout", "-b", branch]);
  if (!co.ok) {
    return { ok: false, message: `Could not create branch: ${co.err}` };
  }

  const rel = getDeployPreview(s, workspaceRoot);
  const absDir = path.join(root, ".3jais-applied");
  const absFile = path.join(root, rel.relativePath);

  try {
    fs.mkdirSync(absDir, { recursive: true });
    fs.writeFileSync(absFile, rel.body, "utf8");
  } catch (e) {
    runGit(root, ["checkout", base.out]);
    runGit(root, ["branch", "-D", branch]);
    return { ok: false, message: `Write failed: ${e}` };
  }

  const add = runGit(root, ["add", "--", rel.relativePath]);
  if (!add.ok) {
    try {
      fs.unlinkSync(absFile);
    } catch {
      /* ignore */
    }
    runGit(root, ["checkout", base.out]);
    runGit(root, ["branch", "-D", branch]);
    return { ok: false, message: `git add failed: ${add.err}` };
  }

  const msg = `3jais: apply ${s.id} — ${s.title.slice(0, 60)}`;
  const commit = runGit(root, ["commit", "-m", msg]);
  if (!commit.ok) {
    runGit(root, ["restore", "--staged", rel.relativePath]);
    try {
      fs.unlinkSync(absFile);
    } catch {
      /* ignore */
    }
    runGit(root, ["checkout", base.out]);
    runGit(root, ["branch", "-D", branch]);
    return { ok: false, message: `git commit failed: ${commit.err}` };
  }

  const sha = runGit(root, ["rev-parse", "HEAD"]);
  const shaVal = sha.ok ? sha.out : "";

  if (origBranch.ok && origBranch.out) {
    runGit(root, ["checkout", origBranch.out]);
  } else {
    runGit(root, ["checkout", base.out]);
  }

  return {
    ok: true,
    commitSha: shaVal,
    branch,
    relativePath: rel.relativePath,
    message: `Committed on ${branch} @ ${shaVal.slice(0, 7)} — checkout restored.`,
  };
}
