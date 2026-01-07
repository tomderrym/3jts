/**
 * TransformationMap Component
 * Props: { energyId?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Check, Lock, Play } from 'lucide-react';

interface Energy {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  principles: string[];
  practices: string[];
}

interface TransformationMapProps {
  energies: Energy[];
  progress: {[key: string]: number};
  currentEnergy: string;
  onEnergySelect: (energyId: string) => void;
  onPracticeComplete: (energyId: string) => void;
}

export default function TransformationMap: React.FC<TransformationMapProps> = ({
  energies,
  progress,
  currentEnergy,
  onEnergySelect,
  onPracticeComplete,
}) => {
  const [selectedEnergy, setSelectedEnergy] = React.useState<Energy | null>(null);

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevEnergy = energies[index - 1];
    return (progress[prevEnergy.id] || 0) >= 70; // Need 70% to unlock next
  };

  const getStatus = (energyId: string, index: number) => {
    const prog = progress[energyId] || 0;
    if (!isUnlocked(index)) return 'locked';
    if (prog >= 100) return 'complete';
    if (energyId === currentEnergy) return 'active';
    return 'available';
  };

  return createElement('div', {className: 'space-y-6'}, '<Card className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
        createElement('h2', {className: 'text-xl mb-2'}, 'Your Transformation Journey')
        createElement('p', {className: 'text-slate-400 text-sm mb-4'}, 'Progress through six universal energies at your own pace. Each energy builds upon the last,
          guiding you from peace to unity consciousness.')
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            createElement('div', {className: 'w-4 h-4 rounded-full bg-green-500'})
            createElement('span', {className: 'text-slate-300'}, 'Complete')
          </div>
          <div className="flex items-center gap-2">
            createElement('div', {className: 'w-4 h-4 rounded-full bg-blue-500 animate-pulse'})
            createElement('span', {className: 'text-slate-300'}, 'Active')
          </div>
          <div className="flex items-center gap-2">
            createElement('div', {className: 'w-4 h-4 rounded-full bg-slate-600'})
            createElement('span', {className: 'text-slate-300'}, 'Locked')
          </div>
        </div>
      </Card>

      {/* Energy Path */}
      <div className="relative">
        {/* Connection Lines */}
        {energies.map((_, index) => (
          index < energies.length - 1 && (
            createElement('div', {style: {{
                top: `${(index + 1) * 240 - 40}})
          )
        ))}

        {/* Energy Cards */}
        <div className="space-y-16">
          {energies.map((energy, index) => {
            const status = getStatus(energy.id, index);
            const prog = progress[energy.id] || 0;
            const unlocked = isUnlocked(index);

            return (
              <div key={energy.id} className="relative">
                <Card
                  className={`p-6 transition-all ${
                    status === 'complete'
                      ? `bg-gradient-to-br ${energy.color} bg-opacity-20 border-green-500/30`
                      : status === 'active'
                      ? `bg-gradient-to-br ${energy.color} bg-opacity-10 border-blue-500/50 ring-2 ring-blue-500/50`
                      : unlocked
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 cursor-pointer'
                      : 'bg-slate-900/50 border-slate-800/50 opacity-60'
                  }`}
                  onClick={() => unlocked && setSelectedEnergy(energy)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${energy.color} flex items-center justify-center ${!unlocked && 'opacity-40'}`}>
                      {status === 'complete' ? (
                        createElement('Check', {className: 'w-8 h-8 text-white'})
                      ) : !unlocked ? (
                        createElement('Lock', {className: 'w-8 h-8 text-white'})
                      ) : (
                        createElement('div', {className: 'text-white'}, '{energy.icon}')
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        createElement('h3', {className: 'text-2xl'}, '{energy.name}')
                        {status === 'active' && (
                          createElement('span', {className: 'px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400'}, 'Current')
                        )}
                      </div>
                      createElement('p', {className: 'text-slate-400 mb-3'}, '{energy.description}')
                      
                      {unlocked && (
                        <>
                          createElement('Progress', {className: 'h-2 mb-2'})
                          <div className="flex justify-between text-xs text-slate-500">
                            createElement('span', null, '{prog}% Complete')
                            createElement('span', null, '{100 - prog}% Remaining')
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {unlocked && (
                    <div className="flex gap-2">
                      createElement('Button', null, '{
                          e.stopPropagation();
                          setSelectedEnergy(energy);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Learn More')
                      {status !== 'complete' && (
                        createElement('Button', null, '{
                            e.stopPropagation();
                            onEnergySelect(energy.id);
                          }}
                          size="sm"
                          className={`flex-1 bg-gradient-to-r ${energy.color}`}
                        >
                          {status === 'active' ? 'Continue' : 'Begin'}')
                      )}')}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Detail Dialog */}
      {selectedEnergy && (
        <Dialog open={!!selectedEnergy} onOpenChange={() => setSelectedEnergy(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                createElement('div', null, '{selectedEnergy.icon}')
                {selectedEnergy.name}
              </DialogTitle>
              createElement('DialogDescription', null, 'Explore this energy's principles, practices, and complete activities to unlock your transformation')
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                createElement('p', {className: 'text-slate-300'}, '{selectedEnergy.description}')
              </div>

              <div>
                createElement('h4', {className: 'text-lg mb-3'}, 'Core Principles')
                <div className="grid grid-cols-2 gap-2">
                  {selectedEnergy.principles.map((principle, index) => (
                    createElement('div', {className: 'px-3 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm'}, '• {principle}')
                  ))}
                </div>
              </div>

              <div>
                createElement('h4', {className: 'text-lg mb-3'}, 'Practices')
                <div className="space-y-2">
                  {selectedEnergy.practices.map((practice, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30">
                      createElement('Play', {className: 'w-4 h-4 text-blue-400'})
                      createElement('span', {className: 'text-slate-300 text-sm'}, '{practice}')
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                createElement('Button', {variant: 'outline'}, 'setSelectedEnergy(null)}
                  className="flex-1"
                >
                  Close')
                createElement('Button', null, '{
                    onEnergySelect(selectedEnergy.id);
                    setSelectedEnergy(null);
                  }}
                  className={`flex-1 bg-gradient-to-r ${selectedEnergy.color}`}
                >
                  Start Practice')
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
