/**
 * TaskTokenSidebar Component
 * Props: { runs?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

interface AggregatedUsage {
  totalTokens: number;
  runCount: number;
  avgTokens: number;
}

function aggregateTokenUsage(runs: TaskRun[]): AggregatedUsage {
  const totalTokens = runs.reduce((sum, r) => sum + (r.token_usage || 0), 0);
  const runCount = runs.length;
  const avgTokens = runCount === 0 ? 0 : Math.round(totalTokens / runCount);
  return { totalTokens, runCount, avgTokens };
}

const API_BASE = typeof window !== 'undefined'
  ? (window.location.origin.replace(/\/$/, '') + '/api')
  : '/api';

async function fetchTaskRuns(): Promise<TaskRun[]> {
  const res = await fetch(`${API_BASE}/task-runs`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load runs (${res.status})`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data as TaskRun[];
}

export default function TaskTokenSidebar: React.FC = () => {
  const [runs, setRuns] = React.useState<TaskRun[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTaskRuns();
        if (!cancelled) {
          setRuns(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Failed to load runs');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    const unsubscribe = subscribeToTaskRunStream((run) => {
      setRuns((prev) => {
        if (run.id) {
          const idx = prev.findIndex((r) => r.id === run.id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...run };
            return updated;
          }
        }
        return [...prev, run];
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const { totalTokens, runCount, avgTokens } = aggregateTokenUsage(runs);

  return createElement('div', {className: 'h-full flex flex-col bg-slate-950 text-xs md:text-sm border-l border-slate-800'}, '<div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div>
          createElement('div', {className: 'font-semibold text-slate-100 text-xs'}, 'Task Token Usage')
          createElement('div', {className: 'text-[10px] text-slate-400'}, 'Aggregated from TaskRun.token_usage')
        </div>
      </div>

      <div className="p-3 border-b border-slate-800 text-[11px] grid grid-cols-3 gap-2">
        <div>
          createElement('div', {className: 'text-slate-400'}, 'Total tokens')
          createElement('div', {className: 'font-semibold text-slate-50'}, '{totalTokens.toLocaleString()}')
        </div>
        <div>
          createElement('div', {className: 'text-slate-400'}, 'Runs')
          createElement('div', {className: 'font-semibold text-slate-50'}, '{runCount}')
        </div>
        <div>
          createElement('div', {className: 'text-slate-400'}, 'Avg / run')
          createElement('div', {className: 'font-semibold text-slate-50'}, '{avgTokens.toLocaleString()}')
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading && (
          createElement('div', {className: 'p-3 text-slate-400 text-[11px]'}, 'Loading recent runs...')
        )}
        {error && !loading && (
          createElement('div', {className: 'p-3 text-red-300 text-[11px]'}, '{error}')
        )}
        {!loading && !error && runs.length === 0 && (
          createElement('div', {className: 'p-3 text-slate-400 text-[11px]'}, 'No recent task runs.')
        )}
        {!loading && !error && runs.length > 0 && (
          <ul className="divide-y divide-slate-800">
            {runs.map((r, idx) => (
              <li key={r.id ?? `${r.task_id}-${idx}`} className="px-3 py-2 text-[11px] flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  createElement('span', {className: 'font-medium text-slate-100'}, '{r.model}')
                  createElement('span', null, '{r.success ? 'success' : 'failed'}')
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  createElement('span', null, 'Tokens')
                  createElement('span', {className: 'font-mono text-slate-100'}, '{(r.token_usage ?? 0).toLocaleString()}')
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  createElement('span', {className: 'truncate mr-2'}, 'task: {r.task_id}')
                  createElement('span', null, '{r.created_at?.slice(11, 19)}')
                </div>
                {r.error_message && (
                  createElement('div', {className: 'text-[10px] text-amber-300'}, '{r.error_message}')
                )}
              </li>
            ))}
          </ul>
        )}
      </div>');
};
