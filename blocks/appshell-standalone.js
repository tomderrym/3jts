import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell
 *
 * Centralized mobile-first layout shell that:
 * - Uses dynamic viewport height via CSS var --vh (set in App.tsx)
 * - Applies safe-area padding top/bottom
 * - Provides a unified background and text color
 * - Ensures scrollable main content
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return createElement('div', {className: 'min-h-0 w-full bg-slate-950 text-white', style: {{
        height: 'calc(var(--vh, 1vh) * 100)'
      }}, '<div
        className="flex flex-col h-full"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        createElement('main', {className: 'flex-1 overflow-y-auto'}, '{children}')
      </div>');
};

export default AppShell;
