/**
 * MOODS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { X, Smile, Frown, Meh, Zap, Cloud, ArrowRight, Save } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSelect: (mood: string, note?: string) => void;
}

const MOODS = [
  { label: 'Happy', icon: Smile, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { label: 'Calm', icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: 'Focused', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { label: 'Anxious', icon: Frown, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { label: 'Tired', icon: Meh, color: 'text-slate-400', bg: 'bg-slate-500/20' },
];

export default function MoodLogger({ onClose, onSelect }: Props) {
  const [step, setStep] = useState<'mood' | 'journal'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    setStep('journal');
  };

  const handleSave = () => {
    onSelect(selectedMood, note.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 safe-area-inset-bottom">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {step === 'mood' ? 'How are you feeling?' : 'Journal (Optional)'}
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {step === 'mood' ? (
          <div className="grid grid-cols-3 gap-4 mb-4 animate-fadeIn">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodClick(m.label)}
                className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl bg-white/5 border border-white/5 active:bg-white/10 active:scale-95 transition-all"
              >
                <div className={`w-10 h-10 rounded-full ${m.bg} flex items-center justify-center ${m.color}`}>
                  <m.icon size={24} />
                </div>
                <span className="text-xs font-medium text-slate-300">{m.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-slideUp">
             <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
               <span className="text-slate-400 text-sm">Selected Mood:</span>
               <span className="text-white font-bold">{selectedMood}</span>
             </div>
             
             <textarea
               rows={4}
               autoFocus
               placeholder="Why do you feel this way? (Optional)"
               value={note}
               onChange={(e) => setNote(e.target.value)}
               className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none resize-none"
             />

             <button 
               onClick={handleSave}
               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
             >
               Save Entry <Save size={18} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}