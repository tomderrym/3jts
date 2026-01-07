/**
 * CodeEditor Component
 * Props: { value?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

interface CodeEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function CodeEditor: React.FC<CodeEditorProps> = ({ content, onChange }) => {
  // Safeguard: Ensure content is always a string. Handles null, undefined, or unexpected types.
  const safeContent = typeof content === 'string' ? content : String(content || '');

  return createElement('div', {className: 'flex-1 relative flex flex-col bg-[#08080a]'}, '{/* Line Numbers */}
      <div className="absolute top-0 left-0 w-12 h-full bg-[#0d0d0f] border-r border-white/5 flex flex-col items-center pt-6 pointer-events-none z-10">
        {Array.from({ length: Math.max(20, safeContent.split('\n').length) }).map((_, i) => (
          createElement('div', {className: 'text-[10px] font-mono text-slate-700 h-6 flex items-center'}, '{i + 1}')
        ))}
      </div>
      
      <textarea
        value={safeContent}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full h-full bg-transparent text-slate-300 pl-16 pr-6 pt-6 font-mono text-sm resize-none focus:outline-none leading-6"
        placeholder="// Select a file or start writing code here..."
      />
      
      {/* Subtle selection/cursor glow simulation */}
      <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
        createElement('div', {className: 'text-[10px] font-mono text-indigo-400 uppercase tracking-widest'}, 'UTF-8 · TypeScript JSX')
      </div>');
};
