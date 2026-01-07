# Complete File Tools API Documentation

A comprehensive toolkit for AI-powered file manipulation, mirroring Figma Make's file tools.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Available Tools](#available-tools)
3. [API Reference](#api-reference)
4. [Frontend Examples](#frontend-examples)
5. [AI Integration Guide](#ai-integration-guide)
6. [Security](#security)

---

## 🚀 Quick Start

### Backend Setup

All backend files are already created:
- `/supabase/functions/server/code-editor.tsx` - Edit, read, search tools
- `/supabase/functions/server/file-tools.tsx` - All other file operations
- `/supabase/functions/server/index.tsx` - API routes (updated)

### Frontend Usage

```typescript

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-291c16de`;

// Example: Write a file
const writeFile = async (accessToken: string) => {
  const response = await fetch(`${serverUrl}/files/write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      filePath: '/tmp/myfile.tsx',
      content: 'const hello = "world";'
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

---

## 🛠️ Available Tools

### Core File Operations
| Tool | Description | Figma Equivalent |
|------|-------------|------------------|
| **write** | Create/overwrite files | `write_tool` |
| **read** | Read files with offset/limit | `read` |
| **edit** | Exact string replacement | `edit_tool` |
| **fast_apply** | Smart context-aware editing | `fast_apply_tool` |
| **delete** | Delete files/directories | `delete_tool` |
| **search** | Search across files | `file_search` |

### Additional Operations
| Tool | Description |
|------|-------------|
| **list_directory** | List files in directory |
| **copy** | Copy files |
| **move** | Move/rename files |
| **file_info** | Get file metadata |
| **create_directory** | Create directories |

---

## 📖 API Reference

### 1. Write File

**Endpoint:** `POST /make-server-291c16de/files/write`

**Purpose:** Create or overwrite a file

**Request:**
```json
{
  "filePath": "/tmp/component.tsx",
  "content": "export default function MyComponent = () => createElement('div', null, 'Hello');"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully created/updated /tmp/component.tsx",
  "data": {
    "filePath": "/tmp/component.tsx",
    "size": 50
  }
}
```

---

### 2. Read File

**Endpoint:** `POST /make-server-291c16de/files/read-range`

**Purpose:** Read file with optional line range (for large files)

**Request (Full File):**
```json
{
  "filePath": "/tmp/component.tsx"
}
```

**Request (With Range):**
```json
{
  "filePath": "/tmp/component.tsx",
  "start": 0,
  "end": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Read /tmp/component.tsx",
  "data": {
    "content": "1\timport React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';\n2\texport const...",
    "totalLines": 150,
    "returnedLines": 50,
    "offset": 0,
    "limit": 50
  }
}
```

---

### 3. Edit File

**Endpoint:** `POST /make-server-291c16de/code/edit`

**Purpose:** Exact string replacement (must be unique)

**Request:**
```json
{
  "filePath": "/tmp/component.tsx",
  "oldString": "className=\"bg-blue-500\"",
  "newString": "className=\"bg-green-500\""
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully edited /tmp/component.tsx"
}
```

**Error (Non-unique):**
```json
{
  "success": false,
  "message": "String appears multiple times - not unique",
  "error": "Found 3 occurrences of the string..."
}
```

---

### 4. Fast Apply

**Endpoint:** `POST /make-server-291c16de/files/fast-apply`

**Purpose:** Smart editing with context markers (like `// ... existing code ...`)

**Request:**
```json
{
  "filePath": "/tmp/component.tsx",
  "changeStr": "export default function MyComponent = () => {\n  // ... existing code ...\n  const newFeature = true;\n  // ... existing code ...\n}"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully applied changes to /tmp/component.tsx",
  "data": {
    "originalSize": 1500,
    "newSize": 1550,
    "changeCount": 1
  }
}
```

---

### 5. Delete File

**Endpoint:** `POST /make-server-291c16de/files/delete`

**Purpose:** Delete file or directory

**Request:**
```json
{
  "filePath": "/tmp/old-component.tsx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted file /tmp/old-component.tsx"
}
```

---

### 6. Search Files

**Endpoint:** `POST /make-server-291c16de/files/search`

**Purpose:** Search for content pattern across multiple files

**Request:**
```json
{
  "directoryPath": "/tmp/",
  "contentPattern": "useState",
  "namePattern": "*.tsx",
  "caseSensitive": false,
  "maxResults": 50,
  "contextLines": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 3 files with matches",
  "data": {
    "results": [
      {
        "file": "/tmp/component.tsx",
        "matches": [
          {
            "line": 5,
            "content": "  const [state, setState] = useState(0);",
            "context": [
              "export default function MyComponent() {",
              "  const [state, setState] = useState(0);",
              "  return createElement('div', null, '{state}');"
            ]
          }
        ]
      }
    ],
    "totalFiles": 3,
    "totalMatches": 5
  }
}
```

---

### 7. List Directory

**Endpoint:** `POST /make-server-291c16de/files/list-directory`

**Purpose:** List all files and directories

**Request:**
```json
{
  "directoryPath": "/tmp/"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listed /tmp/",
  "data": {
    "entries": [
      {
        "name": "components",
        "isDirectory": true
      },
      {
        "name": "app.tsx",
        "isDirectory": false,
        "size": 1500
      }
    ],
    "path": "/tmp/",
    "count": 2
  }
}
```

---

### 8. Copy File

**Endpoint:** `POST /make-server-291c16de/files/copy`

**Request:**
```json
{
  "sourcePath": "/tmp/component.tsx",
  "destinationPath": "/tmp/component-backup.tsx"
}
```

---

### 9. Move File

**Endpoint:** `POST /make-server-291c16de/files/move`

**Request:**
```json
{
  "sourcePath": "/tmp/old-name.tsx",
  "destinationPath": "/tmp/new-name.tsx"
}
```

---

### 10. Get File Info

**Endpoint:** `POST /make-server-291c16de/files/info`

**Request:**
```json
{
  "filePath": "/tmp/component.tsx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Retrieved info for /tmp/component.tsx",
  "data": {
    "isFile": true,
    "isDirectory": false,
    "size": 1500,
    "modified": "2026-01-04T10:30:00Z",
    "created": "2026-01-01T08:00:00Z"
  }
}
```

---

### 11. Create Directory

**Endpoint:** `POST /make-server-291c16de/files/create-directory`

**Request:**
```json
{
  "directoryPath": "/tmp/components"
}
```

---

## 💻 Frontend Examples

### React Component - Complete File Manager

```tsx
import { useState, useEffect } from 'react';

interface FileToolsAPI {
  writeFile: (path: string, content: string) => Promise<any>;
  readFile: (path: string) => Promise<string>;
  editFile: (path: string, oldStr: string, newStr: string) => Promise<any>;
  deleteFile: (path: string) => Promise<any>;
  searchFiles: (dir: string, pattern: string) => Promise<any>;
  listDirectory: (dir: string) => Promise<any>;
}

export function useFileTools(accessToken: string): FileToolsAPI {
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-291c16de`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  return {
    writeFile: async (path: string, content: string) => {
      const res = await fetch(`${baseUrl}/files/write`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath: path, content })
      });
      return res.json();
    },

    readFile: async (path: string) => {
      const res = await fetch(`${baseUrl}/code/read`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath: path })
      });
      const data = await res.json();
      return data.content;
    },

    editFile: async (path: string, oldStr: string, newStr: string) => {
      const res = await fetch(`${baseUrl}/code/edit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          filePath: path, 
          oldString: oldStr, 
          newString: newStr 
        })
      });
      return res.json();
    },

    deleteFile: async (path: string) => {
      const res = await fetch(`${baseUrl}/files/delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ filePath: path })
      });
      return res.json();
    },

    searchFiles: async (dir: string, pattern: string) => {
      const res = await fetch(`${baseUrl}/files/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          directoryPath: dir, 
          contentPattern: pattern 
        })
      });
      return res.json();
    },

    listDirectory: async (dir: string) => {
      const res = await fetch(`${baseUrl}/files/list-directory`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ directoryPath: dir })
      });
      return res.json();
    }
  };
}

// Example usage component
export function FileManager({ accessToken }: { accessToken: string }) {
  const fileTools = useFileTools(accessToken);
  const [files, setFiles] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState('');

  const loadDirectory = async () => {
    const result = await fileTools.listDirectory('/tmp/');
    setFiles(result.data.entries);
  };

  const createNewFile = async () => {
    await fileTools.writeFile('/tmp/new-file.tsx', '// New file');
    loadDirectory();
  };

  const editFileColor = async (filePath: string) => {
    await fileTools.editFile(
      filePath,
      'bg-blue-500',
      'bg-green-500'
    );
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  return createElement('div', {className: 'p-6'}, 'createElement('h2', null, 'File Manager')
      createElement('button', {onClick: createNewFile}, 'Create New File')
      <ul>
        {files.map(file => (
          <li key={file.name}>
            {file.name} 
            {file.isFile && (
              createElement('button', null, 'fileTools.deleteFile(`/tmp/${file.name}`)}>
                Delete')
            )}
          </li>
        ))}
      </ul>');
}
```

---

## 🤖 AI Integration Guide

### Building an AI Code Assistant

```typescript
class AICodeAssistant {
  private fileTools: FileToolsAPI;
  private geminiApiKey: string;

  constructor(fileTools: FileToolsAPI, geminiApiKey: string) {
    this.fileTools = fileTools;
    this.geminiApiKey = geminiApiKey;
  }

  /**
   * AI analyzes code and makes changes
   */
  async processInstruction(
    filePath: string,
    instruction: string
  ): Promise<string> {
    // 1. Read the current file
    const code = await this.fileTools.readFile(filePath);

    // 2. Send to AI for analysis
    const aiPrompt = `
      You are a code editor AI. Given this code:
      
      \`\`\`tsx
      ${code}
      \`\`\`
      
      User wants to: ${instruction}
      
      Respond with JSON:
      {
        "action": "edit" | "write" | "delete",
        "oldString": "exact string to replace (for edit)",
        "newString": "replacement (for edit)",
        "newContent": "full new content (for write)",
        "explanation": "what you changed"
      }
    `;

    const response = await this.callGemini(aiPrompt);
    const aiDecision = JSON.parse(response);

    // 3. Execute the AI's decision
    if (aiDecision.action === 'edit') {
      await this.fileTools.editFile(
        filePath,
        aiDecision.oldString,
        aiDecision.newString
      );
    } else if (aiDecision.action === 'write') {
      await this.fileTools.writeFile(filePath, aiDecision.newContent);
    }

    return aiDecision.explanation;
  }

  /**
   * AI searches and refactors across multiple files
   */
  async refactorAcrossFiles(
    directory: string,
    refactorInstruction: string
  ): Promise<string[]> {
    const changes: string[] = [];

    // 1. List all files
    const dirListing = await this.fileTools.listDirectory(directory);
    const files = dirListing.data.entries.filter((e: any) => !e.isDirectory);

    // 2. Process each file
    for (const file of files) {
      const filePath = `${directory}/${file.name}`;
      const code = await this.fileTools.readFile(filePath);

      // 3. Ask AI if this file needs changes
      const prompt = `
        Does this code need changes for: ${refactorInstruction}?
        
        Code:
        ${code}
        
        Respond with:
        { "needsChange": true/false, "changes": {...} }
      `;

      const aiResponse = await this.callGemini(prompt);
      const decision = JSON.parse(aiResponse);

      if (decision.needsChange) {
        // Apply changes
        await this.fileTools.editFile(
          filePath,
          decision.changes.oldString,
          decision.changes.newString
        );
        changes.push(`Modified ${file.name}`);
      }
    }

    return changes;
  }

  /**
   * AI creates new component from description
   */
  async generateComponent(
    componentName: string,
    description: string
  ): Promise<string> {
    const prompt = `
      Create a React component named ${componentName}.
      
      Requirements: ${description}
      
      Generate complete TSX code with:
      - TypeScript types
      - Tailwind CSS styling
      - Props interface
      - Export statement
    `;

    const code = await this.callGemini(prompt);
    const filePath = `/tmp/components/${componentName}.tsx`;

    await this.fileTools.writeFile(filePath, code);
    return filePath;
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

// Usage Example
const assistant = new AICodeAssistant(fileTools, geminiKey);

// Example 1: Modify a file
await assistant.processInstruction(
  '/tmp/Button.tsx',
  'Change all buttons to use rounded corners'
);

// Example 2: Refactor multiple files
await assistant.refactorAcrossFiles(
  '/tmp/components',
  'Replace all class components with function components'
);

// Example 3: Generate new component
await assistant.generateComponent(
  'ProfileCard',
  'A card showing user avatar, name, and bio with a follow button'
);
```

---

## 🔒 Security

### File Path Restrictions

**All operations are restricted to `/tmp/` directory only**

```typescript
// ✅ ALLOWED
await writeFile('/tmp/myfile.tsx', content);
await readFile('/tmp/data/config.json');

// ❌ FORBIDDEN (will return 403 error)
await writeFile('/etc/passwd', content);  // System file
await readFile('/App.tsx', content);       // Outside /tmp
```

### Authentication

All endpoints require a valid Supabase access token:

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### Error Handling

Always handle errors properly:

```typescript
try {
  const result = await fileTools.writeFile(path, content);
  if (!result.success) {
    console.error('Operation failed:', result.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## 🎯 Best Practices

### 1. Use Fast Apply for Large Edits
```typescript
// Instead of reading entire file and replacing
// Use fast_apply for targeted changes
await fileTools.fastApply(
  '/tmp/large-file.tsx',
  `
  // ... existing code ...
  const newFeature = () => {
    // your new code
  };
  // ... existing code ...
  `
);
```

### 2. Search Before Edit
```typescript
// Find all occurrences first
const results = await fileTools.searchFiles('/tmp/', 'oldClassName');
console.log(`Found in ${results.data.totalFiles} files`);

// Then edit each file
for (const result of results.data.results) {
  await fileTools.editFile(
    result.file,
    'oldClassName',
    'newClassName'
  );
}
```

### 3. Batch Operations
```typescript
// Process multiple files in parallel
await Promise.all([
  fileTools.writeFile('/tmp/file1.tsx', content1),
  fileTools.writeFile('/tmp/file2.tsx', content2),
  fileTools.writeFile('/tmp/file3.tsx', content3)
]);
```

### 4. Provide Context for AI
```typescript
// Bad: Vague instruction
await ai.processInstruction(file, 'make it better');

// Good: Specific instruction
await ai.processInstruction(
  file,
  'Replace the blue button with a green gradient button using Tailwind classes bg-gradient-to-r from-green-400 to-green-600'
);
```

---

## 📊 Comparison to Figma Make Tools

| Feature | Your Implementation | Figma Make |
|---------|-------------------|------------|
| write_tool | ✅ `POST /files/write` | ✅ |
| read | ✅ `POST /files/read-range` | ✅ |
| edit_tool | ✅ `POST /code/edit` | ✅ |
| fast_apply_tool | ✅ `POST /files/fast-apply` | ✅ |
| delete_tool | ✅ `POST /files/delete` | ✅ |
| file_search | ✅ `POST /files/search` | ✅ |
| list_directory | ✅ `POST /files/list-directory` | ➕ Bonus |
| copy_file | ✅ `POST /files/copy` | ➕ Bonus |
| move_file | ✅ `POST /files/move` | ➕ Bonus |
| file_info | ✅ `POST /files/info` | ➕ Bonus |
| create_directory | ✅ `POST /files/create-directory` | ➕ Bonus |

**You have ALL the core tools PLUS 5 bonus utilities!** 🎉

---

## 🚀 Next Steps

1. **Build AI Chat Interface** - Let users describe code changes in natural language
2. **Add Syntax Validation** - Validate TypeScript/TSX before writing
3. **Implement Version Control** - Save file history for undo/redo
4. **Create File Explorer UI** - Visual file tree like VS Code
5. **Add Code Formatting** - Auto-format with Prettier
6. **Build Code Search UI** - Search and replace across all files
7. **Add Templates** - Pre-built component templates

---

## 📝 Summary

You now have a **complete file manipulation toolkit** that an AI can use to:

✅ Create, read, update, and delete files  
✅ Search across multiple files  
✅ Make smart context-aware edits  
✅ Manage directory structures  
✅ Copy, move, and get file info  

All secured with:
- User authentication
- /tmp directory sandboxing
- Detailed error messages
- Comprehensive logging

Ready to build your AI code editor! 🎨🤖
