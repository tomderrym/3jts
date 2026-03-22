import { useState } from "react";
import { deployPreviewLive } from "../api/live";
import { buildRecordMarkdown } from "../lib/markdown";
import type { Suggestion, Tier } from "../types";

function impactColor(impact: Tier): string {
  if (impact === "high") return "text-orange-400";
  if (impact === "medium") return "text-sky-400";
  return "text-slate-400";
}

function borderForStatus(s: Suggestion["status"]): string {
  if (s === "approved") return "border-emerald-800/60 bg-emerald-950/20";
  if (s === "applied") return "border-emerald-600/40 bg-emerald-950/15";
  if (s === "rejected") return "border-red-900/50 bg-red-950/10";
  return "border-slate-700 bg-slate-900/40";
}

type Props = {
  s: Suggestion;
  scanPathDisplay: string;
  liveApi: boolean;
  applyingId: string | null;
  rollingBackId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDeploy: (id: string) => void;
  onRollback: (id: string) => void;
  onHarness: (title: string) => void;
  onStubHint: (title: string) => void;
};

export default function SuggestionCard({
  s,
  scanPathDisplay,
  liveApi,
  applyingId,
  rollingBackId,
  onApprove,
  onReject,
  onDeploy,
  onRollback,
  onHarness,
  onStubHint,
}: Props) {
  const gate = s._canApprove;
  const approveBlocked = liveApi && gate && !gate.ok;
  const previewMd =
    s.status === "approved"
      ? liveApi
        ? null
        : buildRecordMarkdown(s, scanPathDisplay)
      : null;

  return (
    <article
      className={`rounded-2xl border p-5 space-y-3 shadow-sm ${borderForStatus(s.status)}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
            {s.id}
          </span>
          <h2 className="text-lg font-bold text-slate-50 leading-snug">{s.title}</h2>
        </div>
        <span
          className={`text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 ${
            s.status === "pending"
              ? "bg-violet-950 text-violet-300"
              : s.status === "approved"
                ? "bg-emerald-950 text-emerald-300"
                : s.status === "applied"
                  ? "bg-emerald-900/80 text-emerald-100"
                  : "bg-red-950 text-red-300"
          }`}
        >
          {s.status}
        </span>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{s.long}</p>

      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span>
          Category: <strong className="text-slate-200">{s.category}</strong>
        </span>
        <span className="font-mono text-slate-500">source: {s.source}</span>
        <span>Effort: {s.effort}</span>
        {s.priorityScore != null && (
          <span>
            Priority: <strong className="text-amber-400">{s.priorityScore}</strong>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-500"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-bold uppercase ${impactColor(s.impact)}`}>{s.impact} impact</div>
          <div className="mt-1 h-2 w-28 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${Math.round(Math.min(1, Math.max(0.08, s.confidence)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Confidence: {Math.round(s.confidence * 100)}%
          </div>
        </div>
      </div>

      {approveBlocked && (
        <p className="text-xs text-rose-400/90">
          Policy: {gate?.reasons?.join(" · ") || "cannot approve"}
        </p>
      )}

      {s.status === "approved" && previewMd != null && (
        <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-3 space-y-2">
          <div className="text-[11px] font-bold text-slate-500">
            Diff preview → .csil-suggestions/&lt;id&gt;.md (Git commit payload)
          </div>
          <textarea
            readOnly
            className="w-full min-h-[140px] bg-transparent text-xs font-mono text-slate-300 resize-y border-0 focus:ring-0"
            value={previewMd}
          />
        </div>
      )}

      {s.status === "approved" && liveApi && (
        <ApprovedLivePreview suggestionId={s.id} />
      )}

      {s.status === "applied" && (
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-4 space-y-3">
          <div className="text-xs font-bold text-emerald-300">Post-deployment evaluator (simulated)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              ["Latency delta", "-12.4% (-82ms)", "text-emerald-400"],
              ["Error rate", "0.02% (stable)", "text-slate-400"],
              ["Cost efficiency", "+4.1%", "text-rose-400"],
            ].map(([k, v, c]) => (
              <div key={k} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{k}</div>
                <div className={`text-sm font-bold mt-1 ${c}`}>{v}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Evaluator: ~92% confidence in performance gain (mock).</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <span className="text-[10px] font-mono text-slate-600">
          {s.applied_commit && s.git_branch
            ? `${s.applied_commit.slice(0, 7)} · ${s.git_branch}`
            : s.applied_commit
              ? `commit ${s.applied_commit.slice(0, 7)}`
              : "—"}
        </span>
        <div className="flex flex-wrap gap-2 justify-end">
          {s.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onHarness(s.title)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-800 hover:bg-sky-700 text-white"
              >
                Harness
              </button>
              {s.tags.some((t) => t.toLowerCase().includes("react")) && (
                <button
                  type="button"
                  onClick={() => onStubHint(s.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-800 hover:bg-indigo-700 text-white"
                >
                  Stub .tsx
                </button>
              )}
              <button
                type="button"
                onClick={() => onReject(s.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950 border border-red-800 text-red-200 hover:bg-red-900"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={approveBlocked}
                onClick={() => onApprove(s.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                  approveBlocked
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-slate-100 text-slate-900 hover:bg-white"
                }`}
              >
                Approve evolution
              </button>
            </>
          )}
          {s.status === "approved" && (
            <button
              type="button"
              disabled={applyingId === s.id}
              onClick={() => onDeploy(s.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white"
            >
              {applyingId === s.id ? "Committing…" : "Deploy change"}
            </button>
          )}
          {s.status === "applied" && (
            <button
              type="button"
              disabled={rollingBackId === s.id}
              onClick={() => onRollback(s.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-900 hover:bg-red-800 disabled:opacity-50 text-red-100 border border-red-800"
            >
              {rollingBackId === s.id ? "Reverting…" : "Emergency rollback"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ApprovedLivePreview({ suggestionId }: { suggestionId: string }) {
  const [body, setBody] = useState("");
  const [path, setPath] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const prev = await deployPreviewLive(suggestionId);
      setBody(prev.body);
      setPath(prev.relativePath);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-3 space-y-2">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold text-slate-500">3jAIS deploy preview</span>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load from API"}
        </button>
      </div>
      {path && (
        <div className="text-[10px] text-slate-500 font-mono">
          Path: <span className="text-slate-400">{path}</span>
        </div>
      )}
      {err && <p className="text-xs text-rose-400">{err}</p>}
      {body && (
        <textarea
          readOnly
          className="w-full min-h-[140px] bg-transparent text-xs font-mono text-slate-300 resize-y border-0"
          value={body}
        />
      )}
    </div>
  );
}
