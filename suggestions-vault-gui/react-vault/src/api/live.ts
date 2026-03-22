import type { Suggestion } from "../types";

/** Set `VITE_LIVE_API=1` and run 3jAIS backend (port 3847); Vite proxies `/api`. */
export const LIVE_API = import.meta.env.VITE_LIVE_API === "1";

export async function fetchHealth(): Promise<{ ok: boolean; workspaceRoot: string }> {
  const r = await fetch("/api/health");
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchSuggestionsLive(): Promise<Suggestion[]> {
  const r = await fetch("/api/suggestions");
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function scanLive(): Promise<{ added: number }> {
  const r = await fetch("/api/suggestions/scan", { method: "POST" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function approveLive(id: string): Promise<Suggestion> {
  const r = await fetch(`/api/suggestions/${id}/approve`, { method: "POST" });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || (await r.text()));
  }
  return r.json();
}

export async function rejectLive(id: string): Promise<Suggestion> {
  const r = await fetch(`/api/suggestions/${id}/reject`, { method: "POST" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deployPreviewLive(id: string): Promise<{ relativePath: string; body: string }> {
  const r = await fetch(`/api/suggestions/${id}/deploy-preview`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || (await r.text()));
  }
  return r.json();
}

export async function deployLive(id: string): Promise<unknown> {
  const r = await fetch(`/api/suggestions/${id}/deploy`, { method: "POST" });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || (await r.text()));
  }
  return r.json();
}
