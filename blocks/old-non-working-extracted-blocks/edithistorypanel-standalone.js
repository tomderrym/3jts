/**
 * EditHistoryPanel Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { History, User, FileText, Clock, X, Eye } from 'lucide-react';


interface EditHistoryPanelProps {
  appId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditHistoryPanel: React.FC<EditHistoryPanelProps> = ({
  appId,
  isOpen,
  onClose,
}) => {
  const [edits, setEdits] = useState<EditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && appId) {
      loadEditHistory();
    }
  }, [isOpen, appId]);

  const loadEditHistory = async () => {
    setLoading(true);
    try {
      const history = await collaborationService.getEditHistory(appId, 100);
      setEdits(history);
    } catch (e) {
      console.error('Failed to load edit history:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredEdits = selectedFile
    ? edits.filter(e => e.file_path === selectedFile)
    : edits;

  const uniqueFiles = Array.from(new Set(edits.map(e => e.file_path)));

  const getEditTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-emerald-400';
      case 'update': return 'text-blue-400';
      case 'delete': return 'text-red-400';
      case 'suggestion': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getEditTypeLabel = (type: string) => {
    switch (type) {
      case 'create': return 'Created';
      case 'update': return 'Updated';
      case 'delete': return 'Deleted';
      case 'suggestion': return 'Suggested';
      default: return type;
    }
  };

  if (!isOpen) return null;

  return createElement('div', {className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'}, '<div className="bg-[#111114] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              createElement('History', {className: 'text-indigo-400'})
            </div>
            <div>
              createElement('h2', {className: 'text-lg font-bold text-white'}, 'Edit History')
              createElement('p', {className: 'text-xs text-slate-400'}, 'Track all changes with attribution')
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            createElement('X', null)
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            createElement('FileText', {className: 'text-slate-500'})
            createElement('span', {className: 'text-xs font-semibold text-slate-400'}, 'Filter by file:')
            createElement('button', null, 'setSelectedFile(null)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                selectedFile === null
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              All Files')
            {uniqueFiles.slice(0, 5).map(file => (
              createElement('button', null, 'setSelectedFile(file)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors truncate max-w-[200px] ${
                  selectedFile === file
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
                title={file}
              >
                {file.split('/').pop() || file}')
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              createElement('div', {className: 'w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin'}, null)
          ) : filteredEdits.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              createElement('History', {className: 'mx-auto mb-4 opacity-50'})
              createElement('p', {className: 'text-sm'}, 'No edit history found')') : (
            <div className="space-y-3">
              {filteredEdits.map((edit) => (
                <div
                  key={edit.id}
                  className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        createElement('span', null, '{getEditTypeLabel(edit.edit_type)}')
                        createElement('span', {className: 'text-xs text-slate-500'}, '•')
                        createElement('span', {className: 'text-xs text-slate-400 truncate'}, '{edit.file_path}')
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <div className="flex items-center gap-1.5">
                          createElement('User', null)
                          createElement('span', {className: 'font-semibold text-slate-300'}, '{edit.user_email}')
                        </div>
                        <div className="flex items-center gap-1.5">
                          createElement('Clock', null)
                          createElement('span', null, '{new Date(edit.created_at || '').toLocaleString()}')
                        </div>
                      </div>

                      {edit.suggestion_note && (
                        <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-300">
                          createElement('strong', null, 'Note:') {edit.suggestion_note}
                        </div>
                      )}

                      {edit.edit_type === 'suggestion' && (
                        createElement('div', {className: 'mt-2 text-xs text-slate-500 italic'}, 'This is a suggested change awaiting approval')
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500">
            createElement('span', null, 'Showing {filteredEdits.length} edit{filteredEdits.length !== 1 ? 's' : ''}')
            createElement('button', {className: 'text-indigo-400 hover:text-indigo-300 transition-colors', onClick: loadEditHistory}, 'Refresh')
          </div>
        </div>
      </div>
    </div>
  );
};

