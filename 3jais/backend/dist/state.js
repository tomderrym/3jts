import path from "node:path";
import { fileURLToPath } from "node:url";
import { rankSuggestions } from "./services/priorityEngine.js";
const goals = [
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
const constraints = [
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
let vault = [
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
let flow = {
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
export function getGoals() {
    return [...goals];
}
export function getConstraints() {
    return [...constraints];
}
export function getRankedVault() {
    return rankSuggestions(vault);
}
export function getVault() {
    return [...vault];
}
export function upsertSuggestions(items) {
    const ids = new Set(vault.map((s) => s.id));
    for (const s of items) {
        if (!ids.has(s.id)) {
            vault.push(s);
            ids.add(s.id);
        }
    }
}
export function setSuggestionStatus(id, status) {
    const i = vault.findIndex((s) => s.id === id);
    if (i < 0)
        return null;
    vault[i] = { ...vault[i], status };
    return vault[i];
}
export function getFlow() {
    return { ...flow, nodes: [...flow.nodes], edges: [...flow.edges] };
}
export function saveFlow(payload) {
    flow = {
        ...flow,
        name: payload.name ?? flow.name,
        nodes: payload.nodes,
        edges: payload.edges,
        updatedAt: new Date().toISOString(),
    };
    return getFlow();
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root (3jts) when running from backend/src; override with WORKSPACE_ROOT */
export const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.resolve(__dirname, "../../..");
