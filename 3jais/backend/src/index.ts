import cors from "cors";
import express from "express";
import { runAppScannerAgent } from "./agents/appScannerAgent.js";
import { canApprove } from "./services/policy.js";
import { MCP_STYLE_TOOLS, invokeTool } from "./tools/toolRegistry.js";
import {
  WORKSPACE_ROOT,
  getConstraints,
  getFlow,
  getGoals,
  getRankedVault,
  saveFlow,
  setSuggestionStatus,
  upsertSuggestions,
} from "./state.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = Number(process.env.PORT) || 3847;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, workspaceRoot: WORKSPACE_ROOT });
});

app.get("/api/goals", (_req, res) => {
  res.json(getGoals());
});

app.get("/api/constraints", (_req, res) => {
  res.json(getConstraints());
});

app.get("/api/tools", (_req, res) => {
  res.json(MCP_STYLE_TOOLS);
});

app.post("/api/tools/invoke", async (req, res) => {
  try {
    const { name, args } = req.body as { name: string; args?: Record<string, unknown> };
    const out = await invokeTool(name as "scan_workspace" | "read_file" | "git_status", args ?? {}, WORKSPACE_ROOT);
    res.json({ ok: true, result: out });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

app.get("/api/suggestions", (_req, res) => {
  const goals = getGoals();
  const constraints = getConstraints();
  const ranked = getRankedVault().map((s) => ({
    ...s,
    _canApprove: canApprove(s, goals, constraints),
  }));
  res.json(ranked);
});

app.get("/api/intelligence", (_req, res) => {
  const goals = getGoals();
  const constraints = getConstraints();
  const ranked = getRankedVault();
  const blocked = ranked.filter((s) => s.status === "pending" && !canApprove(s, goals, constraints).ok);
  res.json({
    activeGoals: goals.filter((g) => g.active),
    topSuggestions: ranked.filter((s) => s.status === "pending").slice(0, 5),
    blockedSuggestions: blocked.slice(0, 10),
  });
});

app.post("/api/suggestions/scan", async (_req, res) => {
  const found = await runAppScannerAgent(WORKSPACE_ROOT);
  upsertSuggestions(found);
  res.json({ added: found.length, ids: found.map((s) => s.id) });
});

app.post("/api/suggestions/:id/approve", (req, res) => {
  const goals = getGoals();
  const constraints = getConstraints();
  const ranked = getRankedVault();
  const s = ranked.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "not found" });
  const gate = canApprove(s, goals, constraints);
  if (!gate.ok) return res.status(403).json({ error: "policy blocked", reasons: gate.reasons });
  const updated = setSuggestionStatus(req.params.id, "approved");
  res.json(updated);
});

app.post("/api/suggestions/:id/reject", (req, res) => {
  const updated = setSuggestionStatus(req.params.id, "rejected");
  if (!updated) return res.status(404).json({ error: "not found" });
  res.json(updated);
});

app.get("/api/flow", (_req, res) => {
  res.json(getFlow());
});

app.post("/api/flow", (req, res) => {
  const { nodes, edges, name } = req.body;
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    return res.status(400).json({ error: "nodes and edges required" });
  }
  res.json(saveFlow({ nodes, edges, name }));
});

app.listen(PORT, () => {
  console.log(`3jais backend http://127.0.0.1:${PORT}`);
});
