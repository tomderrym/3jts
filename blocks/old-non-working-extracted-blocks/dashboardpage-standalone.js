/**
 * DashboardPage Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid3x3, List, LogOut, User, Code2, Activity, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';






export default function DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
    loadApps(user.id);
  };

  const loadApps = async (userId: string) => {
    try {
      setLoading(true);
      const userApps = await appService.fetchUserApps(userId);
      setApps(userApps);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleCreateApp = () => {
    navigate('/studio/new');
  };

  const handleAppClick = (appId: string) => {
    navigate(`/studio/${appId}`);
  };

  // Calculate stats
  const totalApps = apps.length;
  const activeApps = apps.filter(app => app.isCloud).length;
  const recentApps = apps.filter(app => {
    const created = new Date(app.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length;

  return createElement('div', {className: 'min-h-screen bg-[#0a0a0c] text-white'}, '{/* Header */}
      <header className="border-b border-white/5 bg-[#111114]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                createElement('Code2', {className: 'text-white'})
              </div>
              createElement('span', {className: 'text-xl font-bold'}, '3J Tech Solutions')
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                createElement('User', null)
                createElement('span', null, '{user?.email}')
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                createElement('LogOut', null)
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111114] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              createElement('span', {className: 'text-sm text-slate-400'}, 'Total Apps')
              createElement('Code2', {className: 'text-indigo-400'})
            </div>
            createElement('div', {className: 'text-3xl font-bold'}, '{totalApps}')
          </div>
          <div className="bg-[#111114] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              createElement('span', {className: 'text-sm text-slate-400'}, 'Active Apps')
              createElement('Activity', {className: 'text-emerald-400'})
            </div>
            createElement('div', {className: 'text-3xl font-bold'}, '{activeApps}')
          </div>
          <div className="bg-[#111114] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              createElement('span', {className: 'text-sm text-slate-400'}, 'This Week')
              createElement('TrendingUp', {className: 'text-violet-400'})
            </div>
            createElement('div', {className: 'text-3xl font-bold'}, '{recentApps}')
          </div>
        </div>

        {/* Apps Section */}
        <div className="bg-[#111114] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            createElement('h2', {className: 'text-2xl font-bold'}, 'My Apps')
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  createElement('Grid3x3', null)
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  createElement('List', null)
                </button>
              </div>
              <button
                onClick={handleCreateApp}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all"
              >
                createElement('Plus', null)
                New App
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              createElement('div', {className: 'text-slate-400'}, 'Loading apps...')') : apps.length === 0 ? (
            <div className="text-center py-20">
              createElement('Code2', {className: 'mx-auto mb-4 text-slate-600'})
              createElement('p', {className: 'text-slate-400 mb-4'}, 'No apps yet. Create your first app to get started!')
              createElement('button', {className: 'px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all', onClick: handleCreateApp}, 'Create App')
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                createElement('AppsGridView', {onAppClick: handleAppClick})
              ) : (
                createElement('AppsListView', {onAppClick: handleAppClick})
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

