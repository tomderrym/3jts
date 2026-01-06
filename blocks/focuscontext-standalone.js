/**
 * FocusContext Component
 * Props: { panel?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  createContext, useContext, useEffect, useMemo, useState  } from 'https://esm.sh/react@18';

interface FocusState {
  panel: PanelContext;
  mode: ModeContext;
}

interface FocusContextValue extends FocusState {
  setPanel: (panel: PanelContext) => void;
  setMode: (mode: ModeContext) => void;
  // In a fuller implementation, we would expose the active profile & resolved commands.
}

export default function FocusContext = createContext<FocusContextValue | undefined>(undefined);

// Simple in-memory default profile so the chord engine can run deterministically.
const defaultProfile: KeybindingProfile = {
  id: 'default',
  name: 'Default',
  description: 'Local default profile',
  chordTimeoutMs: 600,
  bindings: [],
  isDefault: true,
};

const defaultProfiles: KeybindingProfile[] = [defaultProfile];

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useState<PanelContext>('editor');
  const [mode, setMode] = useState<ModeContext>('normal');

  const [profiles] = useState<KeybindingProfile[]>(defaultProfiles);
  const [chordState, setChordState] = useState<ChordEngineState>({
    activeProfileId: defaultProfile.id,
  });

  // Global keyboard handling: feed events into chord engine with current focus context.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const combo = eventToCombo(e);
      if (!combo) return;

      const ctx: ChordEngineContext = { panel, mode };
      const { state: nextState, result } = resolveChord(profiles, chordState, combo, ctx);
      if (nextState !== chordState) {
        setChordState(nextState);
      }

      if (result.resolved) {
        // Prevent default only when we have a resolution, to avoid interfering otherwise.
        e.preventDefault();
        // For now we just log; integration with actual command execution can be added later.
        if (typeof window !== 'undefined') {
          console.debug('[ChordEngine] Resolved command', result.resolved);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [panel, mode, profiles, chordState]);

  const value: FocusContextValue = useMemo(
    () => ({ panel, mode, setPanel, setMode }),
    [panel, mode],
  );

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export function useFocus(): FocusContextValue {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return ctx;
}

// Optional helper component to debug focus & mode visually if wired into the UI later.
export const FocusDebugger: React.FC = () => {
  const { panel, mode, setPanel, setMode } = useFocus();
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <label className="flex items-center gap-1">
        <span>Focused panel:</span>
        <select
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs h-[32px]"
          value={panel}
          onChange={(e) => setPanel(e.target.value as PanelContext)}
        >
          <option value="editor">Editor</option>
          <option value="sidebar">Sidebar</option>
          <option value="terminal">Terminal</option>
        </select>
      </label>
      <label className="flex items-center gap-1">
        <span>Mode:</span>
        <select
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs h-[32px]"
          value={mode}
          onChange={(e) => setMode(e.target.value as ModeContext)}
        >
          <option value="normal">Normal</option>
          <option value="insert">Insert</option>
          <option value="command">Command</option>
        </select>
      </label>
    </div>
  );
};
