import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Constraint, FlowEdge, FlowNode, Goal, SavedFlow, Suggestion } from "./types.js";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DATA_DIR = path.join(backendRoot, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

export type PersistedState = {
  version: 1;
  vault: Suggestion[];
  goals: Goal[];
  constraints: Constraint[];
  flow: SavedFlow;
};

const DEFAULT_FLOW: SavedFlow = {
  id: "default",
  name: "Default pipeline",
  nodes: [
    { id: "n1", type: "input", position: { x: 0, y: 80 }, data: { label: "Scanner" } },
    { id: "n2", type: "process", position: { x: 220, y: 80 }, data: { label: "Vault" } },
    { id: "n3", type: "process", position: { x: 440, y: 80 }, data: { label: "Policy + Priority" } },
    { id: "n4", type: "output", position: { x: 660, y: 80 }, data: { label: "Approve → Git" } },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n2", target: "n3" },
    { id: "e3", source: "n3", target: "n4" },
  ],
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_GOALS: Goal[] = [
  {
    id: "goal_001",
    title: "Improve App Builder Quality",
    description: "Increase quality of generated apps and vault governance",
    type: "product",
    successMetrics: [{ metric: "code_quality_score", target: 0.9 }],
    priority: 10,
    active: true,
  },
  {
    id: "goal_002",
    title: "Reliability and docs",
    description: "dependencies workflow git docs onboarding",
    type: "technical",
    successMetrics: [{ metric: "incident_rate", target: 0.05 }],
    priority: 8,
    active: true,
  },
];

export const DEFAULT_CONSTRAINTS: Constraint[] = [
  {
    id: "rule_001",
    rule: "Do not create duplicate features",
    type: "hard",
    category: "system",
  },
  {
    id: "rule_002",
    rule: "Prefer simple solutions over complex ones",
    type: "soft",
    category: "code",
  },
];

export const DEFAULT_VAULT: Suggestion[] = [
  {
    id: "seed_001",
    title: "Add retry logic for agent tasks",
    short: "Backoff on transient failures",
    long: "Implement exponential backoff for failed executions to improve reliability.",
    category: "reliability",
    source: "ai_generated",
    impact: "high",
    effort: "medium",
    confidence: 0.82,
    businessValue: "high",
    risk: "low",
    complexity: "medium",
    status: "pending",
    tags: ["agent", "workflow", "reliability"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seed_dup_demo",
    title: "duplicate dashboard experiment",
    short: "Try duplicate UI redesign",
    long: "This title triggers the duplicate hard constraint for demo purposes.",
    category: "feature",
    source: "user_feedback",
    impact: "low",
    effort: "high",
    confidence: 0.5,
    businessValue: "low",
    risk: "high",
    complexity: "high",
    status: "pending",
    tags: ["ui"],
    created_at: new Date().toISOString(),
  },
];

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadPersistedState(): PersistedState {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      version: 1,
      vault: structuredClone(DEFAULT_VAULT),
      goals: structuredClone(DEFAULT_GOALS),
      constraints: structuredClone(DEFAULT_CONSTRAINTS),
      flow: structuredClone(DEFAULT_FLOW),
    };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) as PersistedState;
    if (!Array.isArray(raw.vault) || !raw.flow) throw new Error("invalid shape");
    return {
      version: 1,
      vault: raw.vault,
      goals: raw.goals?.length ? raw.goals : structuredClone(DEFAULT_GOALS),
      constraints: raw.constraints?.length ? raw.constraints : structuredClone(DEFAULT_CONSTRAINTS),
      flow: raw.flow,
    };
  } catch {
    return {
      version: 1,
      vault: structuredClone(DEFAULT_VAULT),
      goals: structuredClone(DEFAULT_GOALS),
      constraints: structuredClone(DEFAULT_CONSTRAINTS),
      flow: structuredClone(DEFAULT_FLOW),
    };
  }
}

export function savePersistedState(state: PersistedState): void {
  ensureDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

export function stateFileExists(): boolean {
  return fs.existsSync(STATE_FILE);
}

export function persistDefaultSeed(): void {
  if (stateFileExists()) return;
  savePersistedState({
    version: 1,
    vault: structuredClone(DEFAULT_VAULT),
    goals: structuredClone(DEFAULT_GOALS),
    constraints: structuredClone(DEFAULT_CONSTRAINTS),
    flow: structuredClone(DEFAULT_FLOW),
  });
}
