/**
 * Diagnostics Panel
 * Displays system configuration and connection status
 * Only visible in debug mode
 */

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
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <CardTitle>System Diagnostics</CardTitle>
        </div>
        <CardDescription>
          Configuration and connection status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Environment</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant={config.environment === 'Development' ? 'default' : 'secondary'}>
                {config.environment}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Supabase Configuration */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Supabase Configuration</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">URL:</span>
              <span className="font-mono text-xs break-all text-right">{config.supabaseUrl}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Anon Key:</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.hasAnonKey ? 'success' : 'error'} />
                <span className="font-mono text-xs">{config.hasAnonKey ? config.anonKeyPreview : 'Missing'}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Authentication Status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Authentication</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-2">
                <StatusIcon 
                  status={
                    authStatus === 'authenticated' ? 'success' : 
                    authStatus === 'checking' ? 'idle' : 
                    'warning'
                  } 
                />
                <Badge variant={authStatus === 'authenticated' ? 'default' : 'secondary'}>
                  {authStatus === 'checking' ? 'Checking...' : 
                   authStatus === 'authenticated' ? 'Authenticated' : 
                   'Not Authenticated'}
                </Badge>
              </div>
            </div>
            {currentUser && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{currentUser.id.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-xs">{currentUser.email}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Connection Test */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Database Connection</h3>
          </div>
          
          {connectionStatus === 'success' && (
            <Alert className="mb-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Database connection successful! All systems operational.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert variant="destructive" className="mb-3">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <p className="font-semibold mb-1">Connection Failed</p>
                  <p className="text-xs">{connectionError}</p>
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
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Test Database Connection
              </>
            )}
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Quick Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>If auth fails, check your Supabase anon key is correct</li>
            <li>Ensure your Supabase project URL matches your project ID</li>
            <li>Check browser console for detailed error messages</li>
            <li>Verify email confirmation is disabled in Supabase Auth settings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
