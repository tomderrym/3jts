import type { Suggestion, Tier } from "../types.js";

const SCORE: Record<Tier, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function calculatePriority(s: Suggestion): number {
  const impact = SCORE[s.impact];
  const business = SCORE[s.businessValue];
  const effort = Math.max(SCORE[s.effort], 0.5);
  const risk = Math.max(SCORE[s.risk], 0.5);
  const complexity = Math.max(SCORE[s.complexity], 0.5);
  const conf = Math.min(Math.max(s.confidence, 0.05), 1);

  const score = (impact * business * conf) / (effort * risk * complexity);
  return Number(score.toFixed(3));
}

export function withPriorityScores(suggestions: Suggestion[]): Suggestion[] {
  return suggestions.map((s) => ({
    ...s,
    priorityScore: calculatePriority(s),
  }));
}

export function rankSuggestions(vault: Suggestion[]): Suggestion[] {
  return [...withPriorityScores(vault)].sort(
    (a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0)
  );
}
