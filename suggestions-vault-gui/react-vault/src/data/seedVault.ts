import type { Suggestion } from "../types";

export const SEED_VAULT: Suggestion[] = [
  {
    id: "opt_001",
    title: "Context Window Compression",
    short: "Summarize long histories",
    long:
      "Implement a recursive summarization agent to compress conversation history when approaching token limits.",
    category: "performance",
    source: "scanner_agent",
    confidence: 0.94,
    impact: "high",
    effort: "medium",
    status: "pending",
    tags: ["llm", "token-management", "context"],
    created_at: new Date().toISOString(),
  },
];

export function mockScanBatch(): Suggestion[] {
  const ts = new Date().toISOString();
  return [
    {
      id: `scan_${Math.random().toString(36).slice(2, 8)}`,
      title: "react: VaultStatusChip — surface scanner state",
      short: "Small UI affordance for SCANNER_STATUS in React shells",
      long:
        "Add a presentational chip bound to scanner phase (standby / walking_tree / idle) so operators see agent progress without logs.",
      category: "feature",
      source: "scanner_agent",
      confidence: 0.78,
      impact: "medium",
      effort: "low",
      status: "pending",
      tags: ["react", "ux", "scanner"],
      created_at: ts,
    },
    {
      id: `scan_${Math.random().toString(36).slice(2, 8)}`,
      title: "Harden git root detection in CI paths",
      short: "Normalize path separators before rev-parse",
      long:
        "When scan_root mixes separators, resolve and re-check git toplevel so deploy does not false-negative on Windows agents.",
      category: "reliability",
      source: "scanner_agent",
      confidence: 0.71,
      impact: "medium",
      effort: "medium",
      status: "pending",
      tags: ["git", "windows", "ci"],
      created_at: ts,
    },
  ];
}
