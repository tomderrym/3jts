import React, {  Suspense, useEffect, useMemo  } from 'https://esm.sh/react@18';


// Simple Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ensureStylesheetLoaded(href: string, key: string) {
  const id = `remote-block-css:${key}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Remote block loader:
 * - Prefer direct dynamic import(jsUrl) for proper ESM artifacts.
 * - If the artifact imports React from a CDN (esm.sh/skypack/unpkg/etc), it creates a SECOND React instance,
 *   which causes: "A React Element from an older version of React was rendered".
 *
 * To harden this, we:
 * - fetch the JS
 * - strip CDN React imports
 * - inject a small header that uses globalThis.React (which we set to the app's React)
 * - import the transformed module via a Blob URL
 */
const blobUrlCache = new Map<string, string>();

function normalizeGitHubUrl(jsUrl: string) {
  if (!jsUrl) return jsUrl;
  
  // Handle GitHub blob URLs (from API responses)
  // https://github.com/user/repo/blob/branch/path/file.js
  if (jsUrl.includes('github.com/') && jsUrl.includes('/blob/')) {
    return jsUrl
      .replace('github.com/', 'raw.githubusercontent.com/')
      .replace('/blob/', '/');
  }
  
  // Handle GitHub tree URLs (from web UI)
  // https://github.com/user/repo/tree/branch/path/file.js
  if (jsUrl.includes('github.com/') && jsUrl.includes('/tree/')) {
    return jsUrl
      .replace('github.com/', 'raw.githubusercontent.com/')
      .replace('/tree/', '/');
  }
  
  // Handle GitHub URLs without /blob/ or /tree/ (shouldn't happen, but handle it)
  if (jsUrl.includes('github.com/') && !jsUrl.includes('raw.githubusercontent.com')) {
    // Try to infer: github.com/user/repo/branch/path/file.js → raw.githubusercontent.com/user/repo/branch/path/file.js
    return jsUrl.replace('github.com/', 'raw.githubusercontent.com/');
  }
  
  return jsUrl;
}

function looksLikeCdnReactImport(source: string) {
  return (
    /from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react/i.test(source) ||
    /from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react\/jsx-runtime/i.test(
      source,
    )
  );
}

function transformToUseGlobalReact(source: string) {
  const hadReactImport =
    /from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react[^'"]*['"]\s*;?/i.test(
      source,
    ) ||
    /from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react\/jsx-runtime[^'"]*['"]\s*;?/i.test(
      source,
    );

  let out = source;

  // Strip common CDN React imports (default, namespace, named)
  out = out.replace(
    /^\s*import\s+[\s\S]*?\s+from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react[^'"]*['"]\s*;?\s*$/gim,
    '',
  );
  out = out.replace(
    /^\s*import\s+[\s\S]*?\s+from\s+['"]https?:\/\/(esm\.sh|cdn\.skypack\.dev|unpkg\.com|cdn\.jsdelivr\.net)\/react\/jsx-runtime[^'"]*['"]\s*;?\s*$/gim,
    '',
  );

  // If the module used a bare `createElement(` identifier (common in our sample),
  // rewrite it to React.createElement(...) so it uses the app's React.
  if (hadReactImport && /\bcreateElement\s*\(/.test(out) && !/\bReact\.createElement\s*\(/.test(out)) {
    out = out.replace(/\bcreateElement\s*\(/g, 'React.createElement(');
  }

  // Prepend a header to bind React from globalThis.
  // Important: this must run in the module scope for the rest of the module to use `React`.
  const header =
    `// [the-son] injected: use app React to avoid multi-React mismatch\n` +
    `export default function React = globalThis.React;
` +
    `if (!React) { throw new Error('Global React is missing. Remote blocks must use the host React instance.'); }\n\n`;

  return header + out;
}

