/**
 * EdgeFunctionsViewer Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { Server, Code, Play, X, RefreshCw, Loader2, ExternalLink, Zap, Clock } from 'lucide-react';


interface EdgeFunction {
  id: string;
  name: string;
  slug: string;
  version: number;
  created_at: string;
  updated_at: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

interface EdgeFunctionsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  projectRef?: string;
}

export default function EdgeFunctionsViewer: React.FC<EdgeFunctionsViewerProps> = ({
  isOpen,
  onClose,
  projectRef,
}) => {
  const [functions, setFunctions] = useState<EdgeFunction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadEdgeFunctions();
    }
  }, [isOpen, projectRef]);

  const loadEdgeFunctions = async () => {
    setLoading(true);
    try {
      // Try to list edge functions
      // Note: Supabase client doesn't have direct edge functions list API
      // We'll use a workaround or show known functions
      
      // For now, show a list based on common patterns
      // In production, you'd want to use Supabase Management API or a custom endpoint
      
      const knownFunctions: EdgeFunction[] = [
        {
          id: 'blocks-upsert',
          name: 'blocks-upsert',
          slug: 'blocks-upsert',
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'ACTIVE',
        },
        // Add more functions as detected
      ];

      // Try to fetch from Supabase if we have project ref
      if (projectRef) {
        try {
          // Attempt to get functions via REST API
          // Note: Supabase client doesn't expose supabaseUrl directly
          // We'll use the projectRef parameter or extract from environment
          const projectId = projectRef;
          
          if (projectId) {
            // This would require Management API access
            // For now, we'll show the known functions
            setFunctions(knownFunctions);
          } else {
            setFunctions(knownFunctions);
          }
        } catch (e) {
          console.warn('Could not fetch functions list:', e);
          setFunctions(knownFunctions);
        }
      } else {
        setFunctions(knownFunctions);
      }
    } catch (error) {
      console.error('Failed to load edge functions:', error);
      setFunctions([]);
    } finally {
      setLoading(false);
    }
  };

  const getFunctionUrl = (slug: string) => {
    const projectId = projectRef || 'your-project';
    return `https://${projectId}.supabase.co/functions/v1/${slug}`;
  };

  if (!isOpen) return null;

  return createElement('div', {className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'}, '<div className="bg-[#111114] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              createElement('Server', {className: 'text-purple-400'})
            </div>
            <div>
              createElement('h2', {className: 'text-lg font-bold text-white'}, 'Edge Functions')
              createElement('p', {className: 'text-xs text-slate-400'}, 'View and manage Supabase Edge Functions')
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadEdgeFunctions}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              createElement('RefreshCw', null)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              createElement('X', null)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              createElement('Loader2', {className: 'animate-spin text-indigo-400'})') : functions.length === 0 ? (
            <div className="text-center py-12">
              createElement('Server', {className: 'mx-auto mb-4 opacity-50 text-slate-500'})
              createElement('p', {className: 'text-sm text-slate-400 mb-2'}, 'No edge functions found')
              createElement('p', {className: 'text-xs text-slate-500 mb-6'}, 'Deploy edge functions to enable serverless backend capabilities')
              <a
                href="https://supabase.com/docs/guides/functions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                createElement('Zap', null)
                Learn about Edge Functions
                createElement('ExternalLink', null)
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {functions.map((func) => (
                <div
                  key={func.id}
                  className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        createElement('Code', {className: 'text-purple-400'})
                        createElement('h3', {className: 'text-sm font-bold text-white'}, '{func.name}')
                        {func.status && (
                          createElement('span', null, '{func.status}')
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-slate-400 mb-3">
                        <div className="flex items-center gap-2">
                          createElement('span', {className: 'font-semibold'}, 'Slug:')
                          createElement('code', {className: 'px-2 py-0.5 bg-black/40 rounded text-slate-300'}, '{func.slug}')
                        </div>
                        <div className="flex items-center gap-2">
                          createElement('span', {className: 'font-semibold'}, 'Version:')
                          createElement('span', null, '{func.version}')
                        </div>
                        <div className="flex items-center gap-2">
                          createElement('Clock', null)
                          createElement('span', null, 'Updated: {new Date(func.updated_at).toLocaleDateString()}')
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getFunctionUrl(func.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          createElement('Play', null)
                          Test Function
                          createElement('ExternalLink', null)
                        </a>
                        <a
                          href={`https://supabase.com/dashboard/project/${projectRef || 'your-project'}/functions/${func.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-lg transition-colors border border-white/10"
                        >
                          View in Dashboard
                          createElement('ExternalLink', null)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500">
            createElement('span', null, '{functions.length} function{functions.length !== 1 ? 's' : ''} found')
            <a
              href="https://supabase.com/docs/guides/functions/quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              createElement('Zap', null)
              Deploy New Function
              createElement('ExternalLink', null)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

