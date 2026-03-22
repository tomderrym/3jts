import { useEffect, useState } from "react";

type ToolDef = {
  name: string;
  description: string;
  inputSchema: Record<string, string>;
  risk: string;
};

export default function ToolsPanel() {
  const [tools, setTools] = useState<ToolDef[]>([]);
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then(setTools)
      .catch((e) => setOut(String(e)));
  }, []);

  async function invoke(name: string, args: Record<string, unknown>) {
    setBusy(true);
    setOut("");
    try {
      const r = await fetch("/api/tools/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, args }),
      });
      const j = await r.json();
      setOut(JSON.stringify(j, null, 2));
    } catch (e) {
      setOut(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        MCP-style tool registry (server-enforced paths). Invocations run on <code className="text-cyan-400">WORKSPACE_ROOT</code>.
      </p>
      <ul className="space-y-3">
        {tools.map((t) => (
          <li key={t.name} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
            <div className="font-mono text-emerald-400 text-sm">{t.name}</div>
            <div className="text-xs text-slate-500 mt-1">{t.description}</div>
            <div className="text-[10px] text-slate-600 mt-2">risk: {t.risk}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {t.name === "scan_workspace" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => invoke("scan_workspace", { maxDepth: 1 })}
                  className="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600"
                >
                  Run shallow scan
                </button>
              )}
              {t.name === "git_status" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => invoke("git_status", {})}
                  className="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600"
                >
                  git status
                </button>
              )}
              {t.name === "read_file" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => invoke("read_file", { path: "package.json", maxBytes: 8000 })}
                  className="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600"
                >
                  read package.json
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {out && (
        <pre className="text-xs bg-black/50 border border-slate-800 rounded-lg p-4 overflow-auto max-h-80 text-slate-300">
          {out}
        </pre>
      )}
    </div>
  );
}
