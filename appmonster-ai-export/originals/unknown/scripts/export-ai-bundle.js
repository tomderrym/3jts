#!/usr/bin/env node
/**
 * AppMonster AI State Snapshot — discover, classify, redact, manifest, zip.
 * Mode: export-only (never modifies source files).
 *
 * Usage: node scripts/export-ai-bundle.js [--no-zip]
 *    or: npm run export:ai
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = process.argv.includes("--root")
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : process.cwd();

const NO_ZIP = process.argv.includes("--no-zip");
const EXPORT_NAME = "appmonster-ai-export";
const EXPORT_DIR = path.join(ROOT, EXPORT_NAME);
const ZIP_NAME = `${EXPORT_NAME}.zip`;

const MAX_FILE_BYTES = 2 * 1024 * 1024;

const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".turbo",
  ".venv",
  "venv",
  "__pycache__",
  "target",
  EXPORT_NAME,
]);

const AI_KEYWORDS = [
  "ollama",
  "qwen",
  "openai",
  "anthropic",
  "gemini",
  "claude",
  "llm",
  "langchain",
  "litellm",
  "huggingface",
  "together.ai",
  "groq",
  "model",
  "prompt",
  "systemprompt",
  "system_prompt",
  "temperature",
  "top_p",
  "num_ctx",
  "max_tokens",
  "embedding",
  "vector",
  "chromadb",
  "pinecone",
  "weaviate",
  "supabase",
  "rag",
  "retrieval",
  "agent",
  "tools",
  "function calling",
  "workflow",
  "memory",
  "inference",
  "chatcompletion",
  "completion",
];

const SECRET_KEY_RE =
  /(secret|token|password|passwd|api[_-]?key|auth|credential|private[_-]?key|bearer|jwt|service[_-]?role)/i;

function isIgnoredDirSegment(segment) {
  return IGNORE_DIR_NAMES.has(segment);
}

function pathHasIgnoredDir(fullPath) {
  const parts = fullPath.split(path.sep);
  return parts.some(isIgnoredDirSegment);
}

function shouldConsiderFile(absPath, baseName) {
  const lower = baseName.toLowerCase();
  const ext = path.extname(baseName).toLowerCase();

  if (lower === "modelfile") return true;
  if (lower.startsWith(".env")) return true;
  if (lower.startsWith("docker-compose") && (ext === ".yml" || ext === ".yaml")) return true;
  if (baseName === "compose.yml" || baseName === "compose.yaml") return true;

  const textExt = new Set([
    ".json",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".jsx",
    ".yml",
    ".yaml",
    ".md",
    ".toml",
    ".sql",
  ]);
  if (textExt.has(ext)) return true;

  if (/^(ai|model|prompt|tool|agent|workflow|memory|vector|registry|rag)/i.test(lower) && ext === ".json")
    return true;

  return false;
}

function classify(relPath) {
  const f = relPath.replace(/\\/g, "/").toLowerCase();

  if (f.includes("model") || f.includes("ollama")) return "models";
  if (f.includes("prompt")) return "prompts";
  if (f.includes("tool")) return "tools";
  if (f.includes("agent")) return "agents";
  if (f.includes("workflow") || f.includes("flow")) return "workflows";
  if (f.includes("memory") || f.includes("vector") || f.includes("rag") || f.includes("embed"))
    return "memory";
  if (f.includes("docker") || f.includes("compose") || f.includes("dockerfile")) return "deployment";
  if (f.includes(".env") || f.includes("env.")) return "runtime";
  if (f.includes("migration") || f.includes("schema") || f.endsWith(".sql")) return "database";

  return "unknown";
}

function containsAIKeyword(content) {
  const c = content.toLowerCase();
  return AI_KEYWORDS.some((k) => c.includes(k.toLowerCase()));
}

function redactEnvContent(raw) {
  const lines = raw.split(/\r?\n/);
  return lines
    .map((line) => {
      const t = line.trim();
      if (!t || t.startsWith("#")) return line;
      const eq = t.indexOf("=");
      if (eq === -1) return line;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim();
      const innocent =
        /^(0|1|true|false|development|production|test|localhost|\d+)$/i.test(val) &&
        !SECRET_KEY_RE.test(key);
      if (innocent) return line;
      if (SECRET_KEY_RE.test(key) || /key|secret|token|password|auth/i.test(key))
        return `${key}=REDACTED`;
      if (val.length > 80 || /sk-|Bearer |ghp_|xoxb-|AIza/i.test(val)) return `${key}=REDACTED`;
      return line;
    })
    .join("\n");
}

function safeReadText(absPath) {
  try {
    const st = fs.statSync(absPath);
    if (!st.isFile() || st.size > MAX_FILE_BYTES) return null;
    return fs.readFileSync(absPath, "utf8");
  } catch {
    return null;
  }
}

function scanDir(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full);

    if (ent.isDirectory()) {
      if (isIgnoredDirSegment(ent.name)) continue;
      if (pathHasIgnoredDir(rel)) continue;
      scanDir(full, out);
      continue;
    }

    if (!shouldConsiderFile(full, ent.name)) continue;

    const text = safeReadText(full);
    if (text === null) continue;

    const isEnv = ent.name.startsWith(".env");
    const isModelfile = ent.name === "Modelfile";
    const isCompose =
      ent.name.startsWith("docker-compose") ||
      ent.name === "compose.yml" ||
      ent.name === "compose.yaml";

    if (isEnv || isModelfile || isCompose || containsAIKeyword(text)) {
      out.push({ abs: full, rel: rel.replace(/\\/g, "/"), text, base: ent.name });
    }
  }
}

function prepareExportTree() {
  if (fs.existsSync(EXPORT_DIR)) fs.rmSync(EXPORT_DIR, { recursive: true, force: true });

  const dirs = [
    "originals/models",
    "originals/prompts",
    "originals/tools",
    "originals/agents",
    "originals/workflows",
    "originals/memory",
    "originals/runtime",
    "originals/deployment",
    "originals/database",
    "originals/unknown",
    "normalized/ai",
    "metadata",
    "scripts",
  ];
  for (const d of dirs) fs.mkdirSync(path.join(EXPORT_DIR, d), { recursive: true });
}

function writeNormalizedStubs() {
  const ai = path.join(EXPORT_DIR, "normalized", "ai");
  const models = {
    defaultModel: "qwen2.5:7b",
    models: [
      {
        id: "qwen2.5:7b",
        provider: "ollama",
        baseUrl: "http://127.0.0.1:11434",
        temperature: 0.3,
        top_p: 0.9,
        num_ctx: 8192,
        systemPromptRef: "default-builder",
      },
    ],
  };
  fs.writeFileSync(path.join(ai, "models.json"), JSON.stringify(models, null, 2), "utf8");
  fs.writeFileSync(
    path.join(ai, "README.md"),
    [
      "# Normalized bundle (stubs)",
      "",
      "These files are **templates** generated at export time.",
      "Merge values from `originals/**` manually or in a future normalizer pass.",
      "",
    ].join("\n"),
    "utf8"
  );
}

function buildDuplicates(manifest) {
  const byBase = new Map();
  for (const m of manifest) {
    const b = path.basename(m.relativePath);
    if (!byBase.has(b)) byBase.set(b, []);
    byBase.get(b).push(m);
  }
  const groups = [];
  for (const [basename, files] of byBase) {
    if (files.length < 2) continue;
    groups.push({
      basename,
      files: files.map((f, i) => ({
        path: f.relativePath,
        category: f.category,
        confidence: Math.max(0.5, 0.95 - i * 0.05),
        status: i === 0 ? "primary_candidate" : "secondary_candidate",
      })),
    });
  }
  return groups;
}

function writePullModelScript() {
  const sh = `#!/usr/bin/env bash
set -euo pipefail
# Pull Ollama model (does not bundle the blob in the zip)
ollama pull qwen2.5:7b
`;
  const p = path.join(EXPORT_DIR, "scripts", "pull-model.sh");
  fs.writeFileSync(p, sh, "utf8");
  try {
    fs.chmodSync(p, 0o755);
  } catch {
    /* windows */
  }

  const ps1 = `# Pull Ollama model (Windows)
ollama pull qwen2.5:7b
`;
  fs.writeFileSync(path.join(EXPORT_DIR, "scripts", "pull-model.ps1"), ps1, "utf8");
}

