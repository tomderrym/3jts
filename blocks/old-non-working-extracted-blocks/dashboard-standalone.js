/**
 * NavButton Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Home, Wind, Sparkles, Users, UserCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, activeTrack } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'breathe' | 'meditate' | 'community' | 'profile'>('home');

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return createElement('TabHome', null);
      case 'breathe': return createElement('TabBreathe', null);
      case 'meditate': return createElement('TabMeditate', null);
      case 'community': return createElement('TabCommunity', null);
      case 'profile': return createElement('TabProfile', null);
      default: return createElement('TabHome', null);
    }
  };

  return createElement('div', {className: 'h-full w-full flex flex-col bg-slate-950'}, '<main className="flex-1 overflow-y-auto overflow-x-hidden safe-area-inset-top">
        {renderContent()}
        {/* Spacer for bottom nav + player */}
        createElement('div', null)
      </main>

      createElement('AudioPlayer', null)

      <div className="h-[88px] pb-[env(safe-area-inset-bottom)] bg-slate-900/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around fixed bottom-0 left-0 right-0 z-40 px-2">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
        <NavButton active={activeTab === 'breathe'} onClick={() => setActiveTab('breathe')} icon={Wind} label="Breathe" />
        <NavButton active={activeTab === 'meditate'} onClick={() => setActiveTab('meditate')} icon={Sparkles} label="Meditate" />
        <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={Users} label="Community" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserCircle} label="Profile" />
      </div>');
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-14 transition-colors duration-300 ${active ? 'text-blue-400' : 'text-slate-500'}`}
  >
    createElement('Icon', {className: 'mb-1'})
    createElement('span', {className: 'text-[10px] font-medium'}, '{label}')
  </button>
);