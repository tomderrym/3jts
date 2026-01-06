/**
 * Preview Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React from 'https://esm.sh/react@18';
import { Loader2, Globe, Lock, RefreshCw, ExternalLink } from 'lucide-react';

interface PreviewProps {
  url?: string;
  srcDoc?: string;
  isLoading: boolean;
}

const Preview: React.FC<PreviewProps> = ({ url, srcDoc, isLoading }) => {
  return (
    <div className="relative flex flex-col h-full bg-[#09090b] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
        {/* Browser Chrome / Toolbar */}
        <div className="flex items-center px-4 py-3 bg-[#111114] border-b border-white/5 gap-4">
             {/* Window Controls */}
             <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
            </div>

            {/* Navigation Controls (Visual Only) */}
            <div className="flex gap-2 text-slate-600">
                <div className="w-5 h-5 rounded-md hover:bg-white/5 flex items-center justify-center transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </div>
                <div className="w-5 h-5 rounded-md hover:bg-white/5 flex items-center justify-center transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <div className="w-5 h-5 rounded-md hover:bg-white/5 flex items-center justify-center transition-colors">
                    <RefreshCw size={10} />
                </div>
            </div>

            {/* Address Bar */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5 text-[10px] text-slate-400 font-mono w-full max-w-xl group transition-all focus-within:border-indigo-500/30 focus-within:bg-black/60">
                   <Lock size={10} className="text-emerald-500/70" />
                   <span className="truncate flex-1 text-center select-all selection:bg-indigo-500/30">{url || 'http://localhost:3000'}</span>
                   {url && <ExternalLink size={10} className="text-slate-600 hover:text-white cursor-pointer" onClick={() => window.open(url, '_blank')} />}
                </div>
            </div>
            
            <div className="w-16"></div> {/* Spacer for balance */}
        </div>

        {/* Browser Content Area */}
        <div className="relative w-full h-full bg-white group isolate">
            {isLoading && (
            <div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe size={16} className="text-indigo-500" />
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Building Preview...</p>
            </div>
            )}
            
            {!url && !srcDoc && !isLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] text-slate-600 z-40">
                    <Globe size={48} className="mb-4 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-[2px]">Preview Offline</p>
                    <p className="text-[10px] text-slate-500 mt-2">Click "RUN" to start the development server</p>
                 </div>
            ) : (
                <iframe
                    src={url}
                    srcDoc={!url ? srcDoc : undefined}
                    title="output"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className="bg-white w-full h-full block"
                />
            )}
        </div>
    </div>
  );
};

export default Preview;
