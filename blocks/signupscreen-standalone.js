/**
 * Signup Screen
 * Allows new users to create an account with user type selection
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Car, Wrench, Store, Zap, HelpCircle } from 'lucide-react';

const userTypes: { value: UserType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'car_owner',
    label: 'Car Owner',
    description: 'Book services and find mechanics',
    icon: createElement('Car', {className: 'h-5 w-5'}),
  },
  {
    value: 'mechanic',
    label: 'Mechanic',
    description: 'Offer mobile mechanic services',
    icon: createElement('Wrench', {className: 'h-5 w-5'}),
  },
  {
    value: 'dealer',
    label: 'Dealer',
    description: 'Sell car parts and accessories',
    icon: createElement('Store', {className: 'h-5 w-5'}),
  },
  {
    value: 'electrician',
    label: 'Auto Electrician',
    description: 'Provide electrical repair services',
    icon: createElement('Zap', {className: 'h-5 w-5'}),
  },
];

export default function SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { isDebugMode } = useAppStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('car_owner');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Auto-fill in debug mode
  useEffect(() => {
    if (isDebugMode) {
      setFullName('Test User');
      setEmail('testuser@filozofautocare.com');
      setPhone('+1234567890');
      setPassword('testpassword123');
      setConfirmPassword('testpassword123');
      setUserType('car_owner');
      console.log('🐛 DEBUG: Auto-filled signup form');
    }
  }, [isDebugMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, {
        user_type: userType,
        full_name: fullName,
        phone: phone || undefined,
      });

      if (signUpError) {
        // Check for specific error types
        const errorMessage = signUpError.message || '';
        
        if (errorMessage.includes('email confirmation') || errorMessage.includes('confirm your email')) {
          setError('⚠️ EMAIL CONFIRMATION REQUIRED: Please check the Supabase Dashboard and disable email confirmation. See AUTH_SETUP.md for instructions.');
        } else if (errorMessage.includes('Database error') || errorMessage.includes('saving new user')) {
          setError('⚠️ SETUP REQUIRED: Email confirmation is enabled in Supabase. Please disable it in Authentication > Providers > Email settings. See AUTH_SETUP.md for detailed instructions.');
        } else if (errorMessage.includes('already registered') || errorMessage.toLowerCase().includes('user already registered')) {
          console.error('❌ Supabase signup error:', signUpError);
          setError('This email is already registered. Please use the "Sign in" link below or try a different email.');
        } else {
          console.error('❌ Supabase signup error:', signUpError);
          setError(`Sign up failed: ${errorMessage}`);
        }
        setIsLoading(false);
        return;
      }

      // Navigate to login with success message
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      console.error('Signup exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return createElement('div', {className: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4'}, '<Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              createElement('Car', {className: 'h-8 w-8 text-primary-foreground'})
            </div>
          </div>
          createElement('CardTitle', {className: 'text-2xl'}, 'Create Account')
          createElement('CardDescription', null, 'Join FiloZof AutoCare today')
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                createElement('AlertCircle', {className: 'h-4 w-4'})
                createElement('AlertDescription', null, '{error}')
              </Alert>
            )}

            {/* User Type Selection */}
            <div className="space-y-3">
              createElement('Label', null, 'I am a:')
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userTypes.map((type) => (
                    <div key={type.value}>
                      createElement('RadioGroupItem', {className: 'peer sr-only'})
                      <Label
                        htmlFor={type.value}
                        className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {type.icon}
                          createElement('span', {className: 'font-medium'}, '{type.label}')
                        </div>
                        createElement('span', {className: 'text-xs text-muted-foreground'}, '{type.description}')
                      </Label>'))}
                </div>
              </RadioGroup>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                createElement('Label', {htmlFor: 'fullName'}, 'Full Name *')
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  createElement('Label', {htmlFor: 'email'}, 'Email *')
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  createElement('Label', {htmlFor: 'phone'}, 'Phone (Optional)')
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    autoComplete="tel"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  createElement('Label', {htmlFor: 'password'}, 'Password *')
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  createElement('Label', {htmlFor: 'confirmPassword'}, 'Confirm Password *')
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-xs text-blue-800">
                  createElement('strong', null, '⚠️ First-time setup required:') Click the button below to complete Supabase setup before signing up.
                </AlertDescription>
              </Alert>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowSetupGuide(true)}
              >
                createElement('HelpCircle', {className: 'h-4 w-4 mr-2'})
                View Setup Instructions
              </Button>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  createElement('Loader2', {className: 'mr-2 h-4 w-4 animate-spin'})
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-sm">
              createElement('span', {className: 'text-muted-foreground'}, 'Already have an account?')
              createElement('Button', {className: 'p-0 h-auto', type: 'button', variant: 'link'}, 'navigate('/login')}
              >
                Sign in')
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
      </Dialog>
    </div>
  );
};