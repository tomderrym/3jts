/**
 * LandingPage Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Link } from 'react-router-dom';
import { Rocket, Code2, Zap, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage: React.FC = () => {
  return createElement('div', {className: 'min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'}, '{/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                createElement('Code2', {className: 'text-white'})
              </div>
              createElement('span', {className: 'text-xl font-bold'}, '3J Tech Solutions')
            </div>
            <div className="flex items-center gap-4">
              createElement('Link', {className: 'text-sm text-slate-300 hover:text-white transition-colors', to: '/login'}, 'Sign In')
              createElement('Link', {className: 'px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all', to: '/signup'}, 'Get Started')
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          createElement('h1', {className: 'text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent'}, 'Build Apps with AI')
          createElement('p', {className: 'text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto'}, 'Create, deploy, and manage applications powered by artificial intelligence. 
            From idea to production in minutes.')
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              Start Building
              createElement('ArrowRight', null)
            </Link>
            createElement('Link', {className: 'px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all border border-white/20', to: '/login'}, 'Sign In')
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          createElement('h2', {className: 'text-4xl font-bold mb-4'}, 'Everything You Need')
          createElement('p', {className: 'text-xl text-slate-400'}, 'Powerful features to build amazing applications')
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('Rocket', {className: 'text-indigo-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'AI-Powered Development')
            createElement('p', {className: 'text-slate-400'}, 'Describe your app and watch AI build it for you. No coding required.')
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('Zap', {className: 'text-violet-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'Instant Deployment')
            createElement('p', {className: 'text-slate-400'}, 'Deploy your apps to web, iOS, and Android with a single click.')
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('Shield', {className: 'text-emerald-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'Secure & Scalable')
            createElement('p', {className: 'text-slate-400'}, 'Enterprise-grade security and infrastructure that scales with you.')
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('Code2', {className: 'text-blue-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'Full Code Control')
            createElement('p', {className: 'text-slate-400'}, 'Access and edit your code anytime. Full transparency and control.')
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('Globe', {className: 'text-amber-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'Multi-Platform')
            createElement('p', {className: 'text-slate-400'}, 'Build once, deploy everywhere. Web, mobile, and desktop support.')
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              createElement('CheckCircle', {className: 'text-pink-400'})
            </div>
            createElement('h3', {className: 'text-xl font-bold mb-2'}, 'Collaboration')
            createElement('p', {className: 'text-slate-400'}, 'Work together with your team. Share, review, and iterate seamlessly.')
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-3xl p-12 border border-indigo-500/30 text-center">
          createElement('h2', {className: 'text-4xl font-bold mb-4'}, 'Ready to Build?')
          createElement('p', {className: 'text-xl text-slate-300 mb-8'}, 'Join thousands of developers building the next generation of apps')
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30"
          >
            Get Started Free
            createElement('ArrowRight', null)
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                createElement('Code2', {className: 'text-white'})
              </div>
              createElement('span', {className: 'text-sm text-slate-400'}, '© 2024 3J Tech Solutions. All rights reserved.')
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              createElement('a', {className: 'hover:text-white transition-colors', href: '#'}, 'Privacy')
              createElement('a', {className: 'hover:text-white transition-colors', href: '#'}, 'Terms')
              createElement('a', {className: 'hover:text-white transition-colors', href: '#'}, 'Support')
            </div>
          </div>
        </div>
      </footer>');
};

