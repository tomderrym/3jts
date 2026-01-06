/**
 * Header Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useMemo  } from 'https://esm.sh/react@18';
import { Zap, Box, Smartphone, BugPlay, FileSearch, X, DownloadCloud, Download as DownloadIcon, FlaskConical } from 'lucide-react';

interface SmartContextRunSummary {
  id: string;
  timestamp: string;
  model: string;
  charLimit: number;
  totalChars: number;
  fileCount: number;
  source: 'manual' | 'test-harness';
}

const MOCK_MODEL = 'gpt-4o';

// Dev-only harness to exercise selectSmartContext with canned scenarios
function runDevSmartContextTests(): { label: string; result: SmartContextResult }[] {
  const scenarios: { label: string; files: Record<string, string>; activeFile: string; prompt: string; model: string }[] = [
    {
      label: 'Basic app edit (Header.tsx mentioned)',
      files: {
        'src/App.tsx': 'function App() { return <Header />; }',
        'src/Header.tsx': 'export const Header = () => <div>Header</div>;',
        'README.md': '# Demo',
        'package.json': '{"name":"demo"}',
      },
      activeFile: 'src/App.tsx',
      prompt: 'Please edit Header.tsx and explain changes',
      model: 'gpt-4o',
    },
    {
      label: 'Infra-focused prompt',
      files: {
        'src/App.tsx': 'function App() { return <div/>; }',
        'vite.config.ts': 'export default {} as const;',
        'tailwind.config.js': 'module.exports = {};',
        'capacitor.config.json': '{"appId":"demo"}',
      },
      activeFile: 'src/App.tsx',
      prompt: 'Update build config and Tailwind theme.',
      model: 'gemini-2.5-flash',
    },
    {
      label: 'Large file exclusion',
      files: {
        'src/App.tsx': 'function App() { return <div/>; }',
        'src/BigDump.ts': '// big file' + 'x'.repeat(200_000),
      },
      activeFile: 'src/App.tsx',
      prompt: 'Focus only on App shell.',
      model: 'llama3.2',
    },
  ];

  return scenarios.map((s) => ({
    label: s.label,
    result: selectSmartContext(s.files, s.activeFile, s.prompt, s.model, { debug: true }),
  }));
}

function getReasonTags(entry: SmartContextDebugEntry): string[] {
  const tags: string[] = [];
  const r = (entry.reason || '').toLowerCase();

  if (!entry.included) {
    if (r.includes('too large') || r.includes('ishuge')) tags.push('excluded-large');
    else if (r.includes('exceed')) tags.push('excluded-budget');
    else tags.push('excluded-other');
  }

  if (r.includes('vital')) tags.push('vital');
  if (r.includes('within remaining')) tags.push('within-budget');
  if (r.includes('infra')) tags.push('infra');
  if (r.includes('prompt')) tags.push('prompt-matched');

  return tags;
}

export default function App() {
  const [files] = useState<Record<string, string>>(() => ({ ...DEFAULT_FILES }));
  const [activeFile, setActiveFile] = useState<string>('App.tsx');
  const [prompt, setPrompt] = useState<string>('Edit App.tsx and explain file selection.');

  const [lastResult, setLastResult] = useState<SmartContextResult | null>(null);
  const [runHistory, setRunHistory] = useState<SmartContextRunSummary[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Quick-filter state for debug entries
  const [statusFilter, setStatusFilter] = useState<'all' | 'included' | 'excluded'>('all');
  const [reasonFilter, setReasonFilter] = useState<
    'all' | 'excluded-large' | 'excluded-budget' | 'infra' | 'prompt-matched' | 'vital'
  >('all');

  const executeSmartContext = () => {
    const result = selectSmartContext(files, activeFile, prompt, MOCK_MODEL, { debug: true });
    setLastResult(result);

    if (result.debug) {
      const id = `${Date.now()}`;
      const summary: SmartContextRunSummary = {
        id,
        timestamp: new Date().toISOString(),
        model: result.debug.model,
        charLimit: result.debug.charLimit,
        totalChars: result.debug.totalChars,
        fileCount: Object.keys(result.files).length,
        source: 'manual',
      };
      setRunHistory((prev) => [summary, ...prev].slice(0, 20));
      setSelectedRunId(id);
      setIsPanelOpen(true);
    }
  };

  const executeDevTestHarness = () => {
    const runs = runDevSmartContextTests();

    if (runs.length === 0) return;

    // For now, show the last scenario as the active one in the panel
    const last = runs[runs.length - 1];
    setLastResult(last.result);

    const newSummaries: SmartContextRunSummary[] = runs
      .map((r, idx) => {
        const d = r.result.debug;
        if (!d) return null;
        return {
          id: `${Date.now()}-${idx}`,
          timestamp: new Date().toISOString(),
          model: d.model,
          charLimit: d.charLimit,
          totalChars: d.totalChars,
          fileCount: Object.keys(r.result.files).length,
          source: 'test-harness',
        } as SmartContextRunSummary;
      })
      .filter((x): x is SmartContextRunSummary => !!x);

    if (newSummaries.length) {
      setRunHistory((prev) => [...newSummaries, ...prev].slice(0, 30));
      setSelectedRunId(newSummaries[0].id);
      setIsPanelOpen(true);
    }
  };

  const selectedDebugEntries = useMemo(() => {
    if (!lastResult?.debug) return [];
    let entries = lastResult.debug.entries;

    if (statusFilter !== 'all') {
      entries = entries.filter((e) => (statusFilter === 'included' ? e.included : !e.included));
    }

    if (reasonFilter !== 'all') {
      entries = entries.filter((e) => getReasonTags(e).includes(reasonFilter));
    }

    return entries;
  }, [lastResult, statusFilter, reasonFilter]);

  const policySummary = useMemo(() => {
    if (!runHistory.length) return null;
    const byModel: Record<string, { runs: number; avgChars: number; lastLimit: number }> = {};

    runHistory.forEach((r) => {
      if (!byModel[r.model]) {
        byModel[r.model] = { runs: 0, avgChars: 0, lastLimit: r.charLimit };
      }
      const bucket = byModel[r.model];
      bucket.runs += 1;
      bucket.avgChars += r.totalChars;
      bucket.lastLimit = r.charLimit;
    });

    Object.values(byModel).forEach((b) => {
      b.avgChars = Math.round(b.avgChars / b.runs);
    });

    return byModel;
  }, [runHistory]);

  const handleDownloadLog = () => {
    if (!lastResult?.debug) return;
    const payload = {
      model: lastResult.debug.model,
      charLimit: lastResult.debug.charLimit,
      totalChars: lastResult.debug.totalChars,
      entries: lastResult.debug.entries,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-context-debug-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center text-white p-4 sm:p-8">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/10 text-center max-w-3xl w-full relative overflow-hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-blue-500/20">
          <Zap size={32} className="text-white" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight text-white">
          App Runner <span className="text-blue-400">Stable</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
          Running in compatibility mode (Capacitor 5). This ensures maximum stability across build environments.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <Box size={18} className="text-blue-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Dependencies Normalized</p>
              <p className="text-[10px] text-slate-400">Capacitor Core/Android 5.7.0</p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <Smartphone size={18} className="text-indigo-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Native Android</p>
              <p className="text-[10px] text-slate-400">Java 17 Compatible</p>
            </div>
          </div>

          <button
            type="button"
            onClick={executeSmartContext}
            className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/40 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <BugPlay size={18} className="text-emerald-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Run Smart Context</p>
              <p className="text-[10px] text-emerald-200/80">Debug file selection logic</p>
            </div>
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left">
          <button
            type="button"
            onClick={executeDevTestHarness}
            className="p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/40 flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 col-span-1"
          >
            <FlaskConical size={18} className="text-purple-300" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Run Dev Test Harness</p>
              <p className="text-[10px] text-purple-100/80">Sample Smart Context scenarios</p>
            </div>
          </button>

          <div className="sm:col-span-2 flex flex-col gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Active File</label>
              <input
                value={activeFile}
                onChange={(e) => setActiveFile(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400/60"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prompt</label>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400/60"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <FileSearch size={12} />
            <span>
              Last run:{' '}
              {lastResult?.debug
                ? `${Object.keys(lastResult.files).length} files · ${lastResult.debug.totalChars.toLocaleString()} chars`
                : 'no runs yet'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!lastResult?.debug}
              onClick={() => setIsPanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/15 border border-white/20 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <BugPlay size={12} />
              View Smart Context Debug
            </button>

            <button
              type="button"
              disabled={!lastResult?.debug}
              onClick={handleDownloadLog}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/60 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <DownloadCloud size={12} />
              Download Log
            </button>
          </div>
        </div>
      </div>

      {isPanelOpen && lastResult?.debug && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#050509] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <BugPlay size={16} className="text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Smart Context Debug</p>
                  <p className="text-[10px] text-slate-400">
                    Model: {lastResult.debug.model} · Limit: {lastResult.debug.charLimit.toLocaleString()} chars
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex border-b border-white/10 bg-black/60 text-[10px] text-slate-300">
              <div className="flex-1 px-4 py-2 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    Total selected files: {Object.keys(lastResult.files).length}
                  </span>
                  <span>
                    Total chars: {lastResult.debug.totalChars.toLocaleString()} /{' '}
                    {lastResult.debug.charLimit.toLocaleString()}
                  </span>
                  <span>
                    Included: {lastResult.debug.entries.filter((e) => e.included).length} · Excluded:{' '}
                    {lastResult.debug.entries.filter((e) => !e.included).length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="uppercase text-[9px] text-slate-500">Status</span>
                  <div className="inline-flex rounded-md bg-white/5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`px-2 py-1 text-[10px] border-r border-white/10 focus:outline-none ${
                        statusFilter === 'all' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('included')}
                      className={`px-2 py-1 text-[10px] border-r border-white/10 focus:outline-none ${
                        statusFilter === 'included' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-300'
                      }`}
                    >
                      Included
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('excluded')}
                      className={`px-2 py-1 text-[10px] focus:outline-none ${
                        statusFilter === 'excluded' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-300'
                      }`}
                    >
                      Excluded
                    </button>
                  </div>

                  <span className="uppercase text-[9px] text-slate-500 ml-2">Reason</span>
                  <select
                    className="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    value={reasonFilter}
                    onChange={(e) => setReasonFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="excluded-large">Excluded: Large</option>
                    <option value="excluded-budget">Excluded: Budget</option>
                    <option value="infra">Infra</option>
                    <option value="prompt-matched">Prompt Matched</option>
                    <option value="vital">Vital</option>
                  </select>
                </div>
              </div>

              <div className="w-48 sm:w-56 border-l border-white/10 px-3 py-2 overflow-y-auto">
                <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">Per-model Summary</p>
                {policySummary &&
                  Object.entries(policySummary).map(([model, bucket]) => (
                    <div key={model} className="mb-1.5 text-[9px] text-slate-300">
                      <p className="font-semibold truncate">{model}</p>
                      <p>
                        Runs: {bucket.runs} · Avg chars: {bucket.avgChars.toLocaleString()}
                      </p>
                      <p>Char limit: {bucket.lastLimit.toLocaleString()}</p>
                    </div>
                  ))}
                {!policySummary && <p className="text-[9px] text-slate-500">No runs yet.</p>}
              </div>
            </div>

            <div className="flex-1 overflow-auto divide-y divide-white/5">
              <div className="px-4 py-2 text-[11px] text-slate-300 font-mono grid grid-cols-12 gap-2 sticky top-0 bg-[#050509] border-b border-white/5">
                <span className="col-span-6 truncate">Path</span>
                <span className="col-span-2 text-right">Score</span>
                <span className="col-span-2 text-right">Length</span>
                <span className="col-span-2 text-center">Status</span>
              </div>

              <div className="flex-1 overflow-y-auto text-[11px]">
                {selectedDebugEntries.map((entry) => (
                  <div
                    key={entry.path + entry.score + String(entry.included)}
                    className={`px-4 py-1.5 grid grid-cols-12 gap-2 items-center border-b border-white/5/0 last:border-b-0 ${
                      entry.included ? 'bg-emerald-500/5' : 'bg-red-500/5'
                    }`}
                  >
                    <span className="col-span-6 truncate text-slate-200" title={entry.path}>
                      {entry.path}
                    </span>
                    <span className="col-span-2 text-right text-slate-300">{entry.score}</span>
                    <span className="col-span-2 text-right text-slate-400">{entry.length.toLocaleString()}</span>
                    <span
                      className={`col-span-2 text-center font-semibold ${
                        entry.included ? 'text-emerald-300' : 'text-red-300'
                      }`}
                    >
                      {entry.included ? 'INCLUDED' : 'EXCLUDED'}
                    </span>
                    {entry.reason && (
                      <div className="col-span-12 text-[10px] text-slate-500 pl-2 italic truncate">
                        {entry.reason}
                      </div>
                    )}
                  </div>
                ))}
                {selectedDebugEntries.length === 0 && (
                  <div className="px-4 py-6 text-center text-[11px] text-slate-500">
                    No debug entries available for the current filters.
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-2 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] text-slate-500">
              <div>
                Showing latest Smart Context run. Use the dev test harness to compare model policy behavior.
              </div>
              <button
                type="button"
                onClick={handleDownloadLog}
                disabled={!lastResult?.debug}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-[10px] text-slate-200 disabled:opacity-40"
              >
                <DownloadIcon size={10} />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
