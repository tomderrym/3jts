/**
 * HabitTracker Component
 * Props: { amount?: any, activity?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { TrendingUp, Calendar, Smile, Frown, Meh } from 'lucide-react';

interface HabitTrackerProps {
  energies: any[];
  onXPEarned?: (amount: number, activity: string) => void;
}

interface DailyCheckIn {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'difficult';
  centeredness: number; // 1-5
  notes?: string;
}

export default function HabitTracker: React.FC<HabitTrackerProps> = ({ energies, onXPEarned }) => {
  const [checkIns, setCheckIns] = React.useState<{[date: string]: DailyCheckIn}>({});
  const [todayMood, setTodayMood] = React.useState<DailyCheckIn['mood'] | null>(null);
  const [todayCenteredness, setTodayCenteredness] = React.useState(3);

  React.useEffect(() => {
    const stored = localStorage.getItem('movethemind_checkins');
    if (stored) {
      setCheckIns(JSON.parse(stored));
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayCheckIn = checkIns[today];

  const saveCheckIn = (mood: DailyCheckIn['mood'], centeredness: number) => {
    const newCheckIn: DailyCheckIn = {
      date: today,
      mood,
      centeredness,
    };

    const updated = {
      ...checkIns,
      [today]: newCheckIn,
    };

    setCheckIns(updated);
    localStorage.setItem('movethemind_checkins', JSON.stringify(updated));
    setTodayMood(mood);
    onXPEarned?.(5, 'Daily Check-in');
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getMoodIcon = (mood?: DailyCheckIn['mood']) => {
    switch (mood) {
      case 'great':
      case 'good':
        return createElement('Smile', {className: 'w-5 h-5 text-green-400'});
      case 'okay':
        return createElement('Meh', {className: 'w-5 h-5 text-yellow-400'});
      case 'low':
      case 'difficult':
        return createElement('Frown', {className: 'w-5 h-5 text-red-400'});
      default:
        return createElement('div', {className: 'w-5 h-5 rounded-full bg-slate-700'});
    }
  };

  const last7Days = getLast7Days();
  const avgCenteredness = Object.values(checkIns).length > 0
    ? Object.values(checkIns).reduce((sum, c) => sum + c.centeredness, 0) / Object.values(checkIns).length
    : 0;

  return createElement('div', {className: 'space-y-6'}, '{/* Today's Check-in */}
      {!todayCheckIn ? (
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-blue-500/30">
          createElement('h2', {className: 'text-xl mb-4'}, 'How centered do you feel today?')
          
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(val => (
                createElement('button', null, 'setTodayCenteredness(val)}
                  className={`flex-1 h-12 rounded-lg transition-all ${
                    todayCenteredness === val
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {val}')
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              createElement('span', null, 'Not centered')
              createElement('span', null, 'Very centered')
            </div>
          </div>

          createElement('h3', {className: 'text-lg mb-3'}, 'How's your overall mood?')
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { id: 'great', label: 'Great', emoji: '😊' },
              { id: 'good', label: 'Good', emoji: '🙂' },
              { id: 'okay', label: 'Okay', emoji: '😐' },
              { id: 'low', label: 'Low', emoji: '😔' },
              { id: 'difficult', label: 'Difficult', emoji: '😢' },
            ].map(option => (
              <button
                key={option.id}
                onClick={() => saveCheckIn(option.id as DailyCheckIn['mood'], todayCenteredness)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
              >
                createElement('span', {className: 'text-2xl'}, '{option.emoji}')
                createElement('span', {className: 'text-xs text-slate-400'}, '{option.label}')
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-green-500/10 border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            createElement('div', {className: 'w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center'}, '{getMoodIcon(todayCheckIn.mood)}')
            <div>
              createElement('h3', {className: 'text-lg'}, 'Today's Check-in Complete ✓')
              createElement('p', {className: 'text-sm text-slate-400'}, 'Centeredness: {todayCheckIn.centeredness}/5')
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Overview */}
      <Card className="p-6 bg-slate-800/50 border-slate-700/50">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          createElement('Calendar', {className: 'w-5 h-5 text-blue-400'})
          Last 7 Days
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map(date => {
            const checkIn = checkIns[date];
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={date} className="flex flex-col items-center gap-2">
                createElement('span', {className: 'text-xs text-slate-500'}, '{dayName}')
                <div className="w-12 h-12 rounded-lg bg-slate-900/50 flex items-center justify-center">
                  {checkIn ? getMoodIcon(checkIn.mood) : createElement('div', {className: 'w-2 h-2 rounded-full bg-slate-700'}, '}')
                {checkIn && (
                  createElement('span', {className: 'text-xs text-slate-400'}, '{checkIn.centeredness}/5')
                )}');
          })}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
          <div className="flex items-center gap-3">
            createElement('TrendingUp', {className: 'w-8 h-8 text-blue-400'})
            <div>
              createElement('div', {className: 'text-2xl'}, '{avgCenteredness.toFixed(1)}')
              createElement('div', {className: 'text-xs text-slate-400'}, 'Avg Centeredness')
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
          <div className="flex items-center gap-3">
            createElement('Calendar', {className: 'w-8 h-8 text-violet-400'})
            <div>
              createElement('div', {className: 'text-2xl'}, '{Object.keys(checkIns).length}')
              createElement('div', {className: 'text-xs text-slate-400'}, 'Total Check-ins')
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
