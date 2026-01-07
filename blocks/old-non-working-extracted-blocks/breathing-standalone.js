/**
 * BreathingTechniques Component
 * Props: { difficulty?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Wind, Heart, Moon, Zap, Brain, Sparkles, Plus, ArrowLeft } from 'lucide-react';

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  inhale: number;
  inhaleHold: number;
  exhale: number;
  exhaleHold: number;
  rounds: number;
  category: 'calm' | 'focus' | 'sleep' | 'energy' | 'balance';
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal duration breathing for calm and focus. Used by Navy SEALs.',
    icon: createElement('Wind', {className: 'w-6 h-6'}),
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 4,
    rounds: 5,
    category: 'focus',
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    difficulty: 'beginner',
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Relaxing breath technique to reduce anxiety and promote sleep.',
    icon: createElement('Moon', {className: 'w-6 h-6'}),
    inhale: 4,
    inhaleHold: 7,
    exhale: 8,
    exhaleHold: 0,
    rounds: 4,
    category: 'sleep',
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Lowers heart rate'],
    difficulty: 'beginner',
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Breathe at 5 breaths per minute for optimal heart rate variability.',
    icon: createElement('Heart', {className: 'w-6 h-6'}),
    inhale: 6,
    inhaleHold: 0,
    exhale: 6,
    exhaleHold: 0,
    rounds: 5,
    category: 'balance',
    benefits: ['Balances autonomic nervous system', 'Improves HRV', 'Reduces stress'],
    difficulty: 'beginner',
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    description: 'Powerful breathing for energy and immune system boost.',
    icon: createElement('Zap', {className: 'w-6 h-6'}),
    inhale: 2,
    inhaleHold: 0,
    exhale: 2,
    exhaleHold: 15,
    rounds: 3,
    category: 'energy',
    benefits: ['Increases energy', 'Boosts immune system', 'Alkalizes blood pH'],
    difficulty: 'advanced',
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    description: 'Balancing breath that harmonizes left and right brain hemispheres.',
    icon: createElement('Brain', {className: 'w-6 h-6'}),
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 0,
    rounds: 5,
    category: 'balance',
    benefits: ['Balances mind', 'Reduces stress', 'Improves focus'],
    difficulty: 'intermediate',
  },
  {
    id: 'resonance',
    name: 'Resonance Breathing',
    description: 'Breathe at your natural resonance frequency for deep calm.',
    icon: createElement('Sparkles', {className: 'w-6 h-6'}),
    inhale: 5,
    inhaleHold: 0,
    exhale: 5,
    exhaleHold: 0,
    rounds: 6,
    category: 'calm',
    benefits: ['Deep relaxation', 'Optimal autonomic balance', 'Stress relief'],
    difficulty: 'beginner',
  },
  {
    id: 'extended-exhale',
    name: 'Extended Exhale',
    description: 'Longer exhales activate the parasympathetic nervous system.',
    icon: createElement('Wind', {className: 'w-6 h-6'}),
    inhale: 4,
    inhaleHold: 0,
    exhale: 8,
    exhaleHold: 0,
    rounds: 5,
    category: 'calm',
    benefits: ['Activates relaxation response', 'Reduces anxiety', 'Lowers blood pressure'],
    difficulty: 'beginner',
  },
  {
    id: 'breath-of-fire',
    name: 'Breath of Fire',
    description: 'Rapid breathing technique for energy and mental clarity.',
    icon: createElement('Zap', {className: 'w-6 h-6'}),
    inhale: 1,
    inhaleHold: 0,
    exhale: 1,
    exhaleHold: 0,
    rounds: 3,
    category: 'energy',
    benefits: ['Increases energy', 'Clears mind', 'Strengthens core'],
    difficulty: 'advanced',
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'text-green-400 bg-green-500/20';
    case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
    case 'advanced': return 'text-red-400 bg-red-500/20';
    default: return 'text-slate-400 bg-slate-500/20';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'calm': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    case 'focus': return 'from-violet-500/20 to-purple-500/20 border-violet-500/30';
    case 'sleep': return 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30';
    case 'energy': return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
    case 'balance': return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
    default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
  }
};

interface BreathingTechniquesProps {
  onBack?: () => void;
  onCreateCustom?: () => void;
}

export default function BreathingTechniques: React.FC<BreathingTechniquesProps> = ({ onBack, onCreateCustom }) => {
  const [selectedTechnique, setSelectedTechnique] = React.useState<BreathingTechnique | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'calm' | 'focus' | 'sleep' | 'energy' | 'balance'>('all');

  if (selectedTechnique) {
    return (
      <BreathingSession
        challengeName={selectedTechnique.name}
        levelNumber={1}
        onBack={() => setSelectedTechnique(null)}
        defaultSettings={{
          inhale: selectedTechnique.inhale,
          inhaleHold: selectedTechnique.inhaleHold,
          exhale: selectedTechnique.exhale,
          exhaleHold: selectedTechnique.exhaleHold,
          rounds: selectedTechnique.rounds,
        }}
      />
    );
  }

  const filteredTechniques = filter === 'all' 
    ? BREATHING_TECHNIQUES 
    : BREATHING_TECHNIQUES.filter(t => t.category === filter);

  return createElement('div', {className: 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6'}, '<div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              createElement('ArrowLeft', {className: 'w-5 h-5'})
            </Button>
          )}
          <div className="flex-1 text-center">
            createElement('h1', {className: 'text-3xl mb-2'}, 'Breathing Techniques')
            createElement('p', {className: 'text-slate-400'}, 'Master proven breathing patterns')
          </div>
          createElement('div', {className: 'w-10'}, null)

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'calm', 'focus', 'sleep', 'energy', 'balance'].map((cat) => (
            createElement('button', null, 'setFilter(cat as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}')
          ))}
        </div>

        {/* Custom Breathing Button */}
        {onCreateCustom && (
          <Card
            className="p-4 mb-6 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={onCreateCustom}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                createElement('Plus', {className: 'w-6 h-6 text-white'})
              </div>
              <div className="flex-1">
                createElement('h3', {className: 'text-lg mb-1'}, 'Create Custom Pattern')
                createElement('p', {className: 'text-sm text-slate-400'}, 'Design your own breathing rhythm')
              </div>
            </div>
          </Card>
        )}

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTechniques.map((technique) => (
            <Card
              key={technique.id}
              className={`p-6 bg-gradient-to-br ${getCategoryColor(technique.category)} cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => setSelectedTechnique(technique)}
            >
              <div className="flex items-start gap-4 mb-4">
                createElement('div', {className: 'w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-blue-400'}, '{technique.icon}')
                <div className="flex-1">
                  createElement('h3', {className: 'text-lg mb-1'}, '{technique.name}')
                  createElement('p', {className: 'text-sm text-slate-400'}, '{technique.description}')
                </div>
              </div>

              {/* Pattern */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                createElement('span', {className: 'text-slate-400'}, 'Pattern:')
                createElement('span', {className: 'text-blue-400'}, '{technique.inhale}s inhale')
                {technique.inhaleHold > 0 && (
                  createElement('span', {className: 'text-violet-400'}, '{technique.inhaleHold}s hold')
                )}
                createElement('span', {className: 'text-cyan-400'}, '{technique.exhale}s exhale')
                {technique.exhaleHold > 0 && (
                  createElement('span', {className: 'text-slate-400'}, '{technique.exhaleHold}s hold')
                )}
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-2 mb-3">
                createElement('span', null, '{technique.difficulty.toUpperCase()}')
                createElement('span', {className: 'text-xs text-slate-500'}, '{technique.rounds} rounds')
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {technique.benefits.map((benefit, index) => (
                  createElement('span', {className: 'text-xs bg-slate-800/50 px-2 py-1 rounded text-slate-300'}, '{benefit}')
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>');
};
