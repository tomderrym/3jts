import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Constraint, FlowEdge, FlowNode, Goal, SavedFlow, Suggestion } from "./types.js";
import {
  loadPersistedState,
  persistDefaultSeed,
  savePersistedState,
  type PersistedState,
} from "./persistence.js";
import { rankSuggestions } from "./services/priorityEngine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root (3jts) when running from backend/src */
export const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.resolve(__dirname, "../../..");

persistDefaultSeed();
const initial = loadPersistedState();
let goals: Goal[] = initial.goals;
let constraints: Constraint[] = initial.constraints;
let vault: Suggestion[] = initial.vault;
let flow: SavedFlow = initial.flow;

function persist(): void {
  const state: PersistedState = {
    version: 1,
    vault,
    goals,
    constraints,
    flow,
  };
  savePersistedState(state);
}

export function getGoals(): Goal[] {
  return [...goals];
}

export function getConstraints(): Constraint[] {
  return [...constraints];
}

export function getRankedVault(): Suggestion[] {
  return rankSuggestions(vault);
}

export function getVault(): Suggestion[] {
  return [...vault];
}

export function getSuggestionById(id: string): Suggestion | undefined {
  return vault.find((s) => s.id === id);
}

export function upsertSuggestions(items: Suggestion[]): void {
  const ids = new Set(vault.map((s) => s.id));
  for (const s of items) {
    if (!ids.has(s.id)) {
      vault.push(s);
      ids.add(s.id);
    }
  }
  persist();
}

export function setSuggestionStatus(id: string, status: Suggestion["status"]): Suggestion | null {
  const i = vault.findIndex((s) => s.id === id);
  if (i < 0) return null;
  vault[i] = { ...vault[i], status };
  persist();
  return vault[i];
}

export function markSuggestionApplied(
  id: string,
  applied: { applied_commit: string; git_branch: string }
): Suggestion | null {
  const i = vault.findIndex((s) => s.id === id);
  if (i < 0) return null;
  vault[i] = {
    ...vault[i],
    status: "applied",
    applied_commit: applied.applied_commit,
    git_branch: applied.git_branch,
  };
  persist();
  return vault[i];
}

export function getFlow(): SavedFlow {
  return { ...flow, nodes: [...flow.nodes], edges: [...flow.edges] };
}

export function saveFlow(payload: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  name?: string;
}): SavedFlow {
  flow = {
    ...flow,
    name: payload.name ?? flow.name,
    nodes: payload.nodes,
    edges: payload.edges,
    updatedAt: new Date().toISOString(),
  };
  persist();
  return getFlow();
}
