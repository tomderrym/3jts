/**
 * MEDITATIONS Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Sparkles, Headphones, Play, Heart, Filter } from 'lucide-react';

const MEDITATIONS: AudioTrack[] = [
  { id: 'm1', title: 'The Comedian Monk', author: 'Dr. Smiles', category: 'Humility', durationSec: 720 },
  { id: 'm2', title: 'River of Thoughts', author: 'Zen Master', category: 'Anxiety', durationSec: 600 },
  { id: 'm3', title: 'Morning Sunlight', author: 'Nature Sounds', category: 'Focus', durationSec: 300 },
  { id: 'm4', title: 'Deep Sleep Delta', author: 'Sleep Tech', category: 'Sleep', durationSec: 1200 },
];

export default function TabMeditate() {
  const { playTrack, activeTrack, isPlaying, isFavorite } = useApp();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Sleep', 'Anxiety', 'Focus', 'Nature'];

  const filteredTracks = MEDITATIONS.filter(t => {
    if (showFavoritesOnly && !isFavorite(t.id)) return false;
    if (activeCategory !== 'All' && t.category !== activeCategory && !t.category.includes(activeCategory)) return false;
    return true;
  });

  return (
    <div className="p-6 pt-10 space-y-6 animate-fadeIn pb-32">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white mb-2">Meditate</h1>
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-2 rounded-full border transition-all ${showFavoritesOnly ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
        >
          <Heart size={20} fill={showFavoritesOnly ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full border text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">
        {showFavoritesOnly ? 'Your Favorites' : 'Recommended for You'}
      </h2>

      <div className="space-y-4">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>No tracks found.</p>
            {showFavoritesOnly && <p className="text-xs mt-2">Tap the heart icon on any track to add it here.</p>}
          </div>
        ) : (
          filteredTracks.map((track) => {
             const isActive = activeTrack?.id === track.id;
             const isFav = isFavorite(track.id);
             return (
              <button 
                key={track.id}
                onClick={() => playTrack(track)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group active:scale-[0.98] ${
                  isActive 
                    ? 'bg-blue-900/20 border-blue-500/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-colors relative ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-amber-900/30 text-amber-500'
                }`}>
                  {isActive && isPlaying ? <Sparkles size={24} className="animate-pulse" /> : <Headphones size={24} />}
                  {isFav && (
                    <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border border-white/10">
                      <Heart size={12} className="text-red-500" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${isActive ? 'text-blue-200' : 'text-white'}`}>{track.title}</h3>
                  <p className="text-xs text-slate-400">{track.category} • {Math.floor(track.durationSec / 60)} min</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-white/10 text-white opacity-0 group-hover:opacity-100'
                }`}>
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}