/**
 * SignupPage Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, UserPlus, Code2, ArrowLeft } from 'lucide-react';


export default function SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return createElement('div', {className: 'min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4'}, '<div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 text-white hover:text-indigo-400 transition-colors">
          createElement('ArrowLeft', null)
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
            createElement('Code2', {className: 'text-white'})
          </div>
          createElement('span', {className: 'text-xl font-bold'}, '3J Tech Solutions')
        </Link>

        {/* Signup Card */}
        <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              createElement('UserPlus', {className: 'text-white'})
            </div>
            createElement('h2', {className: 'text-2xl font-bold text-white tracking-tight'}, 'Create Account')
            createElement('p', {className: 'text-slate-400 mt-2'}, 'Sign up to get started')
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              createElement('div', {className: 'bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm'}, '{error}')
            )}

            <div>
              createElement('label', {className: 'block text-sm font-medium text-slate-300 mb-2'}, 'Name')
              <div className="relative">
                createElement('User', {className: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'})
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#18181b] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              createElement('label', {className: 'block text-sm font-medium text-slate-300 mb-2'}, 'Email')
              <div className="relative">
                createElement('Mail', {className: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'})
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#18181b] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              createElement('label', {className: 'block text-sm font-medium text-slate-300 mb-2'}, 'Password')
              <div className="relative">
                createElement('Lock', {className: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'})
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#18181b] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? createElement('Loader2', {className: 'animate-spin'}) : createElement('UserPlus', null)}
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              createElement('Link', {className: 'text-indigo-400 hover:text-indigo-300 font-medium', to: '/login'}, 'Sign in')
            </p>
          </div>
        </div>
      </div>');
};

