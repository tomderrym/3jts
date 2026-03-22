import { useCallback, useEffect, useState } from "react";
import {
  type Goal,
  type Suggestion,
  approve,
  fetchIntelligence,
  fetchSuggestions,
  reject,
  runScan,
} from "./api";
import FlowBuilder from "./components/FlowBuilder";
import ToolsPanel from "./components/ToolsPanel";
import { ReactFlowProvider } from "@xyflow/react";

type Tab = "vault" | "intelligence" | "flow" | "tools";

export default function App() {
  const [tab, setTab] = useState<Tab>("vault");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [intel, setIntel] = useState<{
    activeGoals: Goal[];
    topSuggestions: Suggestion[];
    blockedSuggestions: Suggestion[];
  } | null>(null);
  const [err, setErr] = useState("");
  const [scanning, setScanning] = useState(false);

  const refresh = useCallback(async () => {
    setErr("");
    try {
      const [s, i] = await Promise.all([fetchSuggestions(), fetchIntelligence()]);
      setSuggestions(s);
      setIntel(i);
    } catch (e) {
      setErr(String(e));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function onScan() {
    setScanning(true);
    setErr("");
    try {
      await runScan();
      await refresh();
    } catch (e) {
      setErr(String(e));
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">3jAIS Control Panel</h1>
        <p className="text-slate-500 text-sm mt-1">
          Vault + priority engine + goals/constraints + flow builder + MCP-style tools. Stability-first: no auto-approve
          in v1.
        </p>
        <nav className="flex flex-wrap gap-2 mt-4">
          {(
            [
              ["vault", "Suggestions Vault"],
              ["intelligence", "System Intelligence"],
              ["flow", "Flow Builder"],
              ["tools", "Tools / Agent"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === k ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {err && (
        <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {err} — is the backend running? <code className="text-red-100">npm run dev</code> from <code>3jais/</code>
        </div>
      )}

      {tab === "vault" && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              disabled={scanning}
              onClick={onScan}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-semibold"
            >
              {scanning ? "Scanning…" : "Run AppScannerAgent"}
            </button>
            <button
              type="button"
              onClick={refresh}
              className="px-4 py-2 rounded-lg border border-slate-600 text-sm text-slate-300 hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {suggestions
              .filter((s) => s.status === "pending")
              .map((s) => {
                const gate = s._canApprove ?? { ok: false, reasons: [] };
                return (
                  <article
                    key={s.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <h2 className="text-lg font-semibold text-white">{s.title}</h2>
                      <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{s.short}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>
                        Priority: <strong className="text-amber-400">{s.priorityScore ?? "—"}</strong>
                      </span>
                      <span>
                        {gate.ok ? (
                          <span className="text-emerald-400">Goal aligned + policy OK</span>
                        ) : (
                          <span className="text-rose-400">Blocked: {gate.reasons.join(" · ") || "policy"}</span>
                        )}
                      </span>
                      <span>
                        Risk: <span className="text-slate-300">{s.risk}</span> · Complexity:{" "}
                        <span className="text-slate-300">{s.complexity}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        disabled={!gate.ok}
                        onClick={() => approve(s.id).then(refresh).catch((e) => setErr(String(e)))}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          gate.ok
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-slate-700 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => reject(s.id).then(refresh).catch((e) => setErr(String(e)))}
                        className="px-4 py-2 rounded-lg text-sm border border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      {tab === "intelligence" && intel && (
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Active goals</h3>
            <ul className="space-y-2">
              {intel.activeGoals.map((g) => (
                <li key={g.id} className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 text-sm">
                  <div className="font-medium text-white">{g.title}</div>
                  <div className="text-slate-500 text-xs mt-1">{g.description}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Top pending (ranked)</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
              {intel.topSuggestions.map((s) => (
                <li key={s.id}>
                  {s.title}{" "}
                  <span className="text-amber-400/90">({s.priorityScore?.toFixed(3) ?? "?"})</span>
                </li>
              ))}
            </ol>
            <h3 className="text-sm font-bold text-rose-400/80 uppercase tracking-wider mt-6 mb-3">
              Blocked by policy
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {intel.blockedSuggestions.map((s) => (
                <li key={s.id} className="border border-slate-800 rounded-lg p-2">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === "flow" && (
        <ReactFlowProvider>
          <FlowBuilder />
        </ReactFlowProvider>
      )}

      {tab === "tools" && <ToolsPanel />}
    </div>
  );
}
