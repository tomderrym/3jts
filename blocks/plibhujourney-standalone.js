/**
 * PLIBHUJourney Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { ArrowLeft, Heart, Infinity, Sparkles, Target, Music, Users, BookOpen, TrendingUp, Calendar, MessageCircle } from 'lucide-react';

export const PLIBHU_ENERGIES = [
  {
    id: 'peace',
    name: 'Peace',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Find stillness and inner calm',
    principles: ['Surrender', 'Acceptance', 'Stillness', 'Non-resistance'],
    practices: ['Breath awareness', 'Body scan', 'Silence practice', 'Gratitude'],
  },
  {
    id: 'love',
    name: 'Love',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    description: 'Cultivate compassion and loving-kindness',
    principles: ['Metta', 'Compassion', 'Self-love', 'Universal love'],
    practices: ['Loving-kindness meditation', 'Heart-opening breathwork', 'Forgiveness practice', 'Self-compassion'],
  },
  {
    id: 'infinity',
    name: 'Infinity',
    icon: <Infinity className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-500',
    description: 'Connect with the eternal and infinite',
    principles: ['Transcendence', 'Timelessness', 'Boundlessness', 'Oneness'],
    practices: ['Expansive meditation', 'Sky gazing', 'Void contemplation', 'Infinity visualization'],
  },
  {
    id: 'belief',
    name: 'Belief',
    icon: <Target className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    description: 'Trust in yourself and the universe',
    principles: ['Faith', 'Trust', 'Confidence', 'Manifestation'],
    practices: ['Affirmation work', 'Vision boarding', 'Trust exercises', 'Manifestation meditation'],
  },
  {
    id: 'harmony',
    name: 'Harmony',
    icon: <Music className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    description: 'Balance and align all aspects of being',
    principles: ['Balance', 'Integration', 'Alignment', 'Flow'],
    practices: ['Chakra balancing', 'Harmonic breathwork', 'Sound healing', 'Energy alignment'],
  },
  {
    id: 'unity',
    name: 'Unity',
    icon: <Users className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-500',
    description: 'Experience oneness with all existence',
    principles: ['Oneness', 'Connection', 'Interdependence', 'Universal consciousness'],
    practices: ['Unity meditation', 'Collective intention', 'Service practice', 'Interconnection awareness'],
  },
];

interface PLIBHUJourneyProps {
  onBack?: () => void;
  onXPEarned?: (amount: number, activity: string) => void;
}

export default function PLIBHUJourney: React.FC<PLIBHUJourneyProps> = ({ onBack, onXPEarned }) => {
  const [activeTab, setActiveTab] = React.useState('map');
  const [currentEnergy, setCurrentEnergy] = React.useState<string>('peace');
  const [progress, setProgress] = React.useState<{[key: string]: number}>({
    peace: 0,
    love: 0,
    infinity: 0,
    belief: 0,
    harmony: 0,
    unity: 0,
  });

  React.useEffect(() => {
    // Load progress
    const stored = localStorage.getItem('movethemind_plibhu_progress');
    if (stored) {
      const data = JSON.parse(stored);
      setProgress(data.progress || progress);
      setCurrentEnergy(data.currentEnergy || 'peace');
    }
  }, []);

  const updateProgress = (energyId: string, amount: number) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [energyId]: Math.min((prev[energyId] || 0) + amount, 100),
      };
      localStorage.setItem('movethemind_plibhu_progress', JSON.stringify({
        progress: newProgress,
        currentEnergy,
      }));
      return newProgress;
    });
  };

  const handlePracticeComplete = (energyId: string) => {
    updateProgress(energyId, 10);
    onXPEarned?.(12, 'PLIBHU Practice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-2xl">PLIBHU Journey</h1>
            <p className="text-sm text-slate-400">Transform through universal energies</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 mb-6">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="coach">Coach</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <TransformationMap
              energies={PLIBHU_ENERGIES}
              progress={progress}
              currentEnergy={currentEnergy}
              onEnergySelect={setCurrentEnergy}
              onPracticeComplete={handlePracticeComplete}
            />
          </TabsContent>

          <TabsContent value="daily">
            <DailyInspiration
              currentEnergy={currentEnergy}
              onPracticeComplete={() => handlePracticeComplete(currentEnergy)}
              onXPEarned={onXPEarned}
            />
          </TabsContent>

          <TabsContent value="coach">
            <MettaCoach
              currentEnergy={currentEnergy}
              userProgress={progress}
              onXPEarned={onXPEarned}
            />
          </TabsContent>

          <TabsContent value="journal">
            <JournalComponent
              energies={PLIBHU_ENERGIES}
              onXPEarned={onXPEarned}
            />
          </TabsContent>

          <TabsContent value="tracker">
            <HabitTracker
              energies={PLIBHU_ENERGIES}
              onXPEarned={onXPEarned}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
