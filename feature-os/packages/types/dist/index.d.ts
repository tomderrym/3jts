/**
 * JSON-oriented types for ingestion, diff payloads, and API boundaries.
 * DB truth lives in Prisma / schema.sql — keep these aligned when evolving.
 */
export type ImportanceLevel = "critical" | "high" | "medium" | "optional";
export type FeatureCategory = "ui" | "state" | "api" | "ai" | "system" | "routing" | "auth" | "builder" | "runtime" | "learning" | "reporting" | "other";
export type SnippetType = "hook" | "component" | "util" | "flow" | "config" | "other";
export type VaultStatus = "draft" | "candidate" | "proven" | "deprecated" | "rejected";
export type DiffKind = "content_change" | "formatting_change" | "type_change" | "structure_change" | "semantic_change" | "unknown";
export interface ReportFormatting {
    bold_phrases?: string[];
    italic_phrases?: string[];
    bullet_points?: string[];
    tables?: unknown[];
    images?: string[];
}
export interface ReportSectionSchema {
    section_name: string;
    section_type: "overview" | "defects" | "recommendations" | "photos" | "notes" | "other";
    content: string;
    formatting?: ReportFormatting;
}
export interface ParsedReportSchema {
    report_id?: string;
    inspection_date?: string;
    property_address?: string;
    sections: ReportSectionSchema[];
    metadata?: {
        author?: string;
        word_count?: number;
        style_vector?: number[];
    };
}
export interface CoreSnippet {
    name: string;
    code: string;
    type: SnippetType;
    tested: boolean;
}
export interface TestCaseSchema {
    scenario: string;
    expected_result?: string;
    status: "pass" | "fail" | "pending" | "skipped";
}
export interface FailureConditionSchema {
    issue: string;
    cause?: string;
    impact?: string;
}
export interface ChecklistEntrySchema {
    item: string;
    status: "pending" | "done" | "waived";
}
/** Master feature blueprint (vault + failure intelligence). */
export interface FeatureBlueprintSchema {
    feature_id: string;
    feature_name: string;
    category: FeatureCategory;
    description?: string;
    importance_level: ImportanceLevel;
    dependencies?: string[];
    core_snippets?: CoreSnippet[];
    test_cases?: TestCaseSchema[];
    failure_conditions?: FailureConditionSchema[];
    performance_notes?: string[];
    checklist?: ChecklistEntrySchema[];
    ai_learning?: {
        usage_frequency: number;
        success_rate: number;
        last_used?: string;
    };
}
export interface DiffItemPayload {
    kind: DiffKind;
    path?: string;
    old?: unknown;
    new?: unknown;
    note?: string;
}
export type ValidationDecision = "REJECT" | "OPTIMIZE" | "PROMOTE_TO_DEFAULT" | "STANDARDIZE" | "REVIEW";
export interface FeatureScorecard {
    readability: number;
    performance: number;
    reusability: number;
    stability: number;
}
/**
 * Switch-style evaluation — use AFTER tests/scores exist (stability-first).
 */
export declare function evaluateFeature(input: {
    importance_level: ImportanceLevel;
    test_passed: boolean;
    performance_score: number;
    success_rate: number;
    usage_frequency: number;
}): ValidationDecision;
/** Route diff kinds to learning handlers (implementations elsewhere). */
export type DiffLearningHandler = (payload: DiffItemPayload) => void;
export declare function routeDiffForLearning(diff: DiffItemPayload, handlers: Partial<Record<DiffKind, DiffLearningHandler>>): void;
