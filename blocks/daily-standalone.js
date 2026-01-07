/**
 * EXERCISES Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Sparkles, Play, Check } from 'lucide-react';

const DAILY_QUOTES = {
  peace: [
    "Peace is not the absence of chaos, but the presence of stillness within it.",
    "In the depths of silence, you will find the answers you seek.",
    "The path to peace begins with accepting what is.",
    "Surrender is not giving up; it is letting go of resistance.",
  ],
  love: [
    "Love yourself first, and everything else falls into line.",
    "Compassion is not a relationship between the healer and the wounded. It's a relationship between equals.",
    "Metta: May I be happy, may I be well, may I be safe, may I live with ease.",
    "The heart that gives thanks is a happy one, for we cannot feel grateful and unhappy at the same time.",
  ],
  infinity: [
    "You are not a drop in the ocean. You are the entire ocean in a drop.",
    "The boundaries you perceive are illusions. You are infinite.",
    "Time is a human construct. Your true nature is timeless.",
    "Expand your awareness beyond the limited self.",
  ],
  belief: [
    "Believe in yourself. Trust the universe. Everything is unfolding perfectly.",
    "Your thoughts create your reality. Choose them wisely.",
    "Faith is taking the first step even when you don't see the whole staircase.",
    "You are capable of more than you know. Trust your journey.",
  ],
  harmony: [
    "When you find balance within, you find balance in all things.",
    "The universe flows through you. Align with its rhythm.",
    "Integration is the key to wholeness.",
    "Balance is not something you find, it's something you create.",
  ],
  unity: [
    "We are all connected. What affects one, affects all.",
    "Separation is an illusion. We are one consciousness experiencing itself.",
    "In unity, there is strength. In connection, there is peace.",
    "The path to enlightenment is realizing we were never separate.",
  ],
};

export default function EXERCISES = {
  peace: [
    { title: "5-Minute Stillness", description: "Sit in silence and observe your breath" },
    { title: "Surrender Practice", description: "Release control and trust the process" },
    { title: "Gratitude Pause", description: "List three things you're grateful for" },
  ],
  love: [
    { title: "Metta Meditation", description: "Send loving-kindness to yourself and others" },
    { title: "Self-Compassion", description: "Speak to yourself as you would a dear friend" },
    { title: "Heart Opening", description: "Breathe into your heart center" },
  ],
  infinity: [
    { title: "Expansive Breathing", description: "Feel your awareness expand with each breath" },
    { title: "Sky Gazing", description: "Contemplate the vastness above" },
    { title: "Void Meditation", description: "Rest in the space between thoughts" },
  ],
  belief: [
    { title: "Affirmation Practice", description: "Repeat empowering beliefs" },
    { title: "Vision Meditation", description: "Visualize your desired reality" },
    { title: "Trust Exercise", description: "Identify areas where you can let go and trust" },
  ],
  harmony: [
    { title: "Chakra Balance", description: "Align your energy centers" },
    { title: "Sound Healing", description: "Use sound to restore balance" },
    { title: "Integration Practice", description: "Bring all aspects of yourself into harmony" },
  ],
  unity: [
    { title: "Unity Meditation", description: "Feel your connection to all beings" },
    { title: "Collective Intention", description: "Set an intention for the greater good" },
    { title: "Interconnection Awareness", description: "Notice how everything is connected" },
  ],
};

interface DailyInspirationProps {
  currentEnergy?: string;
  onPracticeComplete?: () => void;
  onXPEarned?: (amount: number, activity: string) => void;
  compact?: boolean;
}

export const DailyInspiration: React.FC<DailyInspirationProps> = ({
  currentEnergy = 'peace',
  onPracticeComplete,
  onXPEarned,
  compact = false,
}) => {
  const [completedToday, setCompletedToday] = React.useState<{[key: string]: boolean}>({});

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`movethemind_daily_${today}`);
    if (stored) {
      setCompletedToday(JSON.parse(stored));
    }
  }, []);

  const markComplete = (exerciseTitle: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...completedToday, [exerciseTitle]: true };
    setCompletedToday(updated);
    localStorage.setItem(`movethemind_daily_${today}`, JSON.stringify(updated));
    onPracticeComplete();
  };

  const quotes = DAILY_QUOTES[currentEnergy as keyof typeof DAILY_QUOTES] || DAILY_QUOTES.peace;
  const exercises = EXERCISES[currentEnergy as keyof typeof EXERCISES] || EXERCISES.peace;
  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  // Compact version for home dashboard
  if (compact) {
    return createElement('Card', {className: 'p-5 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 border-violet-200 dark:border-violet-900'}, '<div className="flex items-start gap-3">
          createElement('Sparkles', {className: 'w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1'})
          <div className="flex-1">
            createElement('h3', {className: 'font-semibold text-violet-900 dark:text-violet-100 mb-2'}, 'Today's Wisdom')
            createElement('p', {className: 'text-sm text-muted-foreground italic leading-relaxed'}, '"{dailyQuote}"')
          </div>
        </div>');
  }

  // Full version
  return createElement('div', {className: 'space-y-6'}, '{/* Daily Quote */}
      <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border-violet-500/30">
        <div className="flex items-start gap-4">
          createElement('Sparkles', {className: 'w-8 h-8 text-violet-400 flex-shrink-0'})
          <div>
            createElement('h3', {className: 'text-lg mb-2'}, 'Today's Wisdom')
            createElement('p', {className: 'text-slate-300 text-lg italic leading-relaxed'}, '"{dailyQuote}"')
          </div>
        </div>
      </Card>

      {/* Daily Practices */}
      <div>
        createElement('h3', {className: 'text-xl mb-4'}, 'Today's Practices')
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const isComplete = completedToday[exercise.title];
            return (
              <Card
                key={index}
                className={`p-4 ${
                  isComplete
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    {isComplete ? (
                      createElement('Check', {className: 'w-5 h-5 text-green-400'})
                    ) : (
                      createElement('Play', {className: 'w-5 h-5 text-blue-400'})
                    )}
                  </div>
                  
                  <div className="flex-1">
                    createElement('h4', null, '{exercise.title}')
                    createElement('p', {className: 'text-sm text-slate-400'}, '{exercise.description}')
                  </div>

                  {!isComplete && (
                    createElement('Button', null, 'markComplete(exercise.title)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Complete')
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reflection Prompt */}
      <Card className="p-6 bg-slate-800/50 border-slate-700/50">
        createElement('h3', {className: 'text-lg mb-3'}, 'Reflection Prompt')
        createElement('p', {className: 'text-slate-300 mb-4'}, 'How has {currentEnergy} shown up in your life today? What insights have you gained?')
        createElement('Button', {className: 'w-full', variant: 'outline'}, 'Write in Journal')
      </Card>');
};