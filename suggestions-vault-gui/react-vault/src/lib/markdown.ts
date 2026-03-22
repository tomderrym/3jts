import type { Suggestion } from "../types";

/** Same shape as Python `build_record_markdown` (.csil-suggestions payload). */
export function buildRecordMarkdown(s: Suggestion, scanRoot: string): string {
  const lines = [
    "---",
    `csil_id: ${s.id}`,
    `title: ${JSON.stringify(s.title)}`,
    `category: ${s.category}`,
    `source: ${s.source}`,
    `impact: ${s.impact}`,
    `effort: ${s.effort}`,
    "status: vault_record",
    `scan_root: ${scanRoot}`,
    `created_at: ${s.created_at}`,
    "tags:",
    ...s.tags.map((t) => `  - ${t}`),
    "---",
    "",
    `## ${s.title}`,
    "",
    s.short,
    "",
    s.long,
  ];
  return lines.join("\n");
}
