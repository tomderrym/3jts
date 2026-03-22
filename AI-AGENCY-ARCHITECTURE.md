# AI Agency Architecture — Canonical Spec

This document consolidates the intent of `ai-agent-plan-1-prompt.md`, `ai-agent-plan-2-prompt.md`, and `ai-agenrt-plan-3-prompt.md` into **one** reference. It is the **source of truth** for how a world-class, **governed** autonomous agency should work. Legacy prompt files may contain examples and repetition; prefer **this file** when implementing or onboarding.

---

## 1. Vision

Build an **AI agency**: systems that deliver ongoing value (leads, support, ops, code, content) with **high reliability**, **auditability**, and **controlled evolution** — not unbounded self-modification.

**Non-goals:** Silent production changes, unreviewed prompt drift, or “autonomy” that bypasses policy and rollback.

---

## 2. Design Principles

| Principle | Meaning |
|-----------|---------|
| **Governed autonomy** | Automate discovery, drafting, routing, retries. **Gate** external impact, spend, and prod changes behind approval or policy. |
| **Vault-first change** | Every proposed improvement is a **Suggestion** with metadata — never raw mutation of live behavior without a record. |
| **Evidence-based improvement** | “Self-improving” means **measure → decide → keep or revert**, with logs. |
| **Skills + tools** | Cognition (plans, vault) must connect to a **capability plane** (skills, MCP-style tools) or nothing ships. |
| **Portability** | Config, prompts, tool registry, and model routing are **exportable**; model **weights** are not required in bundles (e.g. Ollama `pull`). |

---

## 3. Controlled Self-Improvement Loop (CSIL)

Single canonical loop (do not duplicate elsewhere in docs):

```
Observe → Suggest → Store (Vault) → [Human/Policy Approve] → Apply (scoped) → Measure → Learn → [Rollback optional]
```

- **Observe:** Telemetry, logs, costs, latency, failures, repo/code patterns (Scanner).
- **Suggest:** Structured proposals with impact, effort, confidence, category (Vault entries).
- **Store:** Immutable history of suggestions and state transitions.
- **Approve:** Human architect or automated policy **only where explicitly allowed**.
- **Apply:** Branch, sandbox, or config version — with diff visibility where possible (Deployment).
- **Measure:** Before/after KPIs or quality checks (Evaluator).
- **Learn:** Update playbooks, prompts, tool choice — **versioned**; failed experiments stay in the log.

---

## 4. Suggestions Vault

### 4.1 Purpose

The vault is the **global change queue** (analogous to a disciplined PR queue). Nothing that matters should “just happen” without appearing here first.

### 4.2 Suggestion Schema (conceptual)

| Field | Role |
|-------|------|
| `id` | Stable identifier |
| `title` / `short` / `long` | Human and machine-readable description |
| `category` | e.g. reliability, performance, security, feature |
| `source` | e.g. ai_generated, user_feedback, scanner_agent |
| `confidence` | 0–1, for triage |
| `impact` / `effort` | ROI-style prioritization |
| `status` | pending → approved → rejected → applied (and optional intermediate states) |
| `tags` | Discovery and filtering |
| `created_at` | Audit |
| `applied_commit` / `git_branch` | Optional Git linkage after deploy |

### 4.3 State semantics

- **pending:** Awaiting review.
- **approved:** Cleared to apply under current policy; may show **diff or payload preview**.
- **applied:** Integrated in a tracked way (commit, branch, or config version).
- **rejected:** Dismissed; remains in history.

**Rollback** is a first-class concept: reverting applied changes when evaluation fails or risk appears.

---

## 5. Agent & Role Model

Roles can be separate services or logical modules; names align with your original curriculum.

| Role | Responsibility |
|------|----------------|
| **Scanner** | Observes systems and repos; proposes vault items (patterns, risks, opportunities). |
| **Planner / Orchestrator** | Decomposes goals; selects skills and tools; respects policy. |
| **Executor** | Runs tools with least privilege; no extra scope. |
| **Deployment** | Applies **approved** suggestions in a safe path (branch, PR, staged rollout). |
| **Evaluator** | Post-change metrics and quality gates; triggers rollback or follow-up suggestions. |
| **Human architect** | Final authority for high-risk or ambiguous approvals (until policy encodes them). |

---

## 6. Capability Plane — Skills & Tools

Plan 2’s missing layer: **cognition without execution is incomplete.**

### 6.1 Skills

