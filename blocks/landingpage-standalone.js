/**
 * LandingPage Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { Link } from 'react-router-dom';
import { Rocket, Code2, Zap, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Code2 size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">3J Tech Solutions</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent">
            Build Apps with AI
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Create, deploy, and manage applications powered by artificial intelligence. 
            From idea to production in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              Start Building
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-slate-400">Powerful features to build amazing applications</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
              <Rocket size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Development</h3>
            <p className="text-slate-400">
              Describe your app and watch AI build it for you. No coding required.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center mb-4">
              <Zap size={24} className="text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Deployment</h3>
            <p className="text-slate-400">
              Deploy your apps to web, iOS, and Android with a single click.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Scalable</h3>
            <p className="text-slate-400">
              Enterprise-grade security and infrastructure that scales with you.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              <Code2 size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Full Code Control</h3>
            <p className="text-slate-400">
              Access and edit your code anytime. Full transparency and control.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-4">
              <Globe size={24} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Platform</h3>
            <p className="text-slate-400">
              Build once, deploy everywhere. Web, mobile, and desktop support.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={24} className="text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Collaboration</h3>
            <p className="text-slate-400">
              Work together with your team. Share, review, and iterate seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-3xl p-12 border border-indigo-500/30 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers building the next generation of apps
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Code2 size={14} className="text-white" />
              </div>
              <span className="text-sm text-slate-400">© 2024 3J Tech Solutions. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

