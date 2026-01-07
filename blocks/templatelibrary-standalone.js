/**
 * TemplateLibrary Component
 * Props: { template?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { FileCode2, Image as ImageIcon, Trash2, Download, Plus, Code, Eye } from 'lucide-react';


interface TemplateLibraryProps {
  onInsertTemplate: (template: PageTemplate) => void;
}

export default function TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onInsertTemplate }) => {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(templateService.getAllTemplates());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this template?')) {
      templateService.deleteTemplate(id);
      loadTemplates();
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleInsert = (template: PageTemplate) => {
    onInsertTemplate(template);
    setSelectedTemplate(null);
  };

  return createElement('div', {className: 'h-full flex flex-col'}, '<div className="p-4 border-b border-white/5 bg-[#0c0c0e]">
        <div className="flex items-center justify-between mb-2">
          <div>
            createElement('h2', {className: 'text-sm font-bold text-white'}, 'Page Templates')
            createElement('p', {className: 'text-[10px] text-slate-500 mt-0.5'}, 'Reusable components and pages from converted code/images')
          </div>
          createElement('span', {className: 'text-[10px] text-slate-600'}, '{templates.length} saved')
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Template List */}
        <div className="w-64 border-r border-white/5 overflow-y-auto">
          {templates.length === 0 ? (
            <div className="p-6 text-center">
              createElement('FileCode2', {className: 'mx-auto mb-3 text-slate-600 opacity-50'})
              createElement('p', {className: 'text-xs text-slate-500 mb-1'}, 'No templates yet')
              createElement('p', {className: 'text-[10px] text-slate-600'}, 'Convert code/images to create templates')') : (
            <div className="p-2 space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-[#0c0c0e] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {template.sourceType === 'image' ? (
                        createElement('ImageIcon', {className: 'text-emerald-400 flex-shrink-0'})
                      ) : template.sourceType === 'code' ? (
                        createElement('Code', {className: 'text-blue-400 flex-shrink-0'})
                      ) : (
                        createElement('FileCode2', {className: 'text-purple-400 flex-shrink-0'})
                      )}
                      createElement('h3', {className: 'text-xs font-semibold text-white truncate'}, '{template.name}')
                    </div>
                    <button
                      onClick={(e) => handleDelete(template.id, e)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      createElement('Trash2', null)
                    </button>
                  </div>
                  {template.description && (
                    createElement('p', {className: 'text-[10px] text-slate-400 line-clamp-2 mb-2'}, '{template.description}')
                  )}
                  <div className="flex items-center gap-2 text-[9px] text-slate-600">
                    createElement('span', null, '{Object.keys(template.files).length} files')
                    createElement('span', null, '•')
                    createElement('span', null, '{new Date(template.createdAt).toLocaleDateString()}')
                  </div>
                  {template.thumbnail && (
                    <div className="mt-2 rounded overflow-hidden border border-white/5">
                      createElement('img', {className: 'w-full h-20 object-cover'})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <div className="flex-1 flex flex-col bg-[#08080a]">
            <div className="p-4 border-b border-white/5 bg-[#0c0c0e]">
              <div className="flex items-center justify-between mb-2">
                createElement('h3', {className: 'text-sm font-bold text-white'}, '{selectedTemplate.name}')
                <button
                  onClick={() => handleInsert(selectedTemplate)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  createElement('Plus', null)
                  Insert into Project
                </button>
              </div>
              {selectedTemplate.description && (
                createElement('p', {className: 'text-xs text-slate-400 mb-3'}, '{selectedTemplate.description}')
              )}
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                createElement('span', null, 'Type: {selectedTemplate.sourceType}')
                createElement('span', null, '•')
                createElement('span', null, '{Object.keys(selectedTemplate.files).length} files')
                createElement('span', null, '•')
                createElement('span', null, 'Created: {new Date(selectedTemplate.createdAt).toLocaleString()}')
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                createElement('h4', {className: 'text-xs font-bold text-slate-300 mb-2'}, 'Files in Template:')
                {Object.entries(selectedTemplate.files).map(([path, content]) => (
                  <div
                    key={path}
                    className="bg-[#0c0c0e] border border-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      createElement('code', {className: 'text-xs text-indigo-400 font-mono'}, '{path}')
                      createElement('span', {className: 'text-[9px] text-slate-600'}, '{content.length} chars')
                    </div>
                    createElement('pre', {className: 'text-[10px] text-slate-400 font-mono overflow-x-auto max-h-32 overflow-y-auto bg-black/40 p-2 rounded border border-white/5'}, '{content.substring(0, 500)}
                      {content.length > 500 && '...'}')
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!selectedTemplate && templates.length > 0 && (
          <div className="flex-1 flex items-center justify-center bg-[#08080a]">
            <div className="text-center">
              createElement('Eye', {className: 'mx-auto mb-4 text-slate-600 opacity-30'})
              createElement('p', {className: 'text-xs text-slate-500'}, 'Select a template to preview')
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