Reusable, composable **capabilities** (e.g. “scan repo”, “draft email”, “update ticket”, “run tests”). Skills are **policy-aware** and map to one or more tools.

### 6.2 Tools (MCP-style)

Concrete **interfaces**: name, description, input/output schema, **risk class**, whether **approval** is required. Tools are the only path to side effects (filesystem, network, payments, customer data).

### 6.3 Agent binding

An **agent** = role + allowed skills + allowed tools + goal template. Sales, support, and code agents differ by **binding**, not by a vague “personality.”

---

## 7. Commercial & Product Framing (condensed from market plans)

High-demand agent **types** (prioritize **one vertical** first, then expand):

1. Sales & lead generation  
2. Marketing / content  
3. Customer support / chat  
4. Productivity & workflow automation  
5. Code / dev assistance  
6. Analytics & forecasting  
7. Personal / consumer assistants  
8. Creative / design  
9. Legal / compliance assistance (high bar for claims)  
10. Financial / investment assistance (high bar for claims)

**What sells:** clear ROI, integrations (CRM, email, Slack, Shopify, etc.), automation depth, auditability, and **human override**.

This architecture supports those products **without** conflating “marketable” with “unsafe autonomy.”

---

## 8. Implementation Alignment (this repository)

| Piece | Location / note |
|-------|------------------|
| Vault UI + scan + Git record | `suggestions-vault-gui/` — implements vault workflow, folder/React heuristics, Git branch + `.csil-suggestions/` commits, rollback via branch delete. |
| AI bundle export | `scripts/export-ai-bundle.js` — discovers AI-related files, redacts env, manifest + zip. |
| Legacy narrative & examples | `ai-agent-plan-1-prompt.md`, `ai-agent-plan-2-prompt.md`, `ai-agenrt-plan-3-prompt.md` — historical; **canonical spec is this file**. |
| External pointers | `REFERENCES.md` — skills/MCP ecosystems and example products. |

**Next implementation priorities (suggested):**

1. **Policy engine:** which suggestion types auto-approve in sandbox only.  
2. **Tool registry JSON** + mapping from approved suggestions to allowed tool calls.  
3. **Evaluator metrics** persisted (even a JSONL log) instead of UI-only mock.  
4. **Memory/RAG** only from **approved** documents and runbooks.

---

## 9. Phased Roadmap

| Phase | Deliverable |
|-------|-------------|
| **P0** | One client vertical + one measurable KPI. |
| **P1** | Vault + Git (or equivalent audit) for all material changes — **done in prototype form** in `suggestions-vault-gui`. |
| **P2** | Tool registry + skill wrappers; executor with rate limits and secrets handling. |
| **P3** | Scanner tied to **real** telemetry + repo signals; dedupe and confidence calibration. |
| **P4** | Evaluator with stored metrics and rollback playbooks. |
| **P5** | Multi-tenant / agency packaging (if selling managed agents). |

---

## 10. Sample Artifacts (minimal)

**Suggestion (JSON):**

```json
{
  "id": "sug_scan_retry_01",
  "title": "Add exponential backoff to job runner",
  "short": "Reduce failure storms on transient errors",
  "long": "Observed burst retries; propose backoff+jitter on worker dispatch.",
  "category": "reliability",
  "source": "scanner_agent",
  "confidence": 0.84,
  "impact": "high",
  "effort": "medium",
  "status": "pending",
  "tags": ["workers", "resilience"]
}
```

**Model routing (excerpt):**

```json
{
  "defaultModel": "qwen2.5:7b",
  "models": [{
    "id": "qwen2.5:7b",
    "provider": "ollama",
    "baseUrl": "http://127.0.0.1:11434",
    "temperature": 0.3,
    "top_p": 0.9,
    "num_ctx": 8192
  }]
}
```

**Tool sketch:**

```json
{
  "name": "create_git_branch",
  "risk": "medium",
  "requires_approval": true,
  "description": "Create branch from approved suggestion id"
}
```

---

## 11. Maintenance

- When updating architecture, **edit this file** and add a one-line note at the bottom (date + summary).  
- Prefer **splitting** huge prompt dumps into appendices rather than duplicating CSIL in multiple `.md` files.  
- Rename `ai-agenrt-plan-3-prompt.md` → `ai-agent-plan-3-prompt.md` when convenient (typo fix); update any links.

---

*Canonical version: initial consolidation from internal plans 1–3. Maintain in-repo as the single architecture reference.*
