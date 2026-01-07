/**
 * FileSearch Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
# File Tools Implementation Guide

## Quick Start: Essential Tools to Add

This guide shows how to integrate the File Tools API into your existing system.

---

## 1. Frontend File Search (Immediate Win)

Add file search to your existing `App.tsx`:

```typescript
// Add to App.tsx state
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState<Array<{
  file: string;
  matches: Array<{ line: number; content: string }>;
}>>([]);

// Add search function
const handleSearch = (query: string) => {
  if (!query.trim()) {
    setSearchResults([]);
    return;
  }

  const results: Array<{
    file: string;
    matches: Array<{ line: number; content: string }>;
  }> = [];

  Object.entries(files).forEach(([filePath, content]) => {
    const lines = content.split('\n');
    const matches: Array<{ line: number; content: string }> = [];

    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        matches.push({
          line: index + 1,
          content: line.trim()
        });
      }
    });

    if (matches.length > 0) {
      results.push({ file: filePath, matches });
    }
  });

  setSearchResults(results);
};

// Add to FileTree component props
// Add search input in FileTree UI
```

---

## 2. File Tools API Hook

Create `hooks/useFileToolsAPI.ts`:

```typescript
import { useState } from 'react';


interface FileOperationResult {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
}

export function useFileToolsAPI(accessToken: string | null) {
  const [loading, setLoading] = useState(false);
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-291c16de`;

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
  };

  const writeFile = async (
    filePath: string,
    content: string
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/write`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath, content })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to write file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const readFile = async (
    filePath: string,
    start?: number,
    end?: number
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/read-range`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath, start, end })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to read file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const editFile = async (
    filePath: string,
    oldString: string,
    newString: string
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/code/edit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath, oldString, newString })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to edit file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (
    filePath: string
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async (
    directoryPath: string,
    contentPattern: string,
    namePattern?: string,
    caseSensitive: boolean = false,
    maxResults: number = 50,
    contextLines: number = 2
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          directoryPath,
          contentPattern,
          namePattern,
          caseSensitive,
          maxResults,
          contextLines
        })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to search files',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const listDirectory = async (
    directoryPath: string
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/list-directory`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ directoryPath })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to list directory',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  const fastApply = async (
    filePath: string,
    changeStr: string
  ): Promise<FileOperationResult> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/files/fast-apply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath, changeStr })
      });
      const result = await res.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to apply changes',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    writeFile,
    readFile,
    editFile,
    deleteFile,
    searchFiles,
    listDirectory,
    fastApply
  };
}
```

---

## 3. Enhanced File Operations in App.tsx

Add these helper functions to `App.tsx`:

```typescript
// Add file rename
const handleRenameFile = (oldPath: string, newPath: string) => {
  if (files[newPath]) {
    alert('File with that name already exists');
    return;
  }
  const newFiles = { ...files };
  newFiles[newPath] = files[oldPath];
  delete newFiles[oldPath];
  updateFiles(newFiles);
  if (activeFile === oldPath) {
    setActiveFile(newPath);
  }
};

// Add file duplicate
const handleDuplicateFile = (filePath: string) => {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const nameParts = fileName.split('.');
  const ext = nameParts.length > 1 ? '.' + nameParts.pop() : '';
  const baseName = nameParts.join('.');
  let newPath = filePath.replace(fileName, `${baseName}-copy${ext}`);
  let counter = 1;
  while (files[newPath]) {
    newPath = filePath.replace(fileName, `${baseName}-copy-${counter}${ext}`);
    counter++;
  }
  updateFiles({ ...files, [newPath]: files[filePath] });
};

// Add file copy (to different directory)
const handleCopyFile = (sourcePath: string, destPath: string) => {
  if (files[destPath]) {
    alert('File already exists at destination');
    return;
  }
  updateFiles({ ...files, [destPath]: files[sourcePath] });
};

// Add file move (rename + delete old)
const handleMoveFile = (sourcePath: string, destPath: string) => {
  if (files[destPath]) {
    alert('File already exists at destination');
    return;
  }
  const newFiles = { ...files };
  newFiles[destPath] = files[sourcePath];
  delete newFiles[sourcePath];
  updateFiles(newFiles);
  if (activeFile === sourcePath) {
    setActiveFile(destPath);
  }
};
```

---

## 4. File Search Component

Create `components/FileSearch.tsx`:

```typescript
import React, {  useState, useMemo  } from 'https://esm.sh/react@18';
import { Search, X, FileCode } from 'lucide-react';

interface FileSearchProps {
  files: Record<string, string>;
  onSelectFile: (filePath: string, lineNumber?: number) => void;
  onClose: () => void;
}

export default function FileSearch: React.FC<FileSearchProps> = ({
  files,
  onSelectFile,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const matches: Array<{
      file: string;
      line: number;
      content: string;
    }> = [];

    Object.entries(files).forEach(([filePath, content]) => {
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const searchLine = caseSensitive ? line : line.toLowerCase();
        if (searchLine.includes(searchQuery)) {
          matches.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    });

    return matches.slice(0, 100); // Limit to 100 results
  }, [query, caseSensitive, files]);

  return createElement('div', {className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'}, '<div className="bg-[#0d0d0f] border border-white/10 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          createElement('Search', {className: 'text-slate-400'})
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
            autoFocus
          />
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            Case sensitive
          </label>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded"
          >
            createElement('X', {className: 'text-slate-400'})
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 && query && (
            createElement('div', {className: 'text-center text-slate-500 py-8'}, 'No matches found')
          )}
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectFile(result.file, result.line);
                onClose();
              }}
              className="p-2 hover:bg-white/5 rounded cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs">
                createElement('FileCode', {className: 'text-indigo-400'})
                createElement('span', {className: 'text-indigo-400 font-medium'}, '{result.file}')
                createElement('span', {className: 'text-slate-500'}, ':{result.line}')
              </div>
              createElement('div', {className: 'text-xs text-slate-400 mt-1 font-mono'}, '{result.content.substring(0, 100)}
                {result.content.length > 100 && '...'}')'))}
        </div>

        {/* Footer */}
        createElement('div', {className: 'p-2 border-t border-white/5 text-xs text-slate-500 text-center'}, '{results.length} {results.length === 1 ? 'match' : 'matches'}')
      </div>
    </div>
  );
};
```

---

## 5. Enhanced FileTree with Context Menu

Add context menu to `FileTree.tsx`:

```typescript
// Add to FileTree component
const [contextMenu, setContextMenu] = useState<{
  x: number;
  y: number;
  file: string;
} | null>(null);

