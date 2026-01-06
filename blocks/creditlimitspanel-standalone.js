/**
 * CreditLimitsPanel Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';

export default function CreditLimitsPanel: React.FC = () => {
  const [profiles, setProfiles] = React.useState<CreditProfileDto[]>([]);
  const [profilesLoading, setProfilesLoading] = React.useState(true);
  const [profilesError, setProfilesError] = React.useState<string | null>(null);

  const [activeProfileId, setActiveProfileId] = React.useState<string | null>(null);

  const [usagePage, setUsagePage] = React.useState(1);
  const [usagePageSize] = React.useState(10);
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [search, setSearch] = React.useState('');

  const [usage, setUsage] = React.useState<PaginatedUsage | null>(null);
  const [usageLoading, setUsageLoading] = React.useState(false);
  const [usageError, setUsageError] = React.useState<string | null>(null);

  const [editingLimit, setEditingLimit] = React.useState<string>('');
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function loadProfiles() {
      try {
        setProfilesLoading(true);
        setProfilesError(null);
        const data = await CreditsService.listProfiles();
        if (cancelled) return;
        setProfiles(data);
        if (!activeProfileId && data.length > 0) {
          setActiveProfileId(data[0].id);
          setEditingLimit(String(data[0].monthlyLimit));
        }
      } catch (e: any) {
        if (cancelled) return;
        setProfilesError(e?.message ?? 'Failed to load profiles');
      } finally {
        if (!cancelled) setProfilesLoading(false);
      }
    }
    loadProfiles();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!activeProfileId) return;
    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      setEditingLimit(String(profile.monthlyLimit));
    }
  }, [activeProfileId, profiles]);

  React.useEffect(() => {
    if (!activeProfileId) return;
    let cancelled = false;

    async function loadUsage() {
      try {
        setUsageLoading(true);
        setUsageError(null);
        const data = await CreditsService.getUsage(activeProfileId, {
          page: usagePage,
          pageSize: usagePageSize,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          q: search || undefined,
        });
        if (cancelled) return;
        setUsage(data);
      } catch (e: any) {
        if (cancelled) return;
        setUsageError(e?.message ?? 'Failed to load usage');
      } finally {
        if (!cancelled) setUsageLoading(false);
      }
    }

    loadUsage();
    return () => {
      cancelled = true;
    };
  }, [activeProfileId, usagePage, usagePageSize, fromDate, toDate, search]);

  const activeProfile =
    (activeProfileId && profiles.find((p) => p.id === activeProfileId)) || profiles[0];

  const profileUsage = React.useMemo(() => {
    const items: UsageEntryDto[] = usage?.items ?? [];
    const totalTokens = items.reduce((sum, e) => sum + e.tokens, 0);
    return { total: totalTokens, entries: items };
  }, [usage]);

  async function handleSaveLimit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeProfile) return;
    setSaveError(null);
    setSavedMessage(null);
    const value = editingLimit.trim();
    if (!value) {
      setSaveError('Limit is required.');
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setSaveError('Limit must be a positive number of tokens.');
      return;
    }
    setSaving(true);
    try {
      const updated = await CreditsService.updateProfileLimit(activeProfile.id, Math.round(parsed));
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSavedMessage('Credit limit saved.');
    } catch (e: any) {
      setSaveError(e?.message ?? 'Failed to save credit limit');
    } finally {
      setSaving(false);
    }
  }

  const totalPages = usage ? Math.max(1, Math.ceil(usage.total / usage.pageSize)) : 1;

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUsagePage(1);
  }

  return (
    <div className="h-full flex flex-col text-xs md:text-[11px] bg-slate-950 text-slate-100">
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div>
          <div className="font-semibold text-[11px]">Credit Limits</div>
          <div className="text-[10px] text-slate-400">Per-profile token budgets &amp; history</div>
        </div>
        <select
          value={activeProfile?.id ?? ''}
          onChange={(e) => {
            setActiveProfileId(e.target.value || null);
            setUsagePage(1);
          }}
          disabled={profilesLoading || !!profilesError || profiles.length === 0}
          className="bg-slate-900 border border-slate-700 rounded px-2 h-[32px] text-[11px]"
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {profilesLoading && (
        <div className="px-3 py-2 text-[10px] text-slate-400 border-b border-slate-800">Loading profiles...</div>
      )}
      {profilesError && (
        <div className="px-3 py-2 text-[10px] text-red-300 border-b border-slate-800">{profilesError}</div>
      )}

      {activeProfile && (
        <form onSubmit={handleSaveLimit} className="px-3 py-3 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="flex-1 text-[11px] text-slate-300">
              Monthly token limit
              <input
                type="number"
                min={1000}
                step={1000}
                value={editingLimit}
                onChange={(e) => setEditingLimit(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 h-[32px] text-[11px] text-slate-100"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-3 h-[32px] rounded border border-emerald-500 bg-emerald-600 text-[11px] font-medium text-white hover:bg-emerald-500 disabled:bg-emerald-900 disabled:border-emerald-800 disabled:text-slate-300"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
          {saveError && <div className="text-[10px] text-red-300">{saveError}</div>}
          {savedMessage && <div className="text-[10px] text-emerald-300">{savedMessage}</div>}
        </form>
      )}

      <form onSubmit={handleFilterSubmit} className="px-3 py-2 border-b border-slate-800 flex flex-col gap-2 bg-slate-950/80">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-[10px] text-slate-400">From</div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 h-[28px] text-[10px]"
            />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">To</div>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 h-[28px] text-[10px]"
            />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Search</div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Description..."
              className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 h-[28px] text-[10px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setFromDate('');
              setToDate('');
              setSearch('');
              setUsagePage(1);
            }}
            className="px-2 h-[26px] rounded border border-slate-700 text-[10px] text-slate-200 bg-slate-900 hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-2 h-[26px] rounded border border-sky-600 bg-sky-600 text-[10px] text-white hover:bg-sky-500"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="px-3 py-2 border-b border-slate-800 text-[11px] grid grid-cols-2 gap-2 bg-slate-950/80">
        <div>
          <div className="text-slate-400 text-[10px]">Limit</div>
          <div className="font-semibold text-slate-50">{activeProfile ? activeProfile.monthlyLimit.toLocaleString() : '—'} tokens</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">Used</div>
          <div className="font-semibold text-slate-50">{profileUsage.total.toLocaleString()} tokens</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {usageLoading && (
          <div className="px-3 py-3 text-[10px] text-slate-400">Loading usage…</div>
        )}
        {usageError && !usageLoading && (
          <div className="px-3 py-3 text-[10px] text-red-300">{usageError}</div>
        )}
        {!usageLoading && !usageError && profileUsage.entries.length === 0 && (
          <div className="px-3 py-3 text-[10px] text-slate-400">No usage history for this profile.</div>
        )}
        {!usageLoading && !usageError && profileUsage.entries.length > 0 && (
          <ul className="divide-y divide-slate-800">
            {profileUsage.entries.map((e) => {
              const remaining = Math.max(0, (activeProfile?.monthlyLimit ?? 0) - profileUsage.total);
              return (
                <li key={e.id} className="px-3 py-2 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-50">{e.tokens.toLocaleString()} tokens</span>
                    <span className="text-[10px] text-slate-400">{e.date.slice(0, 10)}</span>
                  </div>
                  {e.description && (
                    <div className="text-[10px] text-slate-300 truncate">{e.description}</div>
                  )}
                  <div className="text-[10px] text-slate-500">
                    Est. remaining this profile: {remaining.toLocaleString()} tokens
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-3 py-2 border-t border-slate-800 flex items-center justify-between text-[10px] bg-slate-950/90">
        <div>
          Page {usage?.page ?? usagePage} of {totalPages}
          {usage && (
            <span className="text-slate-500 ml-1">· {usage.total} entries</span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setUsagePage((p) => Math.max(1, p - 1))}
            disabled={usagePage <= 1}
            className="px-2 h-[24px] rounded border border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setUsagePage((p) => (p >= totalPages ? p : p + 1))}
            disabled={usagePage >= totalPages}
            className="px-2 h-[24px] rounded border border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