function writeExportReadme(manifest) {
  const body = [
    "# AppMonster AI export bundle",
    "",
    "- `originals/` — copies of discovered files (**.env* redacted**).",
    "- `normalized/ai/` — starter **models.json** stub; edit to match your app.",
    "- `metadata/duplicates.json` — same basename, different paths.",
    "- `manifest.json` / `manifest.md` — full file list.",
    "- `scripts/pull-model.sh` — `ollama pull qwen2.5:7b` (no model in zip).",
    "",
    "## Restore (outline)",
    "",
    "1. Copy needed files from `originals/<category>/` into your project.",
    "2. Run `pull-model.sh` if using Ollama.",
    "3. Do **not** commit real `.env`; use `.env.example` patterns only.",
    "",
    `Files captured: **${manifest.length}**`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(EXPORT_DIR, "README.md"), body, "utf8");
}

function main() {
  console.log("ROOT:", ROOT);
  console.log("Scanning for AI-related files…");

  const found = [];
  scanDir(ROOT, found);
  console.log(`Candidates (content match): ${found.length}`);

  prepareExportTree();
  writeNormalizedStubs();
  writePullModelScript();

  const manifest = [];

  for (const item of found) {
    const category = classify(item.rel);
    const destRel = path.join("originals", category, item.rel);
    const destAbs = path.join(EXPORT_DIR, destRel);
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });

    let body = item.text;
    if (item.base.startsWith(".env")) body = redactEnvContent(body);

    fs.writeFileSync(destAbs, body, "utf8");

    manifest.push({
      relativePath: item.rel,
      category,
      exportPath: destRel.replace(/\\/g, "/"),
      bytes: Buffer.byteLength(body, "utf8"),
    });
  }

  manifest.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  fs.writeFileSync(path.join(EXPORT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  const dup = buildDuplicates(manifest);
  fs.writeFileSync(path.join(EXPORT_DIR, "metadata", "duplicates.json"), JSON.stringify(dup, null, 2), "utf8");

  const mdLines = [
    "# AI export manifest",
    "",
    "| Category | Source (relative) | Export path |",
    "|----------|-------------------|-------------|",
    ...manifest.map(
      (m) => `| ${m.category} | \`${m.relativePath}\` | \`${m.exportPath}\` |`
    ),
    "",
    "## Duplicate basenames",
    "",
    dup.length ? JSON.stringify(dup, null, 2) : "_None_",
    "",
  ];
  fs.writeFileSync(path.join(EXPORT_DIR, "manifest.md"), mdLines.join("\n"), "utf8");

  writeExportReadme(manifest);

  if (NO_ZIP) {
    console.log("Skipping zip (--no-zip). Output:", EXPORT_DIR);
    return;
  }

  const zipPath = path.join(ROOT, ZIP_NAME);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log("Writing", ZIP_NAME, "…");
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  const done = new Promise((resolve, reject) => {
    output.on("close", resolve);
    archive.on("error", reject);
  });

  archive.pipe(output);
  archive.directory(EXPORT_DIR, EXPORT_NAME);
  archive.finalize();

  done
    .then(() => {
      console.log("Done:", zipPath, `(${archive.pointer()} bytes)`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

main();
