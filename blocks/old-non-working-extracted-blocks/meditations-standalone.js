import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
/**
 * MEDITATIONS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import { useState } from 'react';
import { ArrowLeft, Play, Clock, Moon, Focus, Heart, Sparkles } from 'lucide-react';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'calm' | 'focus' | 'sleep' | 'manifest';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  narrator?: string;
}

export default function MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Morning Peace',
    description: 'Start your day with gentle awareness and peaceful intentions',
    duration: '10 min',
    type: 'calm',
    difficulty: 'Beginner',
    narrator: 'Sarah',
  },
  {
    id: '2',
    title: 'Body Scan Relaxation',
    description: 'Release tension and discover deep relaxation throughout your body',
    duration: '15 min',
    type: 'calm',
    difficulty: 'Beginner',
    narrator: 'Michael',
  },
  {
    id: '3',
    title: 'Laser Focus',
    description: 'Sharpen your concentration and mental clarity for peak performance',
    duration: '12 min',
    type: 'focus',
    difficulty: 'Intermediate',
    narrator: 'Sarah',
  },
  {
    id: '4',
    title: 'Deep Work Session',
    description: 'Enter a flow state for intense creative or analytical work',
    duration: '25 min',
    type: 'focus',
    difficulty: 'Advanced',
    narrator: 'Michael',
  },
  {
    id: '5',
    title: 'Sleep Sanctuary',
    description: 'Gentle guidance to help you drift into peaceful, restorative sleep',
    duration: '20 min',
    type: 'sleep',
    difficulty: 'Beginner',
    narrator: 'Sarah',
  },
  {
    id: '6',
    title: 'Night Ocean Journey',
    description: 'Float on calm waves of consciousness into deep sleep',
    duration: '30 min',
    type: 'sleep',
    difficulty: 'Beginner',
    narrator: 'Michael',
  },
  {
    id: '7',
    title: 'Manifestation Magic',
    description: 'Visualize and embody your desired reality with powerful intention',
    duration: '15 min',
    type: 'manifest',
    difficulty: 'Intermediate',
    narrator: 'Sarah',
  },
  {
    id: '8',
    title: 'Abundance Flow',
    description: 'Open yourself to receiving prosperity, love, and success',
    duration: '18 min',
    type: 'manifest',
    difficulty: 'Intermediate',
    narrator: 'Michael',
  },
];

interface MeditationLibraryProps {
  onBack: () => void;
  onSelectMeditation: (meditationId: string) => void;
}

export function MeditationLibrary({ onBack, onSelectMeditation }: MeditationLibraryProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'calm':
        return createElement('Heart', {className: 'w-5 h-5 text-blue-400'});
      case 'focus':
        return createElement('Focus', {className: 'w-5 h-5 text-amber-400'});
      case 'sleep':
        return createElement('Moon', {className: 'w-5 h-5 text-purple-400'});
      case 'manifest':
        return createElement('Sparkles', {className: 'w-5 h-5 text-primary'});
      default:
        return createElement('Heart', {className: 'w-5 h-5 text-primary'});
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'calm':
        return 'from-blue-500/20 to-blue-600/5 border-blue-500/20';
      case 'focus':
        return 'from-amber-500/20 to-amber-600/5 border-amber-500/20';
      case 'sleep':
        return 'from-purple-500/20 to-purple-600/5 border-purple-500/20';
      case 'manifest':
        return 'from-primary/20 to-primary/5 border-primary/20';
      default:
        return 'from-primary/20 to-primary/5 border-primary/20';
    }
  };

  const filteredMeditations = activeTab === 'all'
    ? MEDITATIONS
    : MEDITATIONS.filter((m) => m.type === activeTab);

  return createElement('div', {className: 'min-h-screen p-6 pb-24'}, '<div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            createElement('ArrowLeft', {className: 'w-5 h-5 text-foreground'})
          </button>
          <div className="flex-1">
            createElement('h1', {className: 'text-foreground'}, 'Meditation Library')
            createElement('p', {className: 'text-sm text-muted-foreground'}, 'Guided sessions for every need')
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5">
            createElement('TabsTrigger', {value: 'all'}, 'All')
            createElement('TabsTrigger', {value: 'calm'}, 'Calm')
            createElement('TabsTrigger', {value: 'focus'}, 'Focus')
            createElement('TabsTrigger', {value: 'sleep'}, 'Sleep')
            createElement('TabsTrigger', {value: 'manifest'}, 'Manifest')
          </TabsList>
        </Tabs>

        {/* Meditations Grid */}
        <div className="space-y-4">
          {filteredMeditations.map((meditation) => (
            <Card
              key={meditation.id}
              className={`p-5 bg-gradient-to-br ${getTypeColor(meditation.type)} cursor-pointer hover:border-primary/40 transition-all group`}
              onClick={() => onSelectMeditation(meditation.id)}
            >
              <div className="flex items-start gap-4">
                createElement('div', {className: 'p-3 rounded-full bg-card/50 group-hover:scale-110 transition-transform'}, '{getTypeIcon(meditation.type)}')
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      createElement('h3', {className: 'text-foreground mb-1'}, '{meditation.title}')
                      createElement('p', {className: 'text-sm text-muted-foreground mb-3'}, '{meditation.description}')
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      createElement('Clock', {className: 'w-4 h-4'})
                      createElement('span', {className: 'text-xs'}, '{meditation.duration}')
                    </div>
                    createElement('Badge', {className: 'text-xs border-primary/30 text-primary', variant: 'outline'}, '{meditation.difficulty}')
                    {meditation.narrator && (
                      createElement('span', {className: 'text-xs text-muted-foreground'}, 'with {meditation.narrator}')
                    )}
                  </div>

                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 hover:bg-card transition-colors text-sm text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMeditation(meditation.id);
                    }}
                  >
                    createElement('Play', {className: 'w-4 h-4'})
                    Start Session
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>');
}
