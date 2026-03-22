import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LIVE_API,
  approveLive,
  deployLive,
  fetchHealth,
  fetchSuggestionsLive,
  rejectLive,
  scanLive,
} from "./api/live";
import { mockScanBatch, SEED_VAULT } from "./data/seedVault";
import { AGENT_PLAYBOOK, runEffectiveAgentDemo } from "./lib/agentDemo";
import type { Suggestion, TraceEntry } from "./types";
import SuggestionCard from "./components/SuggestionCard";

function scanPathDisplay(raw: string): string {
  const t = raw.trim();
  if (!t) return "(not set)";
  return t;
}

export default function App() {
  const liveApi = LIVE_API;
  const [vault, setVault] = useState<Suggestion[]>(() => (LIVE_API ? [] : [...SEED_VAULT]));
  const [scanPath, setScanPath] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [statusLine, setStatusLine] = useState("SCANNER_STATUS: STANDBY");
  const [gitBanner, setGitBanner] = useState("Git: …");
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [agentRunning, setAgentRunning] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);
  const [harnessMsg, setHarnessMsg] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const pendingN = useMemo(() => vault.filter((s) => s.status === "pending").length, [vault]);

  const refreshLive = useCallback(async () => {
    if (!liveApi) return;
    setErr("");
    try {
      const list = await fetchSuggestionsLive();
      setVault(list);
      const h = await fetchHealth();
      setGitBanner(`Git: repository workspace → ${h.workspaceRoot}`);
    } catch (e) {
      setErr(String(e));
      setGitBanner("Git: could not reach API — start 3jAIS backend (`npm run dev` in 3jais/)");
    }
  }, [liveApi]);

  useEffect(() => {
    if (liveApi) void refreshLive();
  }, [liveApi, refreshLive]);

  useEffect(() => {
    if (liveApi) return;
    const raw = scanPath.trim();
    if (!raw) {
      setGitBanner("Git: enter a scan folder path (demo heuristics only in browser).");
      return;
    }
    setGitBanner(
      "Git: browser cannot run rev-parse — use Live API mode for real Git banner, or trust your path locally."
    );
  }, [scanPath, liveApi]);

  async function onInitiateScan() {
    if (isScanning) return;
    setErr("");
    if (liveApi) {
      setIsScanning(true);
      setStatusLine("SCANNER_AGENT: WALKING_TREE…");
      try {
        const r = await scanLive();
        await refreshLive();
        setStatusLine(`SCANNER_STATUS: STANDBY — +${r.added} suggestion(s)`);
      } catch (e) {
        setErr(String(e));
        setStatusLine("SCANNER_STATUS: STANDBY");
      } finally {
        setIsScanning(false);
      }
      return;
    }

    if (!scanPath.trim()) {
      setErr("Choose a scan folder path (any non-empty string in demo mode).");
      return;
    }
    setIsScanning(true);
    setStatusLine("SCANNER_AGENT: WALKING_TREE…");
    await new Promise((r) => setTimeout(r, 900));
    const batch = mockScanBatch();
    const titles = new Set(vault.map((s) => s.title));
    const added = batch.filter((b) => !titles.has(b.title));
    setVault((prev) => [...added, ...prev]);
    setIsScanning(false);
    setStatusLine(`SCANNER_STATUS: STANDBY — +${added.length} demo suggestion(s)`);
  }

  async function onApprove(id: string) {
    setErr("");
    if (liveApi) {
      try {
        await approveLive(id);
        await refreshLive();
      } catch (e) {
        setErr(String(e));
      }
      return;
    }
    setVault((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" as const } : s)));
  }

  async function onReject(id: string) {
    setErr("");
    if (liveApi) {
      try {
        await rejectLive(id);
        await refreshLive();
      } catch (e) {
        setErr(String(e));
      }
      return;
    }
    setVault((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "rejected" as const, applied_commit: null, git_branch: null } : s
      )
    );
  }

  async function onDeploy(id: string) {
    setErr("");
    if (liveApi) {
      setApplyingId(id);
      try {
        await deployLive(id);
        await refreshLive();
      } catch (e) {
        setErr(String(e));
      } finally {
        setApplyingId(null);
      }
      return;
    }
    setApplyingId(id);
    await new Promise((r) => setTimeout(r, 1200));
    const sha = `demo_${Math.random().toString(36).slice(2, 10)}`;
    const branch = `demo/${id.replace(/[^a-z0-9]+/gi, "-").slice(0, 24)}`;
    setVault((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "applied" as const, applied_commit: sha, git_branch: branch }
          : s
      )
    );
    setApplyingId(null);
  }

  async function onRollback(id: string) {
    setErr("");
    if (liveApi) {
      setRollingBackId(id);
      await new Promise((r) => setTimeout(r, 400));
      setErr(
        "Live API has no rollback endpoint yet. Revert with git in your repo, then refresh or reject from 3jAIS if needed."
      );
      setRollingBackId(null);
      return;
    }
    setRollingBackId(id);
    await new Promise((r) => setTimeout(r, 800));
    setVault((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "rejected" as const, applied_commit: null, git_branch: null } : s
      )
    );
    setRollingBackId(null);
  }

  function onHarness(title: string) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 40);
    const json = JSON.stringify({ title, slug, kind: "vault_named_harness" }, null, 2);
    setHarnessMsg(`Simulated harness stdout (web cannot execute Python):\n\nexit 0\n\n--- stdout ---\n${json}\n`);
  }

  function onStubHint(title: string) {
    setHarnessMsg(
      `Stub .tsx (desktop app writes under .csil-stubs/).\n\n` +
        `Feature: ${title}\n\n` +
        `In Cursor/IDE, ask your agent to create a component stub next to your app source; ` +
        `this web demo does not write to disk.`
    );
  }

  async function runAgentDemo() {
    if (agentRunning) return;
    setAgentRunning(true);
    setTrace([]);
    const path = scanPathDisplay(scanPath || (liveApi ? "(3jAIS WORKSPACE_ROOT)" : "."));
    try {
      await runEffectiveAgentDemo({
        scanPath: path,
        onLog: (e) => setTrace((t) => [...t, e]),
      });
      if (!liveApi) {
        const batch = mockScanBatch();
        const titles = new Set(vault.map((s) => s.title));
        const extra = batch.filter((b) => !titles.has(b.title));
        if (extra.length) {
          setVault((prev) => [...extra, ...prev]);
        }
        setStatusLine(
          extra.length
            ? `SCANNER_STATUS: STANDBY — agent demo +${extra.length} vault candidate(s)`
            : "SCANNER_STATUS: STANDBY — agent demo (no new titles)"
        );
      }
    } finally {
      setAgentRunning(false);
    }
  }

  const pathLabel = scanPathDisplay(scanPath);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 lg:max-w-[1400px] lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
        <div>
          <header className="flex flex-wrap justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CONTROLLED IMPROVEMENT LOOP</h1>
              <p className="text-slate-500 text-sm mt-1">Module 1 — Suggestions Vault (React)</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</div>
              <div className="text-3xl font-bold text-violet-400 tabular-nums">{pendingN}</div>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-400 w-24 shrink-0">Scan folder</span>
            <input
              className="flex-1 min-w-[200px] rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-mono text-slate-200 placeholder:text-slate-600"
              placeholder="Absolute path to project folder…"
              value={scanPath}
              disabled={liveApi}
              onChange={(e) => setScanPath(e.target.value)}
            />
            {liveApi && (
              <span className="text-[10px] text-slate-500">Path locked — scanner uses 3jAIS WORKSPACE_ROOT</span>
            )}
          </div>
          <p className="text-[11px] font-mono text-slate-500 mb-4 pl-[6.5rem]">{gitBanner}</p>

          {err && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => void onInitiateScan()}
              className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-bold text-white"
            >
              {isScanning ? "Scanning…" : "Initiate Scan"}
            </button>
            <span className="text-[11px] font-mono text-slate-500">{statusLine}</span>
            {liveApi && (
              <button
                type="button"
                onClick={() => void refreshLive()}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Refresh vault
              </button>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 mb-8">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Temp Python (web note)</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The desktop app runs scratch Python in a temp file. In the browser, use{" "}
              <strong className="text-slate-300">Harness</strong> on a card for a <em>simulated</em> JSON result, or keep
              using <code className="text-violet-300">main.py</code> for real execution.
            </p>
          </div>

          <div className="space-y-4 pb-16">
            {vault.length === 0 && !isScanning ? (
              <p className="text-center font-mono text-slate-600 py-16">NO SYSTEMIC IMPROVEMENTS IN VAULT</p>
            ) : (
              vault.map((s) => (
                <SuggestionCard
                  key={s.id}
                  s={s}
                  scanPathDisplay={pathLabel}
                  liveApi={liveApi}
                  applyingId={applyingId}
                  rollingBackId={rollingBackId}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDeploy={onDeploy}
                  onRollback={onRollback}
                  onHarness={onHarness}
                  onStubHint={onStubHint}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-bold text-white mb-2">Effective agent usage</h2>
            <p className="text-xs text-slate-500 mb-3">
              Sample playbook for how an agent should operate around this vault (bounded tools, human gate, durable
              records).
            </p>
            <ul className="space-y-2 text-xs text-slate-400 list-disc pl-4 mb-4">
              {AGENT_PLAYBOOK.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button
              type="button"
              disabled={agentRunning}
              onClick={() => void runAgentDemo()}
              className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-sm font-bold text-white"
            >
              {agentRunning ? "Running trace…" : "Run sample agent trace"}
            </button>
            {!liveApi && (
              <p className="text-[10px] text-slate-600 mt-2">
                Demo mode: trace ends by appending mock scanner suggestions to the vault.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 max-h-[min(52vh,480px)] overflow-y-auto">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Agent trace</h3>
            {trace.length === 0 ? (
              <p className="text-xs text-slate-600">No trace yet. Run the sample above.</p>
            ) : (
              <ul className="space-y-3">
                {trace.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2 text-[11px] font-mono"
                  >
                    <div className="flex justify-between gap-2 text-slate-500 mb-1">
                      <span
                        className={
                          e.kind === "tool"
                            ? "text-cyan-400"
                            : e.kind === "human"
                              ? "text-amber-400"
                              : e.kind === "plan"
                                ? "text-violet-400"
                                : "text-slate-500"
                        }
                      >
                        {e.kind}
                      </span>
                      <span className="text-slate-600">{new Date(e.t).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-200 font-sans font-semibold text-xs mb-1">{e.title}</div>
                    <pre className="whitespace-pre-wrap text-slate-400 text-[10px] leading-relaxed">{e.detail}</pre>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3 text-[10px] text-slate-500">
            <strong className="text-slate-400">Live API:</strong> create{" "}
            <code className="text-violet-300">.env.local</code> with{" "}
            <code className="text-violet-300">VITE_LIVE_API=1</code> and run{" "}
            <code className="text-violet-300">npm run dev</code> in <code className="text-violet-300">3jais/</code>{" "}
            (port 3847). This UI proxies <code className="text-violet-300">/api</code> on port 5188.
          </div>
        </aside>
      </div>

      {harnessMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-lg w-full rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2">Harness / stub</h3>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto mb-4">
              {harnessMsg}
            </pre>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-white"
              onClick={() => setHarnessMsg(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
