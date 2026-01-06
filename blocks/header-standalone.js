/**
 * Smart Context Selector
 *
 * Analyzes the project files and the user prompt to determine the most relevant set of files
 * to send to the LLM. This helps in:
 * 1. Reducing token usage (cost & latency).
 * 2. Improving model focus by removing irrelevant noise.
 * 3. Fitting larger projects into context windows.
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.

// Files that are critical for understanding the project structure and build environment
const INFRA_FILES = [
  'package.json',
  'tsconfig.json',
  'vite.config.js',
  'vite.config.ts',
  'index.html',
  'tailwind.config.js',
  'postcss.config.js',
  'capacitor.config.json',
  'index.tsx',
  'main.tsx',
  'App.tsx', // Almost always relevant as the root component
  // Common entry patterns in some templates (backward compatibility)
  'src/index.tsx',
  'src/main.tsx',
  'src/App.tsx',
  'src/main.jsx',
  'src/main.ts',
];

// Lightweight mirror of PROVIDER_MODELS to avoid import cycles.
// If PROVIDER_MODELS is updated, this map should be kept in sync.
const PROVIDER_MODELS_LOCAL: Record<string, string[]> = {
  'Gemini Stream': ['gemini-2.5-flash', 'gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-2.0-flash-thinking-exp-01-21'],
  'Gemini': ['gemini-2.5-flash', 'gemini-3-pro-preview', 'gemini-3-flash-preview', 'gemini-2.0-flash-thinking-exp-01-21'],
  'OpenAI': ['gpt-5.1', 'gpt-4.5-preview', 'o1', 'o3-mini', 'gpt-4o', 'gpt-4-turbo'],
  'Anthropic': ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  'Perplexity': ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-huge-128k-online'],
  'Llama 3.2': ['llama3.2', 'llama3.1', 'mistral']
};

// Build reverse lookup from model name -> provider key using PROVIDER_MODELS_LOCAL
const MODEL_TO_PROVIDER: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [provider, models] of Object.entries(PROVIDER_MODELS_LOCAL)) {
    for (const m of models) {
      map[m.toLowerCase()] = provider;
    }
  }
  return map;
})();

/**
 * Heuristically determine a safe character budget based on the model name.
 *
 * This implementation is wired to the actual list of supported models
 * (PROVIDER_MODELS_LOCAL via MODEL_TO_PROVIDER) to avoid drift. Unknown
 * models still fall back to reasonable heuristics.
 */
export function getCharLimitForModel(model: string): number {
  const raw = (model || '').trim();
  const m = raw.toLowerCase();

  // 1) Direct mapping via PROVIDER_MODELS_LOCAL
  const provider = MODEL_TO_PROVIDER[m];
  if (provider) {
    switch (provider) {
      case 'Gemini':
      case 'Gemini Stream':
        // Gemini models here are all large-context for this playground.
        return 800_000;
      case 'OpenAI':
        // gpt-5.1, 4.5, o1, o3-mini, 4o, 4-turbo – all large-context.
        return 120_000;
      case 'Anthropic':
        // Claude 3 family (100k-style context)
        return 100_000;
      case 'Perplexity':
      case 'Llama 3.2':
        // Good but typically smaller effective contexts for our usage.
        return 64_000;
      default:
        return 32_000;
    }
  }

  // 2) Heuristics for models that are not in PROVIDER_MODELS_LOCAL yet

  // Very large / experimental context models
  if (
    m.includes('gemini') ||
    m.includes('1.5') ||
    m.includes('2.0') ||
    m.includes('3.0') ||
    m.includes('128k') ||
    m.includes('200k') ||
    m.includes('1m') ||
    m.includes('1000000')
  ) {
    // Gemini and similar: effectively unlimited for this playground.
    return 800_000;
  }

  // Modern OpenAI family with large context (4.5, 5, o3-mini, o1, etc.)
  if (
    m.startsWith('gpt-5') ||
    m.startsWith('gpt-4.5') ||
    m.startsWith('gpt-4o') ||
    m.startsWith('gpt-4-turbo') ||
    m.startsWith('o1') ||
    m.startsWith('o3')
  ) {
    return 120_000; // ~30k tokens equivalent
  }

  // Claude 3 family and other 100k-style models
  if (m.includes('claude-3')) {
    return 100_000;
  }

  // Default for smaller / unknown models
  return 32_000;
}

/**
 * Normalize paths for more reliable comparisons.
 */
function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '');
}

export interface SmartContextDebugEntry {
  path: string;
  score: number;
  length: number;
  included: boolean;
  reason?: string;
}

export interface SmartContextResult {
  files: Record<string, string>;
  debug?: {
    model: string;
    charLimit: number;
    totalChars: number;
    entries: SmartContextDebugEntry[];
  };
}

export interface SmartContextOptions {
  /**
   * If true, returns detailed telemetry about why each file was
   * included or excluded. This is intended for tuning & debugging
   * and should not be enabled in tight token budgets.
   */
  debug?: boolean;
}

