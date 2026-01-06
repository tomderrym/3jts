import React, {  useState, useMemo  } from 'https://esm.sh/react@18';
import { X, Grid3x3, List, Play, Trash2, Edit2, FolderOpen, Cloud, CheckSquare, Square, FileCode, Folder } from 'lucide-react';


interface Project {
  id: string;
  name: string;
  files: Record<string, string>;
  createdAt: string;
  isCloud?: boolean;
  supabaseAppId?: string;
}

interface ProjectsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Record<string, Project>;
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onRunProject?: (projectId: string) => void;
}

/**
 * Generate preview HTML for a project
 */
function generatePreviewHtml(project: Project): string | null {
  try {
    const files = project.files;
    
    // Check for standalone HTML
    const htmlFiles = Object.keys(files).filter(f => /\.html?$/i.test(f));
    if (htmlFiles.length === 1) {
      const htmlContent = files[htmlFiles[0]];
      if (htmlContent && (htmlContent.includes('<script') || htmlContent.includes('<!DOCTYPE'))) {
        return htmlContent;
      }
    }
    
    // Check for React SPA
    const indexHtml = files['index.html'] || files['index.htm'];
    const indexTsx = files['index.tsx'] || files['index.jsx'] || files['src/index.tsx'] || files['src/index.jsx'];
    const appTsx = files['App.tsx'] || files['App.jsx'] || files['src/App.tsx'] || files['src/App.jsx'];
    const indexCss = files['index.css'] || files['App.css'] || '';
    
    if (indexHtml && indexTsx && appTsx) {
      const reactVersion = '^18.3.1';
      const reactDomVersion = '^18.3.1';
      
      let appCode = appTsx;
      appCode = appCode.replace(/export\s+default\s+function\s+App/g, 'function App');
      appCode = appCode.replace(/export\s+default\s+App/g, '// App exported');
      
      let indexCode = indexTsx;
      indexCode = indexCode.replace(/import\s+.*from\s+['"]\.\/App['"];?/g, '// App imported inline');
      indexCode = indexCode.replace(/import\s+.*from\s+['"]\.\/index\.css['"];?/g, '// CSS imported inline');
      indexCode = indexCode.replace(/import\s+.*from\s+['"]react['"];?/g, '// React imported via CDN');
      indexCode = indexCode.replace(/import\s+.*from\s+['"]react-dom\/client['"];?/g, '// ReactDOM imported via CDN');
      
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@${reactVersion}",
      "react-dom": "https://esm.sh/react-dom@${reactDomVersion}",
      "react-dom/client": "https://esm.sh/react-dom@${reactDomVersion}/client"
    }
  }
  </script>
  <style>
    ${indexCss}
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
    import { createRoot } from 'react-dom/client';
    ${appCode}
    ${indexCode}
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(React.createElement(App));
    }
  </script>
</body>
</html>`;
    }
  } catch (e) {
    console.error('Error generating preview:', e);
  }
  
  return null;
}

export default function ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onDeleteProject,
  viewMode,
  onViewModeChange,
  onRunProject,
}) => {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [fileTreePosition, setFileTreePosition] = useState<{ x: number; y: number } | null>(null);
  
  /**
   * Build file tree structure from file paths
   */
  const buildFileTree = (files: Record<string, string>): any => {
    const tree: any = {};
    
    Object.keys(files).forEach(filePath => {
      // Skip hidden files except .env
      if (filePath.startsWith('.') && !filePath.startsWith('.env')) return;
      
      const parts = filePath.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 
            ? { type: 'file', path: filePath }
            : { type: 'folder', children: {} };
        }
        if (current[part].children) {
          current = current[part].children;
        }
      });
    });
    
    return tree;
  };

  /**
   * Render file tree recursively
   */
  const renderFileTree = (tree: any, level = 0, maxDepth = 3, maxItems = 20): React.ReactNode[] => {
    const items: React.ReactNode[] = [];
    let itemCount = 0;
    
    const sortedEntries = Object.entries(tree).sort(([a], [b]) => {
      // Folders first, then files
      const aIsFolder = tree[a]?.type === 'folder';
      const bIsFolder = tree[b]?.type === 'folder';
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return a.localeCompare(b);
    });
    
    for (const [name, node] of sortedEntries) {
      if (itemCount >= maxItems) {
        items.push(
          <div key="more" className="text-[10px] text-slate-500 italic pl-4" style={{ paddingLeft: `${(level + 1) * 12}px` }}>
            ... and more
          </div>
        );
        break;
      }
      
      if (level >= maxDepth) continue;
      
      const isFolder = node.type === 'folder';
      const paddingLeft = level * 12;
      
      items.push(
        <div
          key={name}
          className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-300 transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {isFolder ? (
            <Folder size={10} className="text-blue-400" />
          ) : (
            <FileCode size={10} className="text-slate-500" />
          )}
          <span className="truncate" title={node.path || name}>
            {name}
          </span>
        </div>
      );
      
      itemCount++;
      
      if (isFolder && node.children) {
        const children = renderFileTree(node.children, level + 1, maxDepth, maxItems - itemCount);
        items.push(...children);
        itemCount += children.length;
        if (itemCount >= maxItems) break;
      }
    }
    
    return items;
  };
  
  const sortedProjects = useMemo(() => {
    return (Object.values(projects) as Project[])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [projects]);
  
  const toggleSelection = (projectId: string) => {
    setSelectedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };
  
  const selectAll = () => {
    setSelectedProjects(new Set(sortedProjects.map(p => p.id)));
  };
  
  const deselectAll = () => {
    setSelectedProjects(new Set());
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#16161a] border border-white/10 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Projects</h2>
            <p className="text-xs text-slate-400 mt-1">
              {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProjects.map(project => {
                const isActive = project.id === activeProjectId;
                const isSelected = selectedProjects.has(project.id);
                const previewHtml = generatePreviewHtml(project);
                
                return (
                  <div
                    key={project.id}
                    className={`relative group bg-white/5 border rounded-lg overflow-visible transition-all ${
                      isActive
                        ? 'border-indigo-500/50 ring-2 ring-indigo-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onMouseEnter={(e) => {
                      setHoveredProject(project.id);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setFileTreePosition({
                        x: rect.right + 10,
                        y: rect.top
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredProject(null);
                      setFileTreePosition(null);
                    }}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(project.id);
                        }}
                        className="p-1.5 bg-black/60 backdrop-blur-sm rounded hover:bg-black/80 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-indigo-400" />
                        ) : (
                          <Square size={16} className="text-white/60" />
                        )}
                      </button>
                    </div>
                    
                    {/* Preview */}
                    <div className="relative w-full h-48 bg-[#09090b] overflow-hidden">
                      {previewHtml ? (
                        <iframe
                          srcDoc={previewHtml}
                          className="w-full h-full border-0 scale-75 origin-top-left"
                          style={{ width: '133.33%', height: '133.33%' }}
                          sandbox="allow-scripts allow-same-origin"
                          title={`Preview of ${project.name}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <FolderOpen size={32} className="opacity-30" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      {hoveredProject === project.id && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2">
                          <button
                            onClick={() => onSelectProject(project.id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Play size={14} />
                            Open
                          </button>
                          {onRunProject && (
                            <button
                              onClick={() => onRunProject(project.id)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              Run
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Project Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-white truncate flex-1">
                          {project.name}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full ml-2 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {project.isCloud && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                            <Cloud size={10} />
                            Cloud
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-600">
                          • {Object.keys(project.files).length} file{Object.keys(project.files).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* File Tree Tooltip */}
                    {hoveredProject === project.id && fileTreePosition && (
                      <div
                        className="fixed z-50 bg-[#16161a] border border-white/10 rounded-lg shadow-2xl p-3 max-w-xs max-h-96 overflow-y-auto"
                        style={{
                          left: `${fileTreePosition.x}px`,
                          top: `${fileTreePosition.y}px`,
                          pointerEvents: 'none'
                        }}
                        onMouseEnter={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                          <FolderOpen size={12} className="text-indigo-400" />
                          <h4 className="text-xs font-semibold text-white">File Tree</h4>
                          <span className="text-[10px] text-slate-500 ml-auto">
                            {Object.keys(project.files).length} files
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {renderFileTree(buildFileTree(project.files))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedProjects.map(project => {
                const isActive = project.id === activeProjectId;
                const isSelected = selectedProjects.has(project.id);
                
                return (
                  <div
                    key={project.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-indigo-500/20 border-indigo-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => toggleSelection(project.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-indigo-400" />
                        ) : (
                          <Square size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {project.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                            Active
                          </span>
                        )}
                        {project.isCloud && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                            <Cloud size={10} />
                            Cloud
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProject(project.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Open Project"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {selectedProjects.size > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Select All
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={deselectAll}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Deselect All
              </button>
            </div>
            <span className="text-xs text-slate-400">
              {selectedProjects.size} selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

