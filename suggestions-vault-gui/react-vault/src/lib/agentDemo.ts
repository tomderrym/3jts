import type { TraceEntry } from "../types";

export const AGENT_PLAYBOOK: string[] = [
  "Use bounded tools (scan, read, git_status) — avoid opaque shell on autopilot.",
  "Ground every vault item in repo evidence (paths, symbols, or metrics).",
  "Separate propose (agent) from approve (human) for high-impact changes.",
  "Write durable records to the repo (.csil-suggestions / .3jais-applied) for auditability.",
  "After deploy: smoke test or measure; keep rollback path explicit.",
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Animated trace that demonstrates how a disciplined agent should behave
 * around the same loop as the Python desktop app.
 */
export async function runEffectiveAgentDemo(opts: {
  scanPath: string;
  onLog: (e: TraceEntry) => void;
  delayMs?: number;
}): Promise<void> {
  const d = opts.delayMs ?? 550;
  const log = (kind: TraceEntry["kind"], title: string, detail: string) => {
    opts.onLog({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      t: Date.now(),
      kind,
      title,
      detail,
    });
  };

  await sleep(d);
  log(
    "plan",
    "Plan (agent)",
    `Workspace: ${opts.scanPath}\n• Map tree and entrypoints\n• Read 1–2 hotspot files\n• Emit structured vault candidates with confidence`
  );

  await sleep(d);
  log(
    "tool",
    "Tool: scan_workspace",
    JSON.stringify(
      {
        name: "scan_workspace",
        args: { maxDepth: 2, include: ["*.ts", "*.tsx", "*.py"] },
        result_summary: "12 dirs, 4 candidate hotspots (package.json, main.py, vite.config.ts, …)",
      },
      null,
      2
    )
  );

  await sleep(d);
  log(
    "tool",
    "Tool: read_file",
    JSON.stringify(
      {
        name: "read_file",
        args: { path: "suggestions-vault-gui/main.py", maxBytes: 8000 },
        result_summary: "Found CSIL vault UI + deploy hooks; align React demo with same markdown record.",
      },
      null,
      2
    )
  );

  await sleep(d);
  log(
    "plan",
    "Rank & propose",
    "Score: confidence × impact / effort. Attach tags for goal alignment. No auto-merge."
  );

  await sleep(d);
  log(
    "human",
    "Human gate",
    "Operator: review card → Approve evolution → Deploy writes markdown branch → optional rollback."
  );
}
