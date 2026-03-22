import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type ToolName = "scan_workspace" | "read_file" | "git_status";

export type ToolDef = {
  name: ToolName;
  description: string;
  inputSchema: Record<string, string>;
  risk: "low" | "medium" | "high";
};

export const MCP_STYLE_TOOLS: ToolDef[] = [
  {
    name: "scan_workspace",
    description: "List files and directories (non-recursive or shallow) under a root path",
    inputSchema: { root: "string", maxDepth: "number?" },
    risk: "low",
  },
  {
    name: "read_file",
    description: "Read UTF-8 text from a path inside workspace bounds",
    inputSchema: { path: "string", maxBytes: "number?" },
    risk: "low",
  },
  {
    name: "git_status",
    description: "Run git status --porcelain in a repo root",
    inputSchema: { repoRoot: "string" },
    risk: "low",
  },
];

function safeResolve(root: string, target: string): string {
  const resolved = path.resolve(root, target);
  const rootResolved = path.resolve(root);
  if (!resolved.startsWith(rootResolved)) {
    throw new Error("path escapes workspace root");
  }
  return resolved;
}

function scanWorkspace(root: string, maxDepth = 1): { path: string; type: "file" | "dir" }[] {
  const out: { path: string; type: "file" | "dir" }[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > maxDepth) return;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") && e.name !== ".github") continue;
      if (e.name === "node_modules") continue;
      const full = path.join(dir, e.name);
      const rel = path.relative(root, full);
      out.push({ path: rel || ".", type: e.isDirectory() ? "dir" : "file" });
      if (e.isDirectory() && depth < maxDepth) walk(full, depth + 1);
    }
  };
  walk(path.resolve(root), 0);
  return out.slice(0, 200);
}

function readFileTool(root: string, filePath: string, maxBytes = 32_000): string {
  const abs = safeResolve(root, filePath);
  const st = fs.statSync(abs);
  if (!st.isFile()) throw new Error("not a file");
  if (st.size > maxBytes) return fs.readFileSync(abs, "utf8").slice(0, maxBytes) + "\n…[truncated]";
  return fs.readFileSync(abs, "utf8");
}

function gitStatus(repoRoot: string): string {
  try {
    return execSync("git status --porcelain", {
      cwd: path.resolve(repoRoot),
      encoding: "utf8",
      maxBuffer: 512_000,
    });
  } catch (e: unknown) {
    const err = e as { stderr?: Buffer };
    return err.stderr?.toString() || String(e);
  }
}

export async function invokeTool(
  name: ToolName,
  args: Record<string, unknown>,
  workspaceRoot: string
): Promise<unknown> {
  switch (name) {
    case "scan_workspace": {
      const root = String(args.root ?? workspaceRoot);
      const maxDepth = Number(args.maxDepth ?? 1);
      return scanWorkspace(root, maxDepth);
    }
    case "read_file": {
      const p = String(args.path);
      const maxBytes = args.maxBytes != null ? Number(args.maxBytes) : 32_000;
      return readFileTool(workspaceRoot, p, maxBytes);
    }
    case "git_status": {
      const repo = String(args.repoRoot ?? workspaceRoot);
      return gitStatus(repo);
    }
    default:
      throw new Error(`unknown tool: ${name}`);
  }
}
