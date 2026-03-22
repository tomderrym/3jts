const base = "";

export type Tier = "low" | "medium" | "high";

export type Suggestion = {
  id: string;
  title: string;
  short: string;
  long: string;
  category: string;
  source: string;
  impact: Tier;
  effort: Tier;
  confidence: number;
  businessValue: Tier;
  risk: Tier;
  complexity: Tier;
  status: string;
  tags: string[];
  created_at: string;
  priorityScore?: number;
  _canApprove?: { ok: boolean; reasons: string[] };
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  type: string;
  successMetrics: { metric: string; target: number }[];
  priority: number;
  active: boolean;
};

export async function fetchSuggestions(): Promise<Suggestion[]> {
  const r = await fetch(`${base}/api/suggestions`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchIntelligence(): Promise<{
  activeGoals: Goal[];
  topSuggestions: Suggestion[];
  blockedSuggestions: Suggestion[];
}> {
  const r = await fetch(`${base}/api/intelligence`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function runScan(): Promise<{ added: number }> {
  const r = await fetch(`${base}/api/suggestions/scan`, { method: "POST" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function approve(id: string): Promise<void> {
  const r = await fetch(`${base}/api/suggestions/${id}/approve`, { method: "POST" });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || (await r.text()));
  }
}

export async function reject(id: string): Promise<void> {
  const r = await fetch(`${base}/api/suggestions/${id}/reject`, { method: "POST" });
  if (!r.ok) throw new Error(await r.text());
}

export async function fetchFlow(): Promise<{
  id: string;
  name: string;
  nodes: { id: string; type: string; position: { x: number; y: number }; data: { label: string } }[];
  edges: { id: string; source: string; target: string }[];
}> {
  const r = await fetch(`${base}/api/flow`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function saveFlow(body: {
  nodes: { id: string; type: string; position: { x: number; y: number }; data: { label: string } }[];
  edges: { id: string; source: string; target: string }[];
  name?: string;
}): Promise<unknown> {
  const r = await fetch(`${base}/api/flow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
