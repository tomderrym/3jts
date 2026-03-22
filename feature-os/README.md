# Feature Operating System (FOS)

Validated **feature vault** + **app blueprints** + **report schema** + **diff runs** + **learning signals**. Aligns with `AI-AGENCY-ARCHITECTURE.md`: human-in-the-loop, stability before autonomous optimization.

## Layout

```
feature-os/
  schema/001_init.sql      # PostgreSQL + pgvector (source of truth for extensions)
  prisma/schema.prisma    # Prisma mirror (embedding_chunks table SQL-only — use $queryRaw)
  packages/types/         # Shared TS types + evaluateFeature() switch helper
  apps/api/               # Minimal API stub (Phase 1)
```

## Database: two ways to start

**A — Raw SQL (includes `vector` + `embedding_chunks`)**

```bash
psql "$DATABASE_URL" -f schema/001_init.sql
```

**B — Prisma only (dev speed; add pgvector via SQL migration later)**

```bash
cd feature-os
cp .env.example .env
pnpm install   # or npm install
npx prisma db push --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

Do **not** blindly mix A then B on the same DB without aligning enums — pick one bootstrap path or use Prisma migrations generated from the SQL.

## Phases (recommended)

1. **Migrations + feature CRUD + blueprint CRUD** (+ vault UI later).
2. **Validation worker** (test/typecheck/lint) → `validation_runs` scorecards → manual promote/reject.
3. **Diff lab** (`diff_runs` / `diff_items`) + `learning_signals` (no silent prompt mutation).

## pgvector

`embedding_chunks.embedding` is `vector(1536)` in SQL. Query similarity with raw SQL after chunks exist.

## Related repo docs

- `AI-AGENCY-ARCHITECTURE.md`
- `suggestions-vault-gui/` (CSIL-style vault prototype)
