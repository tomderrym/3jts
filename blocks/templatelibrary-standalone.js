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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5 bg-[#0c0c0e]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white">Page Templates</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Reusable components and pages from converted code/images
            </p>
          </div>
          <span className="text-[10px] text-slate-600">{templates.length} saved</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Template List */}
        <div className="w-64 border-r border-white/5 overflow-y-auto">
          {templates.length === 0 ? (
            <div className="p-6 text-center">
              <FileCode2 size={32} className="mx-auto mb-3 text-slate-600 opacity-50" />
              <p className="text-xs text-slate-500 mb-1">No templates yet</p>
              <p className="text-[10px] text-slate-600">
                Convert code/images to create templates
              </p>
            </div>
          ) : (
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
                        <ImageIcon size={14} className="text-emerald-400 flex-shrink-0" />
                      ) : template.sourceType === 'code' ? (
                        <Code size={14} className="text-blue-400 flex-shrink-0" />
                      ) : (
                        <FileCode2 size={14} className="text-purple-400 flex-shrink-0" />
                      )}
                      <h3 className="text-xs font-semibold text-white truncate">
                        {template.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleDelete(template.id, e)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {template.description && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[9px] text-slate-600">
                    <span>{Object.keys(template.files).length} files</span>
                    <span>•</span>
                    <span>
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {template.thumbnail && (
                    <div className="mt-2 rounded overflow-hidden border border-white/5">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-20 object-cover"
                      />
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
                <h3 className="text-sm font-bold text-white">{selectedTemplate.name}</h3>
                <button
                  onClick={() => handleInsert(selectedTemplate)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} />
                  Insert into Project
                </button>
              </div>
              {selectedTemplate.description && (
                <p className="text-xs text-slate-400 mb-3">{selectedTemplate.description}</p>
              )}
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span>Type: {selectedTemplate.sourceType}</span>
                <span>•</span>
                <span>{Object.keys(selectedTemplate.files).length} files</span>
                <span>•</span>
                <span>Created: {new Date(selectedTemplate.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 mb-2">Files in Template:</h4>
                {Object.entries(selectedTemplate.files).map(([path, content]) => (
                  <div
                    key={path}
                    className="bg-[#0c0c0e] border border-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-xs text-indigo-400 font-mono">{path}</code>
                      <span className="text-[9px] text-slate-600">
                        {content.length} chars
                      </span>
                    </div>
                    <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto max-h-32 overflow-y-auto bg-black/40 p-2 rounded border border-white/5">
                      {content.substring(0, 500)}
                      {content.length > 500 && '...'}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!selectedTemplate && templates.length > 0 && (
          <div className="flex-1 flex items-center justify-center bg-[#08080a]">
            <div className="text-center">
              <Eye size={48} className="mx-auto mb-4 text-slate-600 opacity-30" />
              <p className="text-xs text-slate-500">Select a template to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

