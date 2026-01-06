/**
 * RequiresActionPanel Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { AlertTriangle, CheckCircle, X, Zap, Database, Server, ExternalLink, Loader2 } from 'lucide-react';


export interface RequiredAction {
  id: string;
  type: 'supabase_setup' | 'edge_function_deploy' | 'database_migration' | 'api_key_missing' | 'permission_grant';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
  resolved: boolean;
}

interface RequiresActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appId?: string;
  userId?: string;
}

export default function RequiresActionPanel: React.FC<RequiresActionPanelProps> = ({
  isOpen,
  onClose,
  appId,
  userId,
}) => {
  const [actions, setActions] = useState<RequiredAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    if (isOpen && (appId || userId)) {
      checkRequiredActions();
    }
  }, [isOpen, appId, userId]);

  // Blinking animation for urgent actions
  useEffect(() => {
    if (actions.some(a => !a.resolved && a.severity === 'high')) {
      const interval = setInterval(() => {
        setBlinking(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setBlinking(false);
    }
  }, [actions]);

  const checkRequiredActions = async () => {
    setLoading(true);
    try {
      const detectedActions: RequiredAction[] = [];

      // Check Supabase setup
      if (!appId) {
        detectedActions.push({
          id: 'supabase_setup',
          type: 'supabase_setup',
          title: 'Supabase Integration Required',
          description: 'Connect your app to Supabase to enable cloud features, database, and edge functions.',
          severity: 'high',
          actionUrl: 'https://supabase.com/dashboard',
          actionLabel: 'Set up Supabase',
          resolved: false,
        });
      } else {
        // Check if app has database tables
        try {
          const { data: tables, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(1);

          if (error || !tables || tables.length === 0) {
            detectedActions.push({
              id: 'database_migration',
              type: 'database_migration',
              title: 'Database Migration Needed',
              description: 'Your app database schema needs to be set up. Run the migration scripts to create required tables.',
              severity: 'high',
              actionUrl: '#database',
              actionLabel: 'View Database',
              resolved: false,
            });
          }
        } catch (e) {
          // Database check failed - might need setup
          detectedActions.push({
            id: 'database_migration',
            type: 'database_migration',
            title: 'Database Setup Required',
            description: 'Database connection or schema setup is needed.',
            severity: 'high',
            resolved: false,
          });
        }
      }

      // Check for edge functions
      if (appId) {
        try {
          const { data: functions, error } = await supabase.functions.list();
          
          if (!error && functions && functions.length === 0) {
            detectedActions.push({
              id: 'edge_function_deploy',
              type: 'edge_function_deploy',
              title: 'Deploy Edge Functions',
              description: 'No edge functions detected. Deploy functions to enable serverless capabilities.',
              severity: 'medium',
              actionUrl: '#functions',
              actionLabel: 'View Functions',
              resolved: false,
            });
          }
        } catch (e) {
          // Functions check failed
          detectedActions.push({
            id: 'edge_function_deploy',
            type: 'edge_function_deploy',
            title: 'Edge Functions Setup',
            description: 'Set up Supabase Edge Functions for serverless backend capabilities.',
            severity: 'medium',
            resolved: false,
          });
        }
      }

      // Check for API keys in integrations
      const integrations = localStorage.getItem('integrations');
      if (integrations) {
        const parsed = JSON.parse(integrations);
        if (!parsed.geminiApiKey && !parsed.openaiApiKey && !parsed.anthropicApiKey) {
          detectedActions.push({
            id: 'api_key_missing',
            type: 'api_key_missing',
            title: 'AI API Key Required',
            description: 'Add an AI provider API key (Gemini, OpenAI, or Anthropic) to enable AI features.',
            severity: 'medium',
            actionUrl: '#settings',
            actionLabel: 'Open Settings',
            resolved: false,
          });
        }
      } else {
        detectedActions.push({
          id: 'api_key_missing',
          type: 'api_key_missing',
          title: 'AI API Key Required',
          description: 'Add an AI provider API key to enable AI features.',
          severity: 'medium',
          actionUrl: '#settings',
          actionLabel: 'Open Settings',
          resolved: false,
        });
      }

      setActions(detectedActions);
    } catch (error) {
      console.error('Failed to check required actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = (actionId: string) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, resolved: true } : a
    ));
  };

  const unresolvedCount = actions.filter(a => !a.resolved).length;
  const highPriorityCount = actions.filter(a => !a.resolved && a.severity === 'high').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111114] border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              highPriorityCount > 0 
                ? blinking 
                  ? 'bg-red-500/20 animate-pulse' 
                  : 'bg-red-500/20'
                : 'bg-amber-500/20'
            }`}>
              <AlertTriangle 
                size={20} 
                className={highPriorityCount > 0 ? 'text-red-400' : 'text-amber-400'} 
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Required Actions</h2>
              <p className="text-xs text-slate-400">
                {unresolvedCount > 0 
                  ? `${unresolvedCount} action${unresolvedCount !== 1 ? 's' : ''} needed`
                  : 'All actions completed'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-indigo-400" />
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto mb-4 text-emerald-400 opacity-50" />
              <p className="text-sm text-slate-400">No actions required</p>
              <p className="text-xs text-slate-500 mt-2">Everything is set up correctly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-lg border transition-all ${
                    action.resolved
                      ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60'
                      : action.severity === 'high'
                      ? blinking
                        ? 'bg-red-500/10 border-red-500/30 animate-pulse'
                        : 'bg-red-500/10 border-red-500/30'
                      : action.severity === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {action.type === 'supabase_setup' && <Database size={16} className="text-indigo-400" />}
                        {action.type === 'edge_function_deploy' && <Server size={16} className="text-purple-400" />}
                        {action.type === 'database_migration' && <Database size={16} className="text-cyan-400" />}
                        {action.type === 'api_key_missing' && <Key size={16} className="text-yellow-400" />}
                        <h3 className={`text-sm font-bold ${
                          action.resolved ? 'text-slate-400 line-through' : 'text-white'
                        }`}>
                          {action.title}
                        </h3>
                        {!action.resolved && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            action.severity === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : action.severity === 'medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {action.severity.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${
                        action.resolved ? 'text-slate-500' : 'text-slate-300'
                      }`}>
                        {action.description}
                      </p>
                      {action.actionUrl && !action.resolved && (
                        <button
                          onClick={() => {
                            if (action.actionUrl?.startsWith('#')) {
                              // Internal navigation
                              const target = action.actionUrl.substring(1);
                              if (target === 'settings') {
                                // Trigger settings open - you'll need to pass this as prop
                                window.dispatchEvent(new CustomEvent('openSettings'));
                              }
                            } else {
                              window.open(action.actionUrl, '_blank');
                            }
                          }}
                          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          {action.actionLabel || 'Take Action'}
                          <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                    {!action.resolved && (
                      <button
                        onClick={() => markAsResolved(action.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Mark as resolved"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {unresolvedCount > 0 
                ? `${unresolvedCount} unresolved action${unresolvedCount !== 1 ? 's' : ''}`
                : 'All actions completed'}
            </span>
            <button
              onClick={checkRequiredActions}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Zap size={12} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

