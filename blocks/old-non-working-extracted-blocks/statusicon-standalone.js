/**
 * Diagnostics Panel
 * Displays system configuration and connection status
 * Only visible in debug mode
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Key,
  Server,
  Globe,
} from 'lucide-react';

export function DiagnosticsPanel() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState('');
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // Suppress "Auth session missing" errors - they're expected when not logged in
        const errorStr = error?.message || String(error);
        if (!errorStr.includes('Auth session missing') && 
            !errorStr.includes('AuthSessionMissingError') &&
            !errorStr.includes('session_missing')) {
          console.error('Auth check error:', error);
        }
        setAuthStatus('unauthenticated');
        return;
      }

      if (user) {
        setAuthStatus('authenticated');
        setCurrentUser(user);
      } else {
        setAuthStatus('unauthenticated');
      }
    } catch (error: any) {
      // Suppress "Auth session missing" errors - they're expected when not logged in
      const errorStr = error?.message || String(error);
      if (!errorStr.includes('Auth session missing') && 
          !errorStr.includes('AuthSessionMissingError') &&
          !errorStr.includes('session_missing')) {
        console.error('Auth check exception:', error);
      }
      setAuthStatus('unauthenticated');
    }
  };

  const testDatabaseConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    setConnectionError('');

    try {
      // Try to query the user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(error.message);
      }

      setConnectionStatus('success');
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const config = {
    supabaseUrl: environmentService.supabaseUrl,
    hasAnonKey: !!environmentService.supabaseAnonKey,
    anonKeyPreview: environmentService.supabaseAnonKey.substring(0, 20) + '...',
    environment: environmentService.isDevelopment ? 'Development' : 'Production',
  };

  export default function StatusIcon = ({ status }: { status: 'success' | 'error' | 'warning' | 'idle' }) => {
    switch (status) {
      case 'success':
        return createElement('CheckCircle', {className: 'h-5 w-5 text-green-500'});
      case 'error':
        return createElement('XCircle', {className: 'h-5 w-5 text-red-500'});
      case 'warning':
        return createElement('AlertCircle', {className: 'h-5 w-5 text-yellow-500'});
      default:
        return createElement('AlertCircle', {className: 'h-5 w-5 text-muted-foreground'});
    }
  };

  return createElement('Card', {className: 'w-full max-w-2xl mx-auto'}, '<CardHeader>
        <div className="flex items-center gap-2">
          createElement('Database', {className: 'h-5 w-5'})
          createElement('CardTitle', null, 'System Diagnostics')
        </div>
        createElement('CardDescription', null, 'Configuration and connection status')
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            createElement('Globe', {className: 'h-4 w-4 text-muted-foreground'})
            createElement('h3', {className: 'font-semibold'}, 'Environment')
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              createElement('span', {className: 'text-muted-foreground'}, 'Mode:')
              createElement('Badge', null, '{config.environment}')
            </div>
          </div>
        </div>

        createElement('Separator', null)

        {/* Supabase Configuration */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            createElement('Server', {className: 'h-4 w-4 text-muted-foreground'})
            createElement('h3', {className: 'font-semibold'}, 'Supabase Configuration')
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4">
              createElement('span', {className: 'text-muted-foreground'}, 'URL:')
              createElement('span', {className: 'font-mono text-xs break-all text-right'}, '{config.supabaseUrl}')
            </div>
            <div className="flex items-center justify-between">
              createElement('span', {className: 'text-muted-foreground'}, 'Anon Key:')
              <div className="flex items-center gap-2">
                createElement('StatusIcon', null)
                createElement('span', {className: 'font-mono text-xs'}, '{config.hasAnonKey ? config.anonKeyPreview : 'Missing'}')
              </div>
            </div>
          </div>
        </div>

        createElement('Separator', null)

        {/* Authentication Status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            createElement('Key', {className: 'h-4 w-4 text-muted-foreground'})
            createElement('h3', {className: 'font-semibold'}, 'Authentication')
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              createElement('span', {className: 'text-muted-foreground'}, 'Status:')
              <div className="flex items-center gap-2">
                createElement('StatusIcon', null)
                createElement('Badge', null, '{authStatus === 'checking' ? 'Checking...' : 
                   authStatus === 'authenticated' ? 'Authenticated' : 
                   'Not Authenticated'}')
              </div>
            </div>
            {currentUser && (
              <>
                <div className="flex items-center justify-between">
                  createElement('span', {className: 'text-muted-foreground'}, 'User ID:')
                  createElement('span', {className: 'font-mono text-xs'}, '{currentUser.id.substring(0, 8)}...')
                </div>
                <div className="flex items-center justify-between">
                  createElement('span', {className: 'text-muted-foreground'}, 'Email:')
                  createElement('span', {className: 'text-xs'}, '{currentUser.email}')
                </div>
              </>
            )}
          </div>
        </div>

        createElement('Separator', null)

        {/* Connection Test */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            createElement('Database', {className: 'h-4 w-4 text-muted-foreground'})
            createElement('h3', {className: 'font-semibold'}, 'Database Connection')
          </div>
          
          {connectionStatus === 'success' && (
            <Alert className="mb-3">
              createElement('CheckCircle', {className: 'h-4 w-4 text-green-500'})
              createElement('AlertDescription', null, 'Database connection successful! All systems operational.')
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert variant="destructive" className="mb-3">
              createElement('XCircle', {className: 'h-4 w-4'})
              <AlertDescription>
                <div>
                  createElement('p', {className: 'font-semibold mb-1'}, 'Connection Failed')
                  createElement('p', {className: 'text-xs'}, '{connectionError}')
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={testDatabaseConnection}
            disabled={isTestingConnection}
            variant="outline"
            className="w-full"
          >
            {isTestingConnection ? (
              <>
                createElement('RefreshCw', {className: 'mr-2 h-4 w-4 animate-spin'})
                Testing Connection...
              </>
            ) : (
              <>
                createElement('Database', {className: 'mr-2 h-4 w-4'})
                Test Database Connection
              </>
            )}
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          createElement('h4', {className: 'font-semibold text-sm'}, 'Quick Tips:')
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            createElement('li', null, 'If auth fails, check your Supabase anon key is correct')
            createElement('li', null, 'Ensure your Supabase project URL matches your project ID')
            createElement('li', null, 'Check browser console for detailed error messages')
            createElement('li', null, 'Verify email confirmation is disabled in Supabase Auth settings')
          </ul>
        </div>
      </CardContent>');
}
