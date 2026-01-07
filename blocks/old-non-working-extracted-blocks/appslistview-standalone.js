/**
 * AppsListView Component
 * Props: { appId?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Code2, Cloud, Clock, ArrowRight } from 'lucide-react';


interface AppsListViewProps {
  apps: Project[];
  onAppClick: (appId: string) => void;
}

export default function AppsListView: React.FC<AppsListViewProps> = ({ apps, onAppClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return createElement('div', {className: 'space-y-2'}, '{apps.map((app) => (
        <div
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="flex items-center justify-between p-4 bg-[#0a0a0c] border border-white/5 rounded-lg hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
              createElement('Code2', {className: 'text-white'})
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                createElement('h3', {className: 'text-base font-bold group-hover:text-indigo-400 transition-colors'}, '{app.name}')
                {app.isCloud && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    createElement('Cloud', null)
                    createElement('span', null, 'Cloud')')}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                createElement('Clock', null)
                createElement('span', null, 'Created {formatDate(app.createdAt)}')
              </div>
            </div>
          </div>
          createElement('ArrowRight', {className: 'text-slate-400 group-hover:text-indigo-400 transition-colors'})
        </div>
      ))}
    </div>
  );
};

