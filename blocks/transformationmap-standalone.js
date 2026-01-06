/**
 * TransformationMap Component
 * Props: { energyId?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
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

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
        <h2 className="text-xl mb-2">Your Transformation Journey</h2>
        <p className="text-slate-400 text-sm mb-4">
          Progress through six universal energies at your own pace. Each energy builds upon the last,
          guiding you from peace to unity consciousness.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-slate-300">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-300">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-600" />
            <span className="text-slate-300">Locked</span>
          </div>
        </div>
      </Card>

      {/* Energy Path */}
      <div className="relative">
        {/* Connection Lines */}
        {energies.map((_, index) => (
          index < energies.length - 1 && (
            <div
              key={`line-${index}`}
              className={`absolute left-1/2 h-16 w-0.5 ${
                isUnlocked(index + 1) ? 'bg-gradient-to-b from-blue-500 to-violet-500' : 'bg-slate-700'
              }`}
              style={{
                top: `${(index + 1) * 240 - 40}px`,
                transform: 'translateX(-50%)',
              }}
            />
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
                        <Check className="w-8 h-8 text-white" />
                      ) : !unlocked ? (
                        <Lock className="w-8 h-8 text-white" />
                      ) : (
                        <div className="text-white">{energy.icon}</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl">{energy.name}</h3>
                        {status === 'active' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 mb-3">{energy.description}</p>
                      
                      {unlocked && (
                        <>
                          <Progress value={prog} className="h-2 mb-2" />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>{prog}% Complete</span>
                            <span>{100 - prog}% Remaining</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {unlocked && (
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnergy(energy);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Learn More
                      </Button>
                      {status !== 'complete' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEnergySelect(energy.id);
                          }}
                          size="sm"
                          className={`flex-1 bg-gradient-to-r ${energy.color}`}
                        >
                          {status === 'active' ? 'Continue' : 'Begin'}
                        </Button>
                      )}
                    </div>
                  )}
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedEnergy.color} flex items-center justify-center`}>
                  {selectedEnergy.icon}
                </div>
                {selectedEnergy.name}
              </DialogTitle>
              <DialogDescription>
                Explore this energy's principles, practices, and complete activities to unlock your transformation
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <p className="text-slate-300">{selectedEnergy.description}</p>
              </div>

              <div>
                <h4 className="text-lg mb-3">Core Principles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedEnergy.principles.map((principle, index) => (
                    <div key={index} className="px-3 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm">
                      • {principle}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg mb-3">Practices</h4>
                <div className="space-y-2">
                  {selectedEnergy.practices.map((practice, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30">
                      <Play className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEnergy(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onEnergySelect(selectedEnergy.id);
                    setSelectedEnergy(null);
                  }}
                  className={`flex-1 bg-gradient-to-r ${selectedEnergy.color}`}
                >
                  Start Practice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
