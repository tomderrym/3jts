/**
 * Login Screen
 * Allows users to sign in with email and password
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Car, HelpCircle } from 'lucide-react';

export default function LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, userType } = useAuth();
  const { isDebugMode } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Auto-fill in debug mode
  useEffect(() => {
    if (isDebugMode) {
      setEmail('test@filozofautocare.com');
      setPassword('testpassword123');
      console.log('🐛 DEBUG: Auto-filled login form with test@filozofautocare.com');
      console.log('💡 NOTE: If you get "Invalid credentials" error, this test user may not exist yet.');
      console.log('   → Solution: Click "Sign up" to create the account first!');
    }
  }, [isDebugMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        const errorMessage = signInError.message || '';
        
        if (errorMessage.includes('Invalid login credentials')) {
          if (isDebugMode) {
            setError('⚠️ Test account doesn\'t exist yet. Please click "Sign up" first to create it!');
          } else {
            setError('❌ Invalid email or password. Don\'t have an account? Click "Sign up" below.');
          }
        } else if (errorMessage.includes('Email not confirmed')) {
          setError('⚠️ Email confirmation is enabled. Please check the setup guide to disable it for development.');
        } else {
          setError(`❌ Sign in failed: ${errorMessage}`);
        }
        setIsLoading(false);
        return;
      }

      // Navigate to appropriate dashboard based on user type
      const defaultRoute = getDefaultRouteForUserType(userType);
      navigate(defaultRoute);
    } catch (err) {
      console.error('❌ Login exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return createElement('div', {className: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4'}, '<Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              createElement('Car', {className: 'h-8 w-8 text-primary-foreground'})
            </div>
          </div>
          createElement('CardTitle', {className: 'text-2xl'}, 'Welcome Back')
          createElement('CardDescription', null, 'Sign in to your FiloZof AutoCare account')
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                createElement('AlertCircle', {className: 'h-4 w-4'})
                createElement('AlertDescription', null, '{error}')
              </Alert>
            )}

            {isDebugMode && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-xs text-yellow-800">
                  createElement('strong', null, '🐛 Debug Mode:') Form auto-filled with test account.
                  If you get "Invalid credentials", the test user doesn't exist yet - please sign up first!
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              createElement('Label', {htmlFor: 'email'}, 'Email')
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                createElement('Label', {htmlFor: 'password'}, 'Password')
                createElement('Button', {className: 'p-0 h-auto text-xs', type: 'button', variant: 'link'}, 'navigate('/forgot-password')}
                >
                  Forgot password?')
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="h-12"
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-xs text-blue-800">
                createElement('strong', null, 'First time?') Please sign up first. If you get "Invalid credentials" error after signing up, 
                check createElement('code', {className: 'bg-blue-100 px-1 rounded'}, 'AUTH_SETUP.md') to disable email confirmation.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  createElement('Loader2', {className: 'mr-2 h-4 w-4 animate-spin'})
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center text-sm">
              createElement('span', {className: 'text-muted-foreground'}, 'Don't have an account?')
              createElement('Button', {className: 'p-0 h-auto', type: 'button', variant: 'link'}, 'navigate('/signup')}
              >
                Sign up')
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSetupGuide(true)}
                className="w-full"
              >
                createElement('HelpCircle', {className: 'mr-2 h-4 w-4'})
                First-Time Setup Guide
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Setup Guide Dialog */}
      <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            createElement('DialogTitle', null, 'First-Time Setup Guide')
            createElement('DialogDescription', null, 'Complete these steps to set up authentication and database tables in Supabase.')
          </DialogHeader>
          createElement('SetupGuide', null)
        </DialogContent>
      </Dialog>');
};
