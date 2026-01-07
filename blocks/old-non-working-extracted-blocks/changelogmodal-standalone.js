/**
 * ChangeLogModal Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

import React, {  useState  } from 'https://esm.sh/react@18';
import { X, History, Calendar, Code2, Info, Plus, Save, Loader2, RotateCcw } from 'lucide-react';

interface ChangeLogModalProps {
  entries: ChangeLogEntry[];
  onClose: () => void;
  onUpdate?: () => void;
  onRestore?: (files: Record<string, string>) => void;
}

export default function ChangeLogModal: React.FC<ChangeLogModalProps> = ({ entries, onClose, onUpdate, onRestore }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    snippet: '',
    remarks: ''
  });

  const handleSave = async () => {
    if (!newEntry.title || !newEntry.description) return;
    
    setIsSaving(true);
    try {
      await changeLogService.addEntry({
        date: new Date().toISOString(),
        title: newEntry.title,
        description: newEntry.description,
        snippet: newEntry.snippet,
        remarks: newEntry.remarks
      });
      setIsAdding(false);
      setNewEntry({ title: '', description: '', snippet: '', remarks: '' });
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
      alert('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreClick = (files: Record<string, string> | undefined) => {
      if (files && onRestore) {
          if (confirm('Are you sure you want to restore this checkpoint? This will overwrite your current workspace.')) {
              onRestore(files);
              onClose();
          }
      }
  };

  return createElement('div', {className: 'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'}, '<div className="bg-[#111114] border border-white/10 w-full max-w-3xl max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden scale-in-center">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              createElement('History', {className: 'text-indigo-400'})
            </div>
            <div>
              createElement('h2', {className: 'text-lg font-bold text-white tracking-tight'}, 'Deployment History')
              createElement('p', {className: 'text-[10px] text-slate-500 uppercase tracking-widest font-black'}, 'AI App Builder Playground v2.4')
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)} 
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                createElement('Plus', null) ADD ENTRY
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
              createElement('X', null)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Add Entry Form */}
          {isAdding && (
            <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-4 animate-in slide-in-from-top-4 mb-8">
               createElement('h3', {className: 'text-sm font-bold text-white mb-4'}, 'New Log Entry')
               <div className="space-y-3">
                 <input 
                    placeholder="Title" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 outline-none"
                    value={newEntry.title}
                    onChange={e => setNewEntry(p => ({...p, title: e.target.value}))}
                 />
                 <textarea 
                    placeholder="Description" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500/50 outline-none h-20 resize-none"
                    value={newEntry.description}
                    onChange={e => setNewEntry(p => ({...p, description: e.target.value}))}
                 />
                 <textarea 
                    placeholder="Code Snippet (Optional)" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:border-indigo-500/50 outline-none h-16 resize-none"
                    value={newEntry.snippet}
                    onChange={e => setNewEntry(p => ({...p, snippet: e.target.value}))}
                 />
                 <input 
                    placeholder="Remarks (Optional)" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 focus:border-indigo-500/50 outline-none"
                    value={newEntry.remarks}
                    onChange={e => setNewEntry(p => ({...p, remarks: e.target.value}))}
                 />
                 <div className="flex justify-end gap-2 pt-2">
                    createElement('button', null, 'setIsAdding(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel')
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                    >
                      {isSaving ? createElement('Loader2', {className: 'animate-spin'}) : createElement('Save', null)}
                      SAVE
                    </button>
                 </div>
               </div>')}

          {/* List */}
          {entries.length === 0 ? (
            <div className="py-20 text-center opacity-30">
              createElement('History', {className: 'mx-auto mb-4'})
              createElement('p', {className: 'text-sm font-bold uppercase tracking-widest'}, 'No entries found')
            </div>
          ) : (
            entries.map((entry, idx) => (
              <div key={idx} className="relative pl-8 border-l border-white/5 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                createElement('div', {className: 'absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'})
                
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">
                            createElement('Calendar', null) {new Date(entry.date).toLocaleDateString()}
                        </span>
                        createElement('h3', {className: 'text-md font-bold text-white'}, '{entry.title}')
                    </div>
                    {entry.checkpoint && onRestore && (
                        <button 
                            onClick={() => handleRestoreClick(entry.checkpoint)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-all"
                            title="Restore Project to this State"
                        >
                            createElement('RotateCcw', null) RESTORE CHECKPOINT
                        </button>
                    )}
                </div>

                createElement('div', {className: 'text-sm text-slate-400 leading-relaxed mb-4'}, '{entry.description}')

                {entry.snippet && (
                  <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden mb-4">
                    <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                        createElement('Code2', null) Implementation Detail
                      </div>
                    </div>
                    createElement('pre', {className: 'p-4 overflow-x-auto font-mono text-[11px] text-indigo-200/70 leading-relaxed'}, '{entry.snippet}')
                  </div>
                )}

                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  createElement('Info', {className: 'text-slate-500'})
                  createElement('span', {className: 'text-[10px] font-mono text-slate-500'}, '{entry.remarks}')
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 bg-black/20 border-t border-white/5 text-center shrink-0">
          createElement('p', {className: 'text-[10px] text-slate-600 font-bold uppercase tracking-[4px]'}, 'Verified Deployment Chain')
        </div>
      </div>
    </div>
  );
};
