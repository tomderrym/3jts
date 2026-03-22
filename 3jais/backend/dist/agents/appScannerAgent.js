import { invokeTool } from "../tools/toolRegistry.js";
/**
 * First "real" agent: uses MCP-style tools only (no free-form shell).
 * Produces vault-ready suggestions from workspace signals.
 */
export async function runAppScannerAgent(workspaceRoot) {
    const suggestions = [];
    const now = new Date().toISOString();
    const tree = (await invokeTool("scan_workspace", { root: workspaceRoot, maxDepth: 2 }, workspaceRoot));
    const hasLockfile = tree.some((t) => t.type === "file" &&
        /^(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb)$/i.test(t.path));
    const hasPkg = tree.some((t) => t.type === "file" && t.path === "package.json");
    if (hasPkg && !hasLockfile) {
        suggestions.push({
            id: `scan_${Date.now()}_lock`,
            title: "Add a dependency lockfile",
            short: "package.json without lockfile detected",
            long: "Scanner found package.json but no common lockfile. Pin versions for reproducible installs.",
            category: "reliability",
            source: "scanner_agent",
            impact: "medium",
            effort: "low",
            confidence: 0.78,
            businessValue: "high",
            risk: "low",
            complexity: "low",
            status: "pending",
            tags: ["dependencies", "nodejs"],
            created_at: now,
        });
    }
    let gitOut = "";
    try {
        gitOut = String(await invokeTool("git_status", { repoRoot: workspaceRoot }, workspaceRoot));
    }
    catch {
        gitOut = "";
    }
    if (gitOut.trim().length > 0) {
        const lines = gitOut.trim().split("\n").length;
        if (lines > 30) {
            suggestions.push({
                id: `scan_${Date.now()}_git`,
                title: "Reduce working tree churn",
                short: `${lines}+ changed paths in git status`,
                long: "Large dirty working tree increases merge and review risk. Consider batching commits or stashing.",
                category: "reliability",
                source: "scanner_agent",
                impact: "medium",
                effort: "medium",
                confidence: 0.62,
                businessValue: "medium",
                risk: "low",
                complexity: "low",
                status: "pending",
                tags: ["git", "workflow"],
                created_at: now,
            });
        }
    }
    try {
        const readme = await invokeTool("read_file", { path: "README.md", maxBytes: 4000 }, workspaceRoot);
        if (typeof readme === "string" && readme.length < 80) {
            suggestions.push({
                id: `scan_${Date.now()}_readme`,
                title: "Expand README",
                short: "README is very short or empty",
                long: "A minimal README hurts onboarding. Document setup, scripts, and architecture pointers.",
                category: "feature",
                source: "scanner_agent",
                impact: "low",
                effort: "low",
                confidence: 0.7,
                businessValue: "medium",
                risk: "low",
                complexity: "low",
                status: "pending",
                tags: ["docs", "onboarding"],
                created_at: now,
            });
        }
    }
    catch {
        suggestions.push({
            id: `scan_${Date.now()}_readme_missing`,
            title: "Add README.md",
            short: "No readable README at repo root",
            long: "Scanner could not read README.md. Add root documentation.",
            category: "feature",
            source: "scanner_agent",
            impact: "medium",
            effort: "low",
            confidence: 0.75,
            businessValue: "medium",
            risk: "low",
            complexity: "low",
            status: "pending",
            tags: ["docs"],
            created_at: now,
        });
    }
    return suggestions;
}
