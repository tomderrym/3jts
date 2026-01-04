/**
 * NavButton Component

 */
import React, {  useState  } from 'https://esm.sh/react@18';
import { Home, Wind, Sparkles, Users, UserCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, activeTrack } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'breathe' | 'meditate' | 'community' | 'profile'>('home');

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <TabHome user={user} />;
      case 'breathe': return <TabBreathe />;
      case 'meditate': return <TabMeditate />;
      case 'community': return <TabCommunity />;
      case 'profile': return <TabProfile />;
      default: return <TabHome user={user} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950">
      <main className="flex-1 overflow-y-auto overflow-x-hidden safe-area-inset-top">
        {renderContent()}
        {/* Spacer for bottom nav + player */}
        <div className={`transition-all duration-300 ${activeTrack ? 'h-40' : 'h-24'}`} />
      </main>

      <AudioPlayer />

      <div className="h-[88px] pb-[env(safe-area-inset-bottom)] bg-slate-900/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around fixed bottom-0 left-0 right-0 z-40 px-2">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
        <NavButton active={activeTab === 'breathe'} onClick={() => setActiveTab('breathe')} icon={Wind} label="Breathe" />
        <NavButton active={activeTab === 'meditate'} onClick={() => setActiveTab('meditate')} icon={Sparkles} label="Meditate" />
        <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={Users} label="Community" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserCircle} label="Profile" />
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-14 transition-colors duration-300 ${active ? 'text-blue-400' : 'text-slate-500'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className="mb-1" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);