export function RemoteBlockRenderer({
  block,
  props,
  slots,
}: {
  block: RemoteBlockMeta;
  props?: Record<string, any>;
  slots?: Record<string, React.ReactNode>;
}) {
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const LazyComp = useMemo(() => {
    return React.lazy(async () => {
      // NOTE: Vite requires @vite-ignore for runtime, non-literal import URLs.
      try {
        let jsUrl = normalizeGitHubUrl(block.jsUrl);
        if (jsUrl !== block.jsUrl) {
          console.warn(
            `[RemoteBlockRenderer] Auto-corrected GitHub URL for block "${block.id}":`,
            block.jsUrl,
            '→',
            jsUrl,
          );
        }

        // Always expose host React for blocks that expect it.
        (globalThis as any).React = React;

        // Try: fetch + transform (fixes multi-React issues from CDN imports)
        // Fall back to direct import for fully bundled ESM artifacts.
        let mod: any = null;
        try {
          const cacheKey = `${block.id}|${block.versionSha ?? ''}|${jsUrl}`;
          const cachedBlob = blobUrlCache.get(cacheKey);
          if (cachedBlob) {
            mod = await import(/* @vite-ignore */ cachedBlob);
          } else {
            const res = await fetch(jsUrl, { mode: 'cors' });
            if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
            const source = await res.text();

            if (looksLikeCdnReactImport(source)) {
              const transformed = transformToUseGlobalReact(source);
              const blobUrl = URL.createObjectURL(new Blob([transformed], { type: 'text/javascript' }));
              blobUrlCache.set(cacheKey, blobUrl);
              mod = await import(/* @vite-ignore */ blobUrl);
            } else {
              // Not importing React via CDN; try importing directly (no transform needed).
              mod = await import(/* @vite-ignore */ jsUrl);
            }
          }
        } catch (e) {
          // If fetch/transform fails, last resort: attempt direct import.
          mod = await import(/* @vite-ignore */ jsUrl);
        }

        const Comp = mod?.default ?? mod?.Block ?? null;
        if (!Comp) {
          throw new Error(
            `Remote block "${block.id}" did not export a React component. Expected default export.`,
          );
        }
        if (typeof Comp !== 'function') {
          throw new Error(`Remote block "${block.id}" exported a non-function: ${typeof Comp}`);
        }

        return { default: Comp };
      } catch (e: any) {
        // Provide helpful error message for common issues
        const errorMsg = e?.message || String(e);
        const originalError = e;
        
        // Log the full error for debugging
        console.error(`[RemoteBlockRenderer] Failed to load block "${block.id}":`, originalError);
        console.error(`[RemoteBlockRenderer] Original URL: ${block.jsUrl}`);
        console.error(`[RemoteBlockRenderer] Normalized URL: ${jsUrl}`);
        
        // Check if URL is accessible first
        let helpfulMsg = `Failed to load block "${block.id}" from:\n  ${jsUrl}\n\n`;
        
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('404') || errorMsg.includes('Not Found')) {
          helpfulMsg += `The file might not exist or is not publicly accessible.\n\n`;
          helpfulMsg += `To verify:\n`;
          helpfulMsg += `  1. Open the URL in a new browser tab\n`;
          helpfulMsg += `  2. You should see the JavaScript code (not a 404 page)\n`;
          helpfulMsg += `  3. If using GitHub, make sure you clicked "Raw" button\n`;
          helpfulMsg += `  4. Try using jsDelivr: https://cdn.jsdelivr.net/gh/tomderrym/3jts@main/blocks/hero-01-standalone.js\n`;
        } else if (errorMsg.includes('CORS') || errorMsg.includes('Cross-Origin')) {
          helpfulMsg += `CORS error: The server hosting the file doesn't allow cross-origin requests.\n\n`;
          helpfulMsg += `Solutions:\n`;
          helpfulMsg += `  - Use jsDelivr: https://cdn.jsdelivr.net/gh/tomderrym/3jts@main/blocks/hero-01-standalone.js\n`;
          helpfulMsg += `  - Or use Supabase Storage (configured for CORS)\n`;
        } else if (errorMsg.includes('Unexpected token') || errorMsg.includes('SyntaxError')) {
          helpfulMsg += `The file contains invalid JavaScript.\n\n`;
          helpfulMsg += `Make sure the file is a valid ES module that exports a React component.\n`;
        } else {
          helpfulMsg += `Error: ${errorMsg}\n`;
        }
        
        // Store error for display
        setLoadError(helpfulMsg);
        
        // Return an error component instead of throwing
        return {
          default: () => (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
              <div className="font-bold mb-2">❌ Failed to load block "{block.id}"</div>
              <div className="text-[10px] text-red-400/80 whitespace-pre-wrap font-mono mt-2">
                {helpfulMsg}
              </div>
              <div className="mt-3 text-[10px] text-red-400/60 border-t border-red-500/20 pt-2">
                <div className="font-semibold mb-1">Quick Fix:</div>
                <div className="font-mono text-[9px] bg-black/30 p-2 rounded">
                  UPDATE blocks_index SET js_url = 'https://cdn.jsdelivr.net/gh/tomderrym/3jts@main/blocks/hero-01-standalone.js' WHERE block_id = 'hero-01';
                </div>
              </div>
            </div>
          ),
        };
      }
    });
  }, [block.id, block.jsUrl]);

  useEffect(() => {
    if (block.cssUrl) {
      ensureStylesheetLoaded(block.cssUrl, block.versionSha ? `${block.id}@${block.versionSha}` : block.id);
    }
  }, [block.cssUrl, block.id, block.versionSha]);

  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-xs text-slate-400">
          Loading <span className="text-indigo-400 font-mono">{block.id}</span>…
        </div>
      }
    >
      <ErrorBoundary
        fallback={
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
            <div className="font-bold mb-2">Error rendering block "{block.id}"</div>
            <div className="text-[10px] text-red-400/80">
              {loadError || 'Component error. Check console (F12) for details.'}
            </div>
          </div>
        }
      >
        <LazyComp {...(props ?? {})} slots={slots} />
      </ErrorBoundary>
    </Suspense>
  );
}


