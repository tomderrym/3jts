/**
 * AuthScreen Component
 * Props: { onAuthSuccess?: any, email?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';

const AuthScreen = ({
  onAuthSuccess,
  onLogin,
  onRegister
}: {
  onAuthSuccess: (role: 'customer' | 'mechanic' | 'admin', email: string) => void;
  onLogin: (email: string, password: string) => Promise<'customer' | 'mechanic' | 'admin' | null>;
  onRegister: (email: string, password: string, role: 'customer' | 'mechanic') => Promise<'customer' | 'mechanic' | null>;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    const role = await onLogin(email, password);
    setIsLoading(false);
    if (role) {
      onAuthSuccess(role, email);
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (role: 'customer' | 'mechanic') => {
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    const registeredRole = await onRegister(email, password, role);
    setIsLoading(false);
    if (registeredRole) {
      onAuthSuccess(registeredRole, email);
    } else {
      alert('Registration failed. User may already exist or invalid credentials.');
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 text-white">
      <HeaderBar title="FilOzAutoCare" />

      <div className="flex flex-col flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <Card>
            <div className="flex flex-col items-center w-full space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
                <p className="text-sm text-slate-300 max-w-xs mx-auto">
                  Sign in or create an account to connect with trusted mechanics nearby.
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  />
                </div>
              </div>

              <PrimaryButton onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Signing in…' : 'Sign in'}
              </PrimaryButton>

              <div className="w-full space-y-2">
                <p className="text-xs text-slate-400 text-center uppercase tracking-wide">
                  Or create a new account
                </p>
                <div className="flex w-full space-x-2">
                  <PrimaryButton
                    onClick={() => handleRegister('customer')}
                    disabled={isLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 focus-visible:ring-emerald-500"
                  >
                    Register as Customer
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() => handleRegister('mechanic')}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 focus-visible:ring-blue-500"
                  >
                    Register as Mechanic
                  </PrimaryButton>
                </div>
              </div>

              <button
                type="button"
                onClick={() => console.log('Forgot Password clicked')}
                className="text-xs text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline h-[50px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Forgot your password?
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
