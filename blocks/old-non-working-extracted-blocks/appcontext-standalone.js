/**
 * AppContext Component
 * Props: { user?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  createContext, useContext, useState, useEffect, useRef  } from 'https://esm.sh/react@18';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';

export interface MoodLog {
  id: string;
  mood: string;
  timestamp: number;
  note?: string; // Phase 5: Journal support
}

export interface ChallengeLog {
  id: string;
  date: string;
  completed: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  author: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  resetData: () => void;
  
  // Data
  moods: MoodLog[];
  challenges: ChallengeLog[];
  totalMinutes: number;
  addMood: (mood: string, note?: string) => void;
  completeChallenge: () => void;
  isChallengeCompleteToday: () => boolean;
  addMinutes: (mins: number) => void;
  
  // Audio
  activeTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  seekTo: (sec: number) => void;
  closePlayer: () => void;
  
  // Community
  posts: CommunityPost[];
  toggleLike: (postId: string) => void;
  addPost: (content: string) => void;

  // Settings & Sync
  notificationSettings: NotificationSettings;
  setNotificationSettings: (settings: NotificationSettings) => void;
  isSyncing: boolean;
  lastSynced: string | null;
  triggerSync: () => Promise<void>;
  
  // UI
  toasts: ToastMessage[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export default function AppContext = createContext<AppState | null>(null);

const MOCK_POSTS: CommunityPost[] = [
  { id: '1', author: 'Anonymous', content: 'Today I tried the chicken dance challenge. I felt silly at first, but realizing nobody cared was freeing.', likes: 12, timestamp: '2h ago', isLiked: false },
  { id: '2', author: 'Seeker_99', content: 'Breathing through the anxiety really works. Box breathing is a lifesaver.', likes: 8, timestamp: '4h ago', isLiked: false },
  { id: '3', author: 'Newbie', content: 'Just started my journey. The AI companion is surprisingly insightful.', likes: 24, timestamp: '1d ago', isLiked: false },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [challenges, setChallenges] = useState<ChallengeLog[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  
  // Audio State
  const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioTimerRef = useRef<any>(null);

  // Community State
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);

  // Settings & Sync State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ enabled: false, time: '08:00' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  
  // UI State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem('moveTheMindUser');
        if (savedUser) setUserState(JSON.parse(savedUser));

        const storedData = localStorage.getItem('mtm_data');
        if (storedData) {
          const data = JSON.parse(storedData);
          setMoods(data.moods || []);
          setChallenges(data.challenges || []);
          setTotalMinutes(data.totalMinutes || 0);
          setFavorites(data.favorites || []);
          if (data.posts && data.posts.length > 0) setPosts(data.posts);
          if (data.notificationSettings) setNotificationSettings(data.notificationSettings);
          if (data.lastSynced) setLastSynced(data.lastSynced);
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('moveTheMindUser', user ? JSON.stringify(user) : '');
      localStorage.setItem('mtm_data', JSON.stringify({ 
        moods, 
        challenges, 
        totalMinutes, 
        favorites,
        posts, 
        notificationSettings, 
        lastSynced 
      }));
    }
  }, [user, moods, challenges, totalMinutes, favorites, posts, notificationSettings, lastSynced, isLoading]);

  const setUser = (u: UserProfile | null) => setUserState(u);

  const resetData = () => {
    localStorage.clear();
    setUserState(null);
    setMoods([]);
    setChallenges([]);
    setTotalMinutes(0);
    setFavorites([]);
    setPosts(MOCK_POSTS);
    setActiveTrack(null);
    setNotificationSettings({ enabled: false, time: '08:00' });
    setLastSynced(null);
    showToast('All data has been reset.', 'info');
  };

  // --- Domain Logic ---

  const addMood = (mood: string, note?: string) => {
    setMoods(prev => [{ id: Date.now().toString(), mood, timestamp: Date.now(), note }, ...prev]);
    showToast(note ? 'Journal entry saved' : 'Mood logged successfully', 'success');
  };

  const completeChallenge = () => {
    const today = new Date().toDateString();
    if (challenges.some(c => c.date === today)) return;
    setChallenges(prev => [{ id: Date.now().toString(), date: today, completed: true }, ...prev]);
    showToast('Challenge completed!', 'success');
  };

  const isChallengeCompleteToday = () => {
    const today = new Date().toDateString();
    return challenges.some(c => c.date === today);
  };

  const addMinutes = (mins: number) => {
    setTotalMinutes(prev => prev + mins);
  };

  // --- Audio Logic ---
  const playTrack = (track: AudioTrack) => {
    if (activeTrack?.id !== track.id) {
      setActiveTrack(track);
      setProgress(0);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const closePlayer = () => { setIsPlaying(false); setActiveTrack(null); };
  const seekTo = (sec: number) => setProgress(sec);

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const isFavorite = (trackId: string) => favorites.includes(trackId);

  useEffect(() => {
    if (isPlaying && activeTrack) {
      audioTimerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= activeTrack.durationSec) {
            setIsPlaying(false);
            addMinutes(Math.ceil(activeTrack.durationSec / 60));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(audioTimerRef.current);
    }
    return () => clearInterval(audioTimerRef.current);
  }, [isPlaying, activeTrack]);

  // --- Community Logic ---
  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
      }
      return p;
    }));
  };

  const addPost = (content: string) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: user?.name || 'Anonymous',
      content,
      likes: 0,
      timestamp: 'Just now',
      isLiked: false
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('Reflection shared to community', 'success');
  };

  // --- Sync Logic (Mock) ---
  const triggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastSynced(new Date().toISOString());
    setIsSyncing(false);
    showToast('Data successfully synced to cloud', 'success');
  };

  // --- Toast Logic ---
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, setUser, isLoading, resetData,
      moods, challenges, totalMinutes, addMood, completeChallenge, isChallengeCompleteToday, addMinutes,
      activeTrack, isPlaying, progress, playTrack, togglePlay, closePlayer, seekTo,
      favorites, toggleFavorite, isFavorite,
      posts, toggleLike, addPost,
      notificationSettings, setNotificationSettings, isSyncing, lastSynced, triggerSync,
      toasts, showToast, removeToast
    }}>
      {children}
      createElement('ToastContainer', null)
    </AppContext.Provider>
  );
}

const ToastContainer = ({ toasts }: { toasts: ToastMessage[] }) => (
  <div className="fixed top-6 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
    {toasts.map(t => (
      <div 
        key={t.id} 
        className="animate-slideUp bg-slate-800/90 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
      >
        {t.type === 'success' && createElement('CheckCircle', {className: 'text-emerald-400'})}
        {t.type === 'error' && createElement('AlertCircle', {className: 'text-red-400'})}
        {t.type === 'info' && createElement('Bell', {className: 'text-blue-400'})}
        createElement('span', {className: 'text-sm font-medium'}, '{t.message}')
      </div>
    ))}
  </div>
);