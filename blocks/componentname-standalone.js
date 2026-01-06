/**
 * File Converter Service
 * Converts HTML or single-file React apps into multi-file React structure with guardrails
 */

interface ComponentInfo {
  name: string;
  code: string;
  props?: string[];
  isHook?: boolean;
  isUtility?: boolean;
}

interface ConversionResult {
  files: Record<string, string>;
  components: ComponentInfo[];
  warnings: string[];
}

/**
 * Detects if content is HTML or single-file React
 */
export function detectConversionNeeded(files: Record<string, string>): {
  needsConversion: boolean;
  type: 'html' | 'single-file-react' | 'multi-file' | null;
  mainFile?: string;
} {
  const fileKeys = Object.keys(files);
  
  // Check for standalone HTML
  const htmlFiles = fileKeys.filter(f => /\.html?$/i.test(f));
  if (htmlFiles.length === 1 && fileKeys.length <= 3) {
    const htmlContent = files[htmlFiles[0]];
    if (htmlContent && (htmlContent.includes('<script') || htmlContent.includes('<!DOCTYPE'))) {
      return { needsConversion: true, type: 'html', mainFile: htmlFiles[0] };
    }
  }
  
  // Check for single-file React (App.tsx with everything in one file)
  const appFiles = fileKeys.filter(f => /App\.(tsx|jsx)$/i.test(f));
  if (appFiles.length === 1 && fileKeys.length <= 5) {
    const appContent = files[appFiles[0]];
    if (appContent) {
      // Heuristic: if App.tsx is > 500 lines or has multiple components defined, it's likely single-file
      const lines = appContent.split('\n').length;
      const componentCount = (appContent.match(/(?:function|const)\s+\w+\s*[:=]\s*(?:\(|React\.(?:FC|Component|memo))/g) || []).length;
      const hasMultipleComponents = componentCount > 2;
      
      if (lines > 500 || hasMultipleComponents) {
        return { needsConversion: true, type: 'single-file-react', mainFile: appFiles[0] };
      }
    }
  }
  
  return { needsConversion: false, type: 'multi-file' };
}

/**
 * Extracts React components from code
 */
function extractComponents(code: string): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  
  // Match function components: function ComponentName(props) or const ComponentName = (props) =>
  const functionComponentRegex = /(?:export\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)\s*[:=]\s*(?:\([^)]*\)|React\.(?:FC|Component|memo)<[^>]*>)\s*[=:>]/g;
  // Match class components: class ComponentName extends React.Component
  const classComponentRegex = /(?:export\s+)?class\s+([A-Z][a-zA-Z0-9]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)/g;
  
  let match;
  
  // Extract function components
  while ((match = functionComponentRegex.exec(code)) !== null) {
    const componentName = match[1];
    if (componentName === 'App' || componentName.startsWith('_')) continue;
    
    // Find component definition boundaries
    const startIndex = match.index;
    let depth = 0;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = '';
    
    for (let i = startIndex; i < code.length; i++) {
      const char = code[i];
      const prevChar = i > 0 ? code[i - 1] : '';
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
      } else if (!inString) {
        if (char === '{') depth++;
        if (char === '}') {
          depth--;
          if (depth === 0 && endIndex > startIndex) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    if (endIndex > startIndex) {
      const componentCode = code.substring(startIndex, endIndex);
      const propsMatch = componentCode.match(/\(([^)]*)\)/);
      const props = propsMatch ? propsMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [];
      
      components.push({
        name: componentName,
        code: componentCode,
        props: props.length > 0 ? props : undefined,
      });
    }
  }
  
  // Extract class components
  while ((match = classComponentRegex.exec(code)) !== null) {
    const componentName = match[1];
    if (componentName === 'App') continue;
    
    // Find class boundaries
    const startIndex = match.index;
    let braceCount = 0;
    let endIndex = startIndex;
    let foundStart = false;
    
    for (let i = startIndex; i < code.length; i++) {
      const char = code[i];
      if (char === '{') {
        braceCount++;
        foundStart = true;
      }
      if (char === '}') {
        braceCount--;
        if (braceCount === 0 && foundStart) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    if (endIndex > startIndex) {
      const componentCode = code.substring(startIndex, endIndex);
      components.push({
        name: componentName,
        code: componentCode,
      });
    }
  }
  
  return components;
}

/**
 * Extracts custom hooks (functions starting with 'use')
 */
function extractHooks(code: string): ComponentInfo[] {
  const hooks: ComponentInfo[] = [];
  const hookRegex = /(?:export\s+)?(?:function|const)\s+(use[A-Z][a-zA-Z0-9]*)\s*[:=]\s*\(/g;
  
  let match;
  while ((match = hookRegex.exec(code)) !== null) {
    const hookName = match[1];
    const startIndex = match.index;
    
    // Find hook boundaries
    let depth = 0;
    let endIndex = startIndex;
    let foundStart = false;
    
    for (let i = startIndex; i < code.length; i++) {
      const char = code[i];
      if (char === '{') {
        depth++;
        foundStart = true;
      }
      if (char === '}') {
        depth--;
        if (depth === 0 && foundStart) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    if (endIndex > startIndex) {
      const hookCode = code.substring(startIndex, endIndex);
      hooks.push({
        name: hookName,
        code: hookCode,
        isHook: true,
      });
    }
  }
  
  return hooks;
}

/**
 * Extracts utility functions
 */
function extractUtilities(code: string): ComponentInfo[] {
  const utilities: ComponentInfo[] = [];
  const utilRegex = /(?:export\s+)?(?:function|const)\s+([a-z][a-zA-Z0-9]*)\s*[:=]\s*\(/g;
  
  let match;
  while ((match = utilRegex.exec(code)) !== null) {
    const utilName = match[1];
    // Skip React hooks and components
    if (utilName.startsWith('use') || /^[A-Z]/.test(utilName)) continue;
    
    const startIndex = match.index;
    let depth = 0;
    let endIndex = startIndex;
    let foundStart = false;
    
    for (let i = startIndex; i < code.length; i++) {
      const char = code[i];
      if (char === '{') {
        depth++;
        foundStart = true;
      }
      if (char === '}') {
        depth--;
        if (depth === 0 && foundStart) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    if (endIndex > startIndex) {
      const utilCode = code.substring(startIndex, endIndex);
      utilities.push({
        name: utilName,
        code: utilCode,
        isUtility: true,
      });
    }
  }
  
  return utilities;
}

/**
 * Converts HTML to React
 */
function convertHtmlToReact(htmlContent: string, fileName: string): ConversionResult {
  const files: Record<string, string> = {};
  const warnings: string[] = [];
  
  // Extract title
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'App';
  
  // Extract CSS
  const styleMatch = htmlContent.match(/<style[^>]*>(.*?)<\/style>/is);
  const css = styleMatch ? styleMatch[1] : '';
  
  // Extract body content
  const bodyMatch = htmlContent.match(/<body[^>]*>(.*?)<\/body>/is);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
  
  // Convert HTML to JSX
  let jsxContent = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--.*?-->/gs, '')
    .trim();
  
  // Extract inline scripts
  const scriptMatches = htmlContent.matchAll(/<script[^>]*>(.*?)<\/script>/gis);
  let scriptCode = '';
  for (const match of scriptMatches) {
    if (match[1] && !match[1].includes('src=')) {
      scriptCode += match[1] + '\n';
    }
  }
  
  // Create App component
  const appCode = `import React from 'https://esm.sh/react@18';
import './App.css';

function App() {
  return (
    <div className="app">
      ${jsxContent}
    </div>
  );
}

export default App;`;
  
  files['App.tsx'] = appCode;
  files['App.css'] = css || '/* Styles */\n.app { padding: 20px; }';
  
  // Create index.tsx
  files['index.tsx'] = `import React from 'https://esm.sh/react@18';
import { createRoot } from 'react-dom/client';

import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}`;
  
  files['index.css'] = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}`;
  
  // Create index.html
  files['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  
  // Create package.json if not exists
  files['package.json'] = JSON.stringify({
    name: 'converted-app',
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      'react': '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {
      '@types/react': '^18.3.1',
      '@types/react-dom': '^18.3.1',
      '@vitejs/plugin-react': '^4.2.1',
      'typescript': '^5.3.3',
      'vite': '^5.0.8'
    }
  }, null, 2);
  
  warnings.push('Converted HTML to React. Some functionality may need manual adjustment.');
  
  return { files, components: [], warnings };
}

/**
 * Converts single-file React to multi-file structure
 */
function convertSingleFileReact(appContent: string, existingFiles: Record<string, string>): ConversionResult {
  const files: Record<string, string> = { ...existingFiles };
  const warnings: string[] = [];
  
  // Extract imports (keep them in App.tsx)
  const importRegex = /^import\s+.*?from\s+['"].*?['"];?$/gm;
  const imports = (appContent.match(importRegex) || []).join('\n');
  
  // Extract components
  const components = extractComponents(appContent);
  const hooks = extractHooks(appContent);
  const utilities = extractUtilities(appContent);
  
  // Remove extracted components/hooks/utilities from App.tsx
  let cleanedAppContent = appContent;
  const allExtracted = [...components, ...hooks, ...utilities];
  
  for (const item of allExtracted) {
    // Remove the extracted code from App.tsx
    cleanedAppContent = cleanedAppContent.replace(item.code, '');
  }
  
  // Clean up App.tsx
  cleanedAppContent = cleanedAppContent
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
  
  // Ensure App component remains
  if (!cleanedAppContent.includes('function App') && !cleanedAppContent.includes('const App')) {
    // Extract App component separately
    const appMatch = appContent.match(/(?:export\s+default\s+)?(?:function|const)\s+App\s*[:=]\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\n\}/);
    if (appMatch) {
      cleanedAppContent = imports + '\n\n' + appMatch[0];
    }
  } else {
    cleanedAppContent = imports + '\n\n' + cleanedAppContent;
  }
  
  // Add imports for extracted components
  const componentImports: string[] = [];
  for (const component of components) {
    componentImports.push(``);
  }
  for (const hook of hooks) {
    componentImports.push(``);
  }
  for (const util of utilities) {
    componentImports.push(``);
  }
  
  if (componentImports.length > 0) {
    cleanedAppContent = imports + '\n' + componentImports.join('\n') + '\n\n' + cleanedAppContent.replace(imports, '').trim();
  }
  
  files['App.tsx'] = cleanedAppContent;
  
  // Create component files
  for (const component of components) {
    const componentCode = `import React${component.props && component.props.length > 0 ? ', { ' + component.props.map(p => {
      const propName = p.split(':')[0].trim();
      return propName;
    }).join(', ') + ' }' : ''} from 'react';

${component.code}

export default ${component.name};`;
    
    files[`components/${component.name}.tsx`] = componentCode;
  }
  
  // Create hook files
  for (const hook of hooks) {
    const hookCode = `import { ${hook.code.match(/useState|useEffect|useCallback|useMemo|useRef/) ? 
      hook.code.match(/(useState|useEffect|useCallback|useMemo|useRef)/g)?.join(', ') || 'useState' : 
      'useState'} } from 'react';

${hook.code}

export default ${hook.name};`;
    
    files[`hooks/${hook.name}.ts`] = hookCode;
  }
  
  // Create utility files
  for (const util of utilities) {
    files[`utils/${util.name}.ts`] = util.code + '\n\nexport default ' + util.name + ';';
  }
  
  // Create index.tsx if it doesn't exist
  if (!files['index.tsx'] && !files['src/index.tsx']) {
    files['index.tsx'] = `import React from 'https://esm.sh/react@18';
import { createRoot } from 'react-dom/client';

import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}`;
  }
  
  warnings.push(`Extracted ${components.length} components, ${hooks.length} hooks, and ${utilities.length} utilities.`);
  
  return { files, components: [...components, ...hooks, ...utilities], warnings };
}

/**
 * Main conversion function
 */
export function convertToMultiFile(files: Record<string, string>): ConversionResult {
  const detection = detectConversionNeeded(files);
  
  if (!detection.needsConversion) {
    return { files, components: [], warnings: ['No conversion needed - already multi-file structure'] };
  }
  
  if (detection.type === 'html' && detection.mainFile) {
    return convertHtmlToReact(files[detection.mainFile], detection.mainFile);
  }
  
  if (detection.type === 'single-file-react' && detection.mainFile) {
    return convertSingleFileReact(files[detection.mainFile], files);
  }
  
  return { files, components: [], warnings: ['Unknown conversion type'] };
}

