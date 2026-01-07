/**
 * FileTree Component
 * Props: { name?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { FileCode, Trash2, Plus, Upload, FolderArchive, FolderInput, Wand2, Download, Link2, Unlink } from 'lucide-react';

interface FileTreeProps {
  files: string[];
  activeFile: string;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
  onAdd: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExtractZip: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport?: () => void;
  onLinkFolder?: () => void;
  onUnlinkFolder?: () => void;
  isLinkedMode?: boolean;
  linkedFolderName?: string | null;
  onOpenConverter?: () => void;
  style?: React.CSSProperties; // Add style prop
}

export default function FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFile,
  onSelect,
  onDelete,
  onAdd,
  onImport,
  onExtractZip,
  onExport,
  onLinkFolder,
  onUnlinkFolder,
  isLinkedMode = false,
  linkedFolderName,
  onOpenConverter,
  style // Accept style prop
}) => {
  // Filter out hidden files (start with .) but allow .env files
  const visibleFiles = files.filter(f => {
    // Allow .env files and .env.* files
    if (f.startsWith('.env')) return true;
    // Hide other files starting with .
    return !f.startsWith('.');
  }).sort();

  return createElement('div', {className: 'bg-[#0d0d0f] border-r border-white/5 flex flex-col h-full shrink-0', style: {style}}, '{/* Apply style here */}
      <div className="p-4 border-b border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          createElement('h3', {className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest'}, 'Explorer')
          {isLinkedMode && linkedFolderName && (
            createElement('span', {className: 'text-[9px] text-emerald-400 font-medium truncate max-w-[120px]'}, '🔗 {linkedFolderName}')
          )}
        </div>
        <div className="flex gap-2">
          {/* Converter */}
          {onOpenConverter && (
            <button 
                onClick={onOpenConverter}
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors group"
                title="Convert HTML/Raw Code to React"
            >
                createElement('Wand2', {className: 'text-purple-400 group-hover:text-purple-300'})
            </button>
          )}

          {/* Extract ZIP */}
          <label className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors" title="Extract ZIP Archive">
            createElement('FolderArchive', {className: 'text-amber-400'})
            createElement('input', {className: 'hidden', type: 'file', accept: '.zip', onChange: onExtractZip})
          </label>
          
          {/* Import Folder */}
          <label className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors" title="Import Folder">
            createElement('FolderInput', {className: 'text-indigo-400'})
            {/* @ts-ignore: React/TS doesn't fully type webkitdirectory yet */}
            createElement('input', {className: 'hidden', type: 'file', onChange: onImport})
          </label>

          {/* Import Files */}
          <label className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors" title="Import Files">
            createElement('Upload', {className: 'text-slate-400'})
            createElement('input', {className: 'hidden', type: 'file', onChange: onImport})
          </label>
          
          {/* Link/Unlink Folder (Live Mode) */}
          {isLinkedMode && onUnlinkFolder ? (
            <button 
              onClick={onUnlinkFolder}
              className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors group"
              title="Unlink Folder (stop live editing)"
            >
              createElement('Unlink', {className: 'text-red-400 group-hover:text-red-300'})
            </button>
          ) : onLinkFolder ? (
            <button 
              onClick={onLinkFolder}
              className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors group"
              title="Link Folder (live editing - changes save to original files)"
            >
              createElement('Link2', {className: 'text-blue-400 group-hover:text-blue-300'})
            </button>
          ) : null}
          
          {/* Export ZIP */}
          {onExport && (
            <button 
              onClick={onExport}
              className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors group"
              title="Export All Files as ZIP"
            >
              createElement('Download', {className: 'text-emerald-400 group-hover:text-emerald-300'})
            </button>
          )}
          
          {/* New File */}
          <button 
            onClick={onAdd}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="New File"
          >
            createElement('Plus', {className: 'text-slate-400'})
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {visibleFiles.map((file) => (
          <div
            key={file}
            className={`group flex items-center justify-between px-4 py-1.5 cursor-pointer text-xs font-medium transition-colors ${
              activeFile === file ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 border-l-2 border-transparent'
            }`}
            onClick={() => onSelect(file)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              createElement('FileCode', null)
              createElement('span', {className: 'truncate'}, '{file}')
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file);
              }}
              className="p-1 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Delete File"
            >
              createElement('Trash2', null)
            </button>'))}
      </div>
    </div>
  );
};
