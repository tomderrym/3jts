"use strict";
/**
 * JSON-oriented types for ingestion, diff payloads, and API boundaries.
 * DB truth lives in Prisma / schema.sql — keep these aligned when evolving.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFeature = evaluateFeature;
exports.routeDiffForLearning = routeDiffForLearning;
/**
 * Switch-style evaluation — use AFTER tests/scores exist (stability-first).
 */
function evaluateFeature(input) {
    if (input.importance_level === "critical" && !input.test_passed)
        return "REJECT";
    if (input.performance_score < 6)
        return "OPTIMIZE";
    if (input.success_rate > 0.9)
        return "PROMOTE_TO_DEFAULT";
    if (input.usage_frequency > 50)
        return "STANDARDIZE";
    return "REVIEW";
}
function routeDiffForLearning(diff, handlers) {
    const fn = handlers[diff.kind] ?? handlers.unknown;
    fn?.(diff);
}