// Add right-click handler
const handleContextMenu = (e: React.MouseEvent, file: string) => {
  e.preventDefault();
  setContextMenu({ x: e.clientX, y: e.clientY, file });
};

// Add context menu JSX
{contextMenu && (
  <div
    className="fixed bg-[#0d0d0f] border border-white/10 rounded-lg shadow-lg z-50 py-1"
    style={{
      left: contextMenu.x,
      top: contextMenu.y
    }}
    onClick={() => setContextMenu(null)}
  >
    createElement('button', null, '{
        // Rename
        const newName = prompt('New name:', contextMenu.file);
        if (newName) {
          // Handle rename
        }
        setContextMenu(null);
      }}
      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
    >
      Rename')
    createElement('button', null, '{
        // Duplicate
        // Handle duplicate
        setContextMenu(null);
      }}
      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
    >
      Duplicate')
    createElement('button', null, '{
        // Copy path
        navigator.clipboard.writeText(contextMenu.file);
        setContextMenu(null);
      }}
      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
    >
      Copy Path')
    createElement('button', null, '{
        onDelete(contextMenu.file);
        setContextMenu(null);
      }}
      className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
    >
      Delete')
  </div>
)}
```

---

## 6. Integration Checklist

### Phase 1: Frontend Enhancements (No Backend Required)
- [ ] Add file search component
- [ ] Add file rename functionality
- [ ] Add file duplicate functionality
- [ ] Add context menu to FileTree
- [ ] Add file copy path feature

### Phase 2: Backend API (Supabase Edge Functions)
- [ ] Create Supabase Edge Function structure
- [ ] Implement write/read/edit/delete endpoints
- [ ] Add authentication middleware
- [ ] Test with Postman/curl

### Phase 3: Frontend-Backend Integration
- [ ] Create `useFileToolsAPI` hook
- [ ] Integrate with existing file operations
- [ ] Add error handling
- [ ] Add loading states

### Phase 4: Advanced Features
- [ ] Implement fast_apply
- [ ] Add file search API
- [ ] Add directory listing API
- [ ] Create AI Code Assistant class

---

## 7. Quick Integration Example

Add to `App.tsx`:

```typescript
// At top of component
const [showSearch, setShowSearch] = useState(false);

// Add search keyboard shortcut
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearch(true);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

// In JSX, add FileSearch component
{showSearch && (
  <FileSearch
    files={files}
    onSelectFile={(filePath, lineNumber) => {
      setActiveFile(filePath);
      // Scroll to line if editor supports it
    }}
    onClose={() => setShowSearch(false)}
  />
)}
```

---

## 8. Next Steps

1. **Start with Frontend Search** - Easiest win, no backend needed
2. **Add File Operations** - Rename, duplicate, copy path
3. **Create Backend API** - Start with write/read/edit
4. **Integrate Hook** - Connect frontend to backend
5. **Add AI Features** - Build on top of file tools

---

## Notes

- All file operations should respect your existing `shouldExcludePath` logic
- Consider adding undo/redo for file operations (you already have history!)
- Add file watchers for linked folders
- Consider adding file diff view for changes
- Add file size and line count display

