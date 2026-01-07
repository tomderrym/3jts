/**
 * TECHNIQUES Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Wind, Play } from 'lucide-react';

const TECHNIQUES: BreathingPattern[] = [
  {
    name: 'Coherence', 
    durationMin: 5,
    color: 'bg-emerald-500',
    phases: { inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 }
  },
  {
    name: 'Box Breathing', 
    durationMin: 4,
    color: 'bg-indigo-500',
    phases: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }
  },
  {
    name: '4-7-8 Relax', 
    durationMin: 3,
    color: 'bg-blue-500',
    phases: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 }
  },
  {
    name: 'Deep Focus', 
    durationMin: 2,
    color: 'bg-purple-500',
    phases: { inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 }
  },
];

export default function TabBreathe() {
  const [activeTechnique, setActiveTechnique] = useState<BreathingPattern | null>(null);

  if (activeTechnique) {
    return (
      <BreathingSession 
        pattern={activeTechnique} 
        onExit={() => setActiveTechnique(null)} 
      />
    );
  }

  return createElement('div', {className: 'p-6 pt-10 space-y-6 animate-fadeIn'}, '<header>
        createElement('h1', {className: 'text-3xl font-bold text-white mb-2'}, 'Breathe')
        createElement('p', {className: 'text-slate-400'}, 'Select a technique to center your mind.')
      </header>

      <div className="space-y-3">
        {TECHNIQUES.map((t, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTechnique(t)}
            className="w-full group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center justify-between active:scale-[0.98] active:bg-white/10 transition-all text-left"
          >
            createElement('div', null)
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${t.color}/20 flex items-center justify-center ${t.color.replace('bg-', 'text-')}`}>
                createElement('Wind', null)
              </div>
              <div>
                createElement('h3', {className: 'font-bold text-white text-lg'}, '{t.name}')
                createElement('p', {className: 'text-sm text-slate-400'}, '{t.durationMin} min • {getPhaseLabel(t)}')
              </div>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
              createElement('Play', {className: 'text-white ml-1', fill: 'currentColor'})
            </div>
          </button>
        ))}
      </div>');
}

function getPhaseLabel(t: BreathingPattern) {
  const { inhale, holdIn, exhale, holdOut } = t.phases;
  if (holdIn > 0 && holdOut > 0) return `${inhale}-${holdIn}-${exhale}-${holdOut}`;
  if (holdIn > 0) return `${inhale}-${holdIn}-${exhale}`;
  return `${inhale}-${exhale}`;
}