export const selectSmartContext = (
  files: Record<string, string>,
  activeFile: string,
  prompt: string,
  model: string,
  options: SmartContextOptions = {}
): SmartContextResult => {
  if (!files || typeof files !== 'object') return { files: {} };

  const debugMode = !!options.debug;
  const charLimit = getCharLimitForModel(model);
  const lowerPrompt = (prompt || '').toLowerCase();
  const normalizedActive = normalizePath(activeFile || '');

  // Pre-normalize infra file list for cheap endsWith checks
  const normalizedInfra = INFRA_FILES.map(normalizePath);

  // Calculate scores
  const scoredFiles: { path: string; content: string; score: number; fileName: string; nameNoExt: string }[] = Object.entries(files).map(
    ([rawPath, rawContent]) => {
      const path = normalizePath(rawPath);
      const content = typeof rawContent === 'string' ? rawContent : String(rawContent ?? '');

      let score = 0;
      const fileName = path.split('/').pop() || '';
      const nameNoExt = fileName.split('.')[0];
      const lowerFileName = fileName.toLowerCase();
      const lowerNameNoExt = nameNoExt.toLowerCase();

      // 1. Active File (Highest Priority)
      if (path === normalizedActive && path.length > 0) {
        score += 100;
      }

      // 2. Explicit Mention in Prompt ("Edit Header.tsx" or "Check Header")
      if (
        (lowerFileName && lowerPrompt.includes(lowerFileName)) ||
        (lowerNameNoExt.length > 3 && lowerPrompt.includes(lowerNameNoExt))
      ) {
        score += 80;
      }

      // 3. Infrastructure Files
      if (normalizedInfra.some((infra) => path.endsWith(infra))) {
        score += 50;
      }

      // 4. Imports / references in Active File (Contextual Relevance)
      if (normalizedActive && files[activeFile]) {
        const activeContent = String(files[activeFile] ?? '');
        // Simple heuristic: if the filename (without ext) appears in the active file's code
        if (nameNoExt.length > 3 && activeContent.includes(nameNoExt) && path !== normalizedActive) {
          score += 30;
        }
      }

      // 5. Source vs Config weighting
      if (path.startsWith('src/')) {
        score += 10;
      }

      return { path: rawPath, content, score, fileName, nameNoExt };
    }
  );

  // Sort: Higher score first, then shorter paths (root files), then alphabetical
  scoredFiles.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.path.length !== b.path.length) return a.path.length - b.path.length;
    return a.path.localeCompare(b.path);
  });

  const selected: Record<string, string> = {};
  const debugEntries: SmartContextDebugEntry[] = [];
  let totalChars = 0;

  for (const file of scoredFiles) {
    const { path, content, score } = file;
    const length = content.length;

    const isVital = score >= 40;
    const isHuge = length > charLimit * 0.5; // single file would consume >50% of budget

    if (isVital && !isHuge) {
      selected[path] = content;
      totalChars += length;
      if (debugMode) {
        debugEntries.push({
          path,
          score,
          length,
          included: true,
          reason: isHuge
            ? 'vital-but-huge (should not happen due to guard)'
            : 'vital (score >= 40)'
        });
      }
      continue;
    }

    if (totalChars + length <= charLimit) {
      selected[path] = content;
      totalChars += length;
      if (debugMode) {
        debugEntries.push({
          path,
          score,
          length,
          included: true,
          reason: 'within remaining charLimit'
        });
      }
    } else if (debugMode) {
      debugEntries.push({
        path,
        score,
        length,
        included: false,
        reason: isHuge
          ? 'excluded: file too large for budget (isHuge)'
          : 'excluded: would exceed charLimit'
      });
    }
  }

  const result: SmartContextResult = { files: selected };

  if (debugMode) {
    result.debug = {
      model,
      charLimit,
      totalChars,
      entries: debugEntries,
    };

    // Lightweight console-based telemetry for tuning in the playground.
    // This is intentionally guarded by debugMode to avoid noisy logs.
    // eslint-disable-next-line no-console
    console.table(
      debugEntries.map((e) => ({
        included: e.included,
        score: e.score,
        length: e.length,
        path: e.path,
        reason: e.reason || ''
      }))
    );
  }

  return result;
};

// ---------------------------------------------------------------------------
// Inline Test Harness (Step 2: basic validation without external test runner)
// ---------------------------------------------------------------------------

function __runSelectSmartContextTests() {
  try {
    const files: Record<string, string> = {
      'src/App.tsx': 'function App() { return <Header />; }',
      'src/Header.tsx': 'export default function Header = () => <div>Header</div>;',
      'README.md': '# Demo',
      'package.json': '{"name":"demo"}',
    };

    const modelsToTest = [
      'gemini-2.5-flash',
      'gpt-4o',
      'claude-3-5-sonnet-20241022',
      'llama3.2',
      'unknown-small-model',
    ];

    // eslint-disable-next-line no-console
    console.group('[SmartContext] getCharLimitForModel sanity checks');
    for (const m of modelsToTest) {
      // eslint-disable-next-line no-console
      console.log(m, '=>', getCharLimitForModel(m));
    }
    // eslint-disable-next-line no-console
    console.groupEnd();

    // Basic scoring behavior: App.tsx should be highest due to activeFile
    const result = selectSmartContext(files, 'src/App.tsx', 'Please edit the Header', 'gpt-4o', {
      debug: true,
    });

    if (!result.files['src/App.tsx']) {
      // eslint-disable-next-line no-console
      console.warn('[SmartContext][Test] Expected src/App.tsx to be selected');
    }
    if (!result.files['src/Header.tsx']) {
      // eslint-disable-next-line no-console
      console.warn('[SmartContext][Test] Expected src/Header.tsx to be selected (referenced + mentioned)');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[SmartContext][Test] Error during inline tests:', e);
  }
}

// Run inline tests only in a non-production, browser-capable environment
if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  __runSelectSmartContextTests();
}
