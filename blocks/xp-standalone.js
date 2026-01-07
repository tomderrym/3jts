/**
 * XPDisplay Component
 * Props: { totalXP?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Zap, Award, TrendingUp } from 'lucide-react';

export interface XPActivity {
  type: 'breathing' | 'meditation' | 'routine' | 'journal' | 'plibhu' | 'streak';
  xp: number;
  timestamp: number;
}

export const XP_REWARDS = {
  breathing_complete: 10,
  meditation_complete: 15,
  routine_complete: 8,
  journal_entry: 5,
  plibhu_reflection: 12,
  daily_login: 5,
  streak_bonus: 20,
  challenge_level: 25,
  custom_breathing: 15,
  meditation_guided: 20,
};

export const calculateLevel = (totalXP: number): number => {
  // Progressive level system: Level = sqrt(XP / 100)
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const getXPProgress = (totalXP: number): { currentLevel: number; currentLevelXP: number; nextLevelXP: number; progress: number } => {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = getXPForNextLevel(currentLevel - 1);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInLevel = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progress = (xpInLevel / xpNeeded) * 100;
  
  return { currentLevel, currentLevelXP: xpInLevel, nextLevelXP: xpNeeded, progress };
};

interface XPDisplayProps {
  totalXP: number;
  compact?: boolean;
}

export default function XPDisplay: React.FC<XPDisplayProps> = ({ totalXP, compact = false }) => {
  const { currentLevel, currentLevelXP, nextLevelXP, progress } = getXPProgress(totalXP);

  if (compact) {
    return createElement('div', {className: 'flex items-center gap-2'}, '<div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30">
          createElement('Zap', {className: 'w-4 h-4 text-violet-400'})
          createElement('span', {className: 'text-violet-400'}, '{totalXP}')
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          createElement('Award', {className: 'w-4 h-4 text-amber-400'})
          createElement('span', {className: 'text-amber-400'}, 'Lv {currentLevel}')
        </div>');
  }

  return createElement('Card', {className: 'p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50'}, '<div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          createElement('Award', {className: 'w-5 h-5 text-amber-400'})
          createElement('span', {className: 'text-slate-300'}, 'Level {currentLevel}')
        </div>
        <div className="flex items-center gap-1">
          createElement('Zap', {className: 'w-4 h-4 text-violet-400'})
          createElement('span', {className: 'text-violet-400'}, '{totalXP} XP')
        </div>
      </div>
      createElement('Progress', {className: 'h-2 mb-2'})
      <div className="flex justify-between text-xs text-slate-400">
        createElement('span', null, '{Math.floor(currentLevelXP)} / {nextLevelXP} XP')
        createElement('span', null, '{Math.floor(nextLevelXP - currentLevelXP)} to Level {currentLevel + 1}')
      </div>');
};

interface XPNotificationProps {
  amount: number;
  activity: string;
  onClose: () => void;
}

export const XPNotification: React.FC<XPNotificationProps> = ({ amount, activity, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createElement('div', {className: 'fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top'}, '<div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg">
        createElement('Zap', {className: 'w-5 h-5 text-white'})
        createElement('span', {className: 'text-white'}, '+{amount} XP')
        createElement('span', {className: 'text-violet-200 text-sm'}, '{activity}')
      </div>');
};

export const useXP = () => {
  const [totalXP, setTotalXP] = React.useState(0);
  const [recentActivities, setRecentActivities] = React.useState<XPActivity[]>([]);
  const [showNotification, setShowNotification] = React.useState<{ amount: number; activity: string } | null>(null);

  React.useEffect(() => {
    // Load XP from localStorage
    const stored = localStorage.getItem('movethemind_xp');
    if (stored) {
      const data = JSON.parse(stored);
      setTotalXP(data.total || 0);
      setRecentActivities(data.activities || []);
    }
  }, []);

  const addXP = (activity: keyof typeof XP_REWARDS, customAmount?: number) => {
    const amount = customAmount || XP_REWARDS[activity];
    const newActivity: XPActivity = {
      type: activity.split('_')[0] as XPActivity['type'],
      xp: amount,
      timestamp: Date.now(),
    };

    const newTotal = totalXP + amount;
    const newActivities = [newActivity, ...recentActivities].slice(0, 50);

    setTotalXP(newTotal);
    setRecentActivities(newActivities);
    setShowNotification({ amount, activity: activity.replace(/_/g, ' ') });

    localStorage.setItem('movethemind_xp', JSON.stringify({
      total: newTotal,
      activities: newActivities,
    }));
  };

  return {
    totalXP,
    recentActivities,
    addXP,
    showNotification,
    setShowNotification,
    ...getXPProgress(totalXP),
  };
};
