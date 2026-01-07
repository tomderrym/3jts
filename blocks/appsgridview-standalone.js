/**
 * AppsGridView Component
 * Props: { appId?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Code2, Cloud, Clock, MoreVertical } from 'lucide-react';


interface AppsGridViewProps {
  apps: Project[];
  onAppClick: (appId: string) => void;
}

export default function AppsGridView: React.FC<AppsGridViewProps> = ({ apps, onAppClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return createElement('div', {className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}, '{apps.map((app) => (
        <div
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="bg-[#0a0a0c] border border-white/5 rounded-xl p-6 hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              createElement('Code2', {className: 'text-white'})
            </div>
            {app.isCloud && (
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                createElement('Cloud', null)
                createElement('span', null, 'Cloud')')}
          </div>
          createElement('h3', {className: 'text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors'}, '{app.name}')
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
            createElement('Clock', null)
            createElement('span', null, '{formatDate(app.createdAt)}')
          </div>
        </div>
      ))}
    </div>
  );
};

