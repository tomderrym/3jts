/**
 * StudioPage Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';





export default function StudioPage: React.FC = () => {
  const { appId } = useParams<{ appId?: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appId && appId !== 'new') {
      loadProject(appId);
    } else {
      setLoading(false);
    }
  }, [appId]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const apps = await appService.fetchUserApps(user.id);
      const foundApp = apps.find(app => app.id === id || app.supabaseAppId === id);
      if (foundApp) {
        setProject(foundApp);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Studio Header */}
      <div className="h-12 border-b border-white/5 bg-[#111114] flex items-center px-4 shrink-0 z-40">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        {project && (
          <div className="ml-4 text-sm font-medium text-white">
            {project.name}
          </div>
        )}
      </div>
      {/* App Component (Studio Interface) */}
      <div className="flex-1 overflow-hidden min-h-0">
        <App initialProject={project} onNavigateToDashboard={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

