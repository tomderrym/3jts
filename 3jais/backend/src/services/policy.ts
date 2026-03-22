import type { Constraint, Goal, Suggestion } from "../types.js";

export function isAlignedWithGoals(suggestion: Suggestion, goals: Goal[]): boolean {
  const active = goals.filter((g) => g.active);
  if (active.length === 0) return true;
  const tags = (suggestion.tags ?? []).map((t) => t.toLowerCase());
  const title = suggestion.title.toLowerCase();
  const short = suggestion.short.toLowerCase();
  return active.some((goal) => {
    const gt = goal.title.toLowerCase();
    const gd = goal.description.toLowerCase();
    return (
      tags.some((tag) => gt.includes(tag) || gd.includes(tag) || tag.includes(gt.slice(0, 6))) ||
      title.includes(gt.slice(0, 8)) ||
      gd.split(/\s+/).some((w) => w.length > 4 && (title.includes(w) || short.includes(w)))
    );
  });
}

export function violatesConstraints(
  suggestion: Suggestion,
  constraints: Constraint[]
): { violated: boolean; rules: Constraint[] } {
  const hard = constraints.filter((c) => c.type === "hard");
  const title = suggestion.title.toLowerCase();
  const long = suggestion.long.toLowerCase();
  const hit: Constraint[] = [];

  for (const rule of hard) {
    const r = rule.rule.toLowerCase();
    if (r.includes("duplicate") && (title.includes("duplicate") || long.includes("duplicate"))) {
      hit.push(rule);
    }
    if (r.includes("no auto") && suggestion.source === "ai_generated" && title.includes("auto-apply")) {
      hit.push(rule);
    }
  }

  return { violated: hit.length > 0, rules: hit };
}

export function canApprove(
  s: Suggestion,
  goals: Goal[],
  constraints: Constraint[]
): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const score = s.priorityScore ?? 0;
  if (score <= 0.5) reasons.push(`priorityScore ${score} ≤ 0.5`);
  if (!isAlignedWithGoals(s, goals)) reasons.push("not aligned with active goals");
  const { violated, rules } = violatesConstraints(s, constraints);
  if (violated) reasons.push(`hard constraint: ${rules.map((x) => x.id).join(", ")}`);
  return { ok: reasons.length === 0, reasons };
}
