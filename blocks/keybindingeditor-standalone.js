import React from 'https://esm.sh/react@18';

interface KeybindingEditorProps {
  /**
   * Optional initial profile (e.g., from server-side render or parent cache).
   * If not provided, the editor will load the default profile from the backend.
   */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
  initialProfile?: KeybindingProfile;
}

interface HistoryState {
  past: KeybindingProfile[];
  present: KeybindingProfile | null;
  future: KeybindingProfile[];
}

export default function KeybindingEditor: React.FC<KeybindingEditorProps> = ({ initialProfile }) => {
  const [history, setHistory] = React.useState<HistoryState>(() => ({
    past: [],
    present: initialProfile ?? null,
    future: [],
  }));
  const [filter, setFilter] = React.useState('');
  const [loading, setLoading] = React.useState(!initialProfile);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [profiles, setProfiles] = React.useState<{
    id: string;
    name: string;
    description?: string;
    isDefault?: boolean;
  }[]>([]);
  const [selectedProfileId, setSelectedProfileId] = React.useState<string | null>(null);

  const [highlightedBindingId, setHighlightedBindingId] = React.useState<string | null>(null);

  const profile = history.present;

  const bindingRowRefs = React.useRef<Record<string, HTMLTableRowElement | null>>({});

  const loadProfilesList = React.useCallback(async () => {
    try {
      const items = await KeybindingProfilesService.listProfiles();
      setProfiles(items);
      if (!selectedProfileId && items.length > 0) {
        setSelectedProfileId(items[0].id);
      }
    } catch (err: any) {
      // profile list failures should not break the editor, just surface error
      setError(err?.message || 'Failed to load keybinding profiles');
    }
  }, [selectedProfileId]);

  // Load default profile / initial profile
  React.useEffect(() => {
    if (initialProfile) {
      const conflicts = detectConflicts(initialProfile.bindings);
      const withFlags = applyConflictFlags(initialProfile.bindings, conflicts);
      const enriched: KeybindingProfile = { ...initialProfile, bindings: withFlags };
      setHistory({ past: [], present: enriched, future: [] });
      setSelectedProfileId(initialProfile.id);
      setLoading(false);
      loadProfilesList();
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const base = await KeybindingProfilesService.getDefaultProfile();
        if (cancelled) return;
        const conflicts = detectConflicts(base.bindings);
        const withFlags = applyConflictFlags(base.bindings, conflicts);
        const enriched: KeybindingProfile = { ...base, bindings: withFlags };
        setHistory({ past: [], present: enriched, future: [] });
        setSelectedProfileId(enriched.id);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || 'Failed to load keybinding profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    loadProfilesList();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecomputeConflicts = React.useCallback(
    (next: KeybindingProfile) => {
      const conflicts = detectConflicts(next.bindings);
      const withFlags = applyConflictFlags(next.bindings, conflicts);
      return { ...next, bindings: withFlags };
    },
    [],
  );

  const pushToHistory = (updater: (prev: KeybindingProfile) => KeybindingProfile) => {
    setHistory((prev) => {
      if (!prev.present) return prev;
      const recomputed = handleRecomputeConflicts(updater(prev.present));
      return {
        past: [...prev.past, prev.present],
        present: recomputed,
        future: [],
      };
    });
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = () => {
    setHistory((prev) => {
      if (!prev.present || prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const past = prev.past.slice(0, -1);
      const recomputed = handleRecomputeConflicts(previous);
      return {
        past,
        present: recomputed,
        future: [prev.present, ...prev.future],
      };
    });
  };

  const redo = () => {
    setHistory((prev) => {
      if (!prev.present || prev.future.length === 0) return prev;
      const next = prev.future[0];
      const future = prev.future.slice(1);
      const recomputed = handleRecomputeConflicts(next);
      return {
        past: [...prev.past, prev.present],
        present: recomputed,
        future,
      };
    });
  };

  const loadProfileById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const base = await KeybindingProfilesService.getProfile(id);
      const conflicts = detectConflicts(base.bindings);
      const withFlags = applyConflictFlags(base.bindings, conflicts);
      const enriched: KeybindingProfile = { ...base, bindings: withFlags };
      setHistory({ past: [], present: enriched, future: [] });
      setSelectedProfileId(enriched.id);
      setHighlightedBindingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load keybinding profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const nextId = e.target.value;
    if (!nextId) return;
    void loadProfileById(nextId);
  };

  const handleCreateProfile = async () => {
    const name = window.prompt('New profile name');
    if (!name) return;
    try {
      const created = await KeybindingProfilesService.createProfile({ name });
      const conflicts = detectConflicts(created.bindings);
      const withFlags = applyConflictFlags(created.bindings, conflicts);
      const enriched: KeybindingProfile = { ...created, bindings: withFlags };
      setHistory({ past: [], present: enriched, future: [] });
      setSelectedProfileId(enriched.id);
      await loadProfilesList();
    } catch (err: any) {
      setError(err?.message || 'Failed to create keybinding profile');
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile) return;
    if (profile.isDefault) {
      window.alert('The default profile cannot be deleted.');
      return;
    }
    const confirmed = window.confirm(`Delete profile "${profile.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await KeybindingProfilesService.deleteProfile(profile.id);
      // Reload list and switch to default or first available
      const list = await KeybindingProfilesService.listProfiles();
      setProfiles(list);
      if (list.length === 0) {
        setHistory({ past: [], present: null, future: [] });
        setSelectedProfileId(null);
      } else {
        const next = list.find((p) => p.isDefault) ?? list[0];
        await loadProfileById(next.id);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete keybinding profile');
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);

    const previous = profile;

    try {
      const saved = await KeybindingProfilesService.saveProfile({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        chordTimeoutMs: profile.chordTimeoutMs,
        bindings: profile.bindings,
        // forward any default context configuration to backend
        defaultPanel: profile.defaultPanel,
        defaultModes: profile.defaultModes,
      } as any);
      const withConflicts = handleRecomputeConflicts(saved as KeybindingProfile);
      setHistory((prev) => ({ ...prev, present: withConflicts }));
      await loadProfilesList();
    } catch (err: any) {
      setHistory((prev) => ({ ...prev, present: previous }));
      setError(err?.message || 'Failed to save keybinding profile');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeoutChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value) || value <= 0) return;
    pushToHistory((prev) => ({ ...prev, chordTimeoutMs: value }));
  };

  const handleDefaultPanelChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value as PanelContext | '';
    pushToHistory((prev) => ({
      ...prev,
      defaultPanel: value || undefined,
    }));
  };

  const handleDefaultModesChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value as ModeContext);
    pushToHistory((prev) => ({
      ...prev,
      defaultModes: selected.length ? selected : undefined,
    }));
  };

  const handleProfileNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    pushToHistory((prev) => ({ ...prev, name: value }));
  };

  const handleProfileDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    pushToHistory((prev) => ({ ...prev, description: value }));
  };

  const focusBindingRow = (id: string) => {
    const row = bindingRowRefs.current[id];
    if (row) {
      row.scrollIntoView({ block: 'center' });
      row.focus();
      setHighlightedBindingId(id);
      window.setTimeout(() => {
        setHighlightedBindingId((current) => (current === id ? null : current));
      }, 1500);
    }
  };

  if (loading && !profile) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-400">
        Loading keybinding profile...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-xs text-red-300 px-4 text-center">
        <p className="mb-2">{error}</p>
        <button
          type="button"
          onClick={() => {
            setHistory({ past: [], present: null, future: [] });
            setLoading(true);
            setError(null);
          }}
          className="px-3 py-1 rounded bg-slate-800 text-slate-100 border border-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-400">
        No profile loaded.
      </div>
    );
  }

  const filteredBindings: CommandBinding[] = profile.bindings.filter((b) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      b.command.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      (b.conflictReason ?? '').toLowerCase().includes(q)
    );
  });

  const conflictBadgeClass = (severity: ConflictSeverity | undefined): string => {
    if (!severity || severity === 'none') return 'text-emerald-400';
    return severity === 'error' ? 'text-red-300' : 'text-amber-300';
  };

  const renderConflictLabel = (b: CommandBinding) => {
    if (!b.isConflicting) {
      return <span className="text-emerald-400">none</span>;
    }
    const label = b.conflictReason || 'conflict';
    const icon = b.conflictSeverity === 'error' ? '!' : '⚠';
    return (
      <span className={conflictBadgeClass(b.conflictSeverity)}>
        <span className="mr-1" aria-hidden="true">{icon}</span>
        {label}
      </span>
    );
  };

  const totalConflicts = profile.bindings.filter((b) => b.isConflicting).length;
  const errorConflicts = profile.bindings.filter((b) => b.isConflicting && b.conflictSeverity === 'error').length;
  const warningConflicts = profile.bindings.filter((b) => b.isConflicting && b.conflictSeverity === 'warning').length;

  return (
    <div
      className="h-full flex flex-col bg-slate-950 text-slate-50 text-xs"
      aria-label="Keybinding editor"
      role="region"
    >
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-[10px] text-slate-300 min-w-0">
              <span className="text-[11px] font-semibold text-slate-100">Profile</span>
              <select
                value={selectedProfileId ?? profile.id}
                onChange={handleProfileSelectChange}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[24px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[160px] truncate"
                aria-label="Select keybinding profile"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.isDefault ? ' (default)' : ''}
                  </option>
                ))}
                {!profiles.find((p) => p.id === profile.id) && (
                  <option value={profile.id}>{profile.name}</option>
                )}
              </select>
              {saving && <span className="ml-1 text-[10px] text-slate-400">Saving...</span>}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCreateProfile}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
              >
                New
              </button>
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={profile.isDefault}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-slate-500">Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={handleProfileNameChange}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[22px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[160px]"
                aria-label="Profile name"
              />
            </div>
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="text-slate-500">Description</span>
              <input
                type="text"
                value={profile.description ?? ''}
                onChange={handleProfileDescriptionChange}
                placeholder="Optional description"
                className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[22px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[80px]"
                aria-label="Profile description"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-slate-500">Conflicts:</span>
              <span className="text-emerald-400">Total {totalConflicts}</span>
              <span className="text-red-300">Errors {errorConflicts}</span>
              <span className="text-amber-300">Warnings {warningConflicts}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-[10px] text-slate-300">
            <span>Chord timeout (ms)</span>
            <input
              type="number"
              min={100}
              step={50}
              value={profile.chordTimeoutMs}
              onChange={handleTimeoutChange}
              className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[26px] w-20 text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Chord timeout in milliseconds"
            />
          </label>
          <div className="flex flex-col gap-1 text-[10px] text-slate-300">
            <div className="flex items-center gap-1">
              <span>Default panel</span>
              <select
                value={profile.defaultPanel ?? ''}
                onChange={handleDefaultPanelChange}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[24px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Default panel context for this profile"
              >
                <option value="">(all)</option>
                <option value="editor">Editor</option>
                <option value="sidebar">Sidebar</option>
                <option value="terminal">Terminal</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span>Default modes</span>
              <select
                multiple
                value={profile.defaultModes ?? []}
                onChange={handleDefaultModesChange}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 h-[40px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Default modes for this profile"
              >
                <option value="normal">Normal</option>
                <option value="insert">Insert</option>
                <option value="command">Command</option>
              </select>
            </div>
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search bindings or conflicts..."
            className="bg-slate-900 border border-slate-700 rounded px-2 h-[28px] text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search keybindings"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="px-2 py-1 rounded bg-slate-800 text-[10px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="px-2 py-1 rounded bg-slate-800 text-[10px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
            >
              Redo
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-2.5 py-1.5 rounded bg-indigo-600 text-[10px] font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="px-3 py-1 text-[10px] text-amber-300 border-b border-slate-800 bg-slate-900"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {filteredBindings.length === 0 ? (
          <div className="px-3 py-3 text-[10px] text-slate-400">
            No bindings match the current filter.
          </div>
        ) : (
          <table className="min-w-full text-[11px]" aria-label="Keybinding list">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Command</th>
                <th className="text-left px-3 py-2 font-medium">Chord</th>
                <th className="text-left px-3 py-2 font-medium">Context</th>
                <th className="text-left px-3 py-2 font-medium">Conflicts</th>
                <th className="text-left px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBindings.map((b) => (
                <tr
                  key={b.id}
                  ref={(el) => {
                    bindingRowRefs.current[b.id] = el;
                  }}
                  tabIndex={0}
                  className={[
                    'border-b border-slate-900 hover:bg-slate-900/60 outline-none focus:bg-slate-900/80',
                    highlightedBindingId === b.id ? 'ring-1 ring-amber-400 bg-slate-900' : '',
                  ].join(' ')}
                >
                  <td className="px-3 py-1.5">{b.command}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">
                    {b.chord.sequence
                      .map((s) => `${s.modifiers.join('+')}${s.modifiers.length ? '+' : ''}${s.key}`)
                      .join(' then ')}
                  </td>
                  <td className="px-3 py-1.5 text-[10px] text-slate-400">
                    panels: {b.context.panel.join(', ') || 'all'}; modes: {b.context.modes.join(', ') || 'all'}
                  </td>
                  <td className="px-3 py-1.5 text-[10px]">{renderConflictLabel(b)}</td>
                  <td className="px-3 py-1.5 text-[10px]">
                    {b.isConflicting && (
                      <button
                        type="button"
                        onClick={() => focusBindingRow(b.id)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950"
                        aria-label={`Jump to conflicting binding ${b.command}`}
                      >
                        Jump
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
