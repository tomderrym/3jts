-- Feature Operating System — PostgreSQL + pgvector
-- Run: psql $DATABASE_URL -f schema/001_init.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ---------------------------------------------------------------------------
-- Core: validated feature capabilities (app builder + optional report domain)
-- ---------------------------------------------------------------------------

CREATE TYPE importance_level AS ENUM ('critical', 'high', 'medium', 'optional');
CREATE TYPE feature_category AS ENUM (
  'ui', 'state', 'api', 'ai', 'system',
  'routing', 'auth', 'builder', 'runtime', 'learning', 'reporting', 'other'
);
CREATE TYPE snippet_type AS ENUM ('hook', 'component', 'util', 'flow', 'config', 'other');
CREATE TYPE validation_status AS ENUM ('pending', 'pass', 'fail', 'skipped');
CREATE TYPE vault_status AS ENUM ('draft', 'candidate', 'proven', 'deprecated', 'rejected');
CREATE TYPE diff_kind AS ENUM (
  'content_change', 'formatting_change', 'type_change', 'structure_change', 'semantic_change', 'unknown'
);

CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category feature_category NOT NULL DEFAULT 'other',
  description TEXT,
  importance importance_level NOT NULL DEFAULT 'medium',
  vault_status vault_status NOT NULL DEFAULT 'draft',
  react_version_min TEXT,
  react_version_max TEXT,
  usage_frequency INT NOT NULL DEFAULT 0,
  success_rate NUMERIC(5, 4),
  last_used_at TIMESTAMPTZ,
  promoted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE feature_dependencies (
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  depends_on_feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (feature_id, depends_on_feature_id),
  CONSTRAINT feature_dependencies_no_self CHECK (feature_id <> depends_on_feature_id)
);

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  snippet_type snippet_type NOT NULL DEFAULT 'other',
  code TEXT NOT NULL,
  tested BOOLEAN NOT NULL DEFAULT false,
  test_coverage_pct NUMERIC(5, 2),
  performance_score SMALLINT CHECK (performance_score BETWEEN 0 AND 10),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feature_id, name)
);

CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL,
  expected_result TEXT,
  status validation_status NOT NULL DEFAULT 'pending',
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE failure_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  issue TEXT NOT NULL,
  cause TEXT,
  impact TEXT,
  severity importance_level NOT NULL DEFAULT 'high',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'waived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE performance_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- App blueprints (full-app checklist + linked features)
-- ---------------------------------------------------------------------------

CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blueprint_features (
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  required BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  PRIMARY KEY (blueprint_id, feature_id)
);

-- ---------------------------------------------------------------------------
-- Inspection / report domain (structured report → diff → learn)
-- ---------------------------------------------------------------------------

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT,
  source_filename TEXT,
  inspection_date DATE,
  property_address TEXT,
  raw_schema JSONB NOT NULL DEFAULT '{}',
  author TEXT,
  word_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE report_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN (
    'overview', 'defects', 'recommendations', 'photos', 'notes', 'other'
  )),
  content TEXT,
  formatting JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Diff engine output (switch-case friendly: kind enum + payload)
-- ---------------------------------------------------------------------------

CREATE TABLE diff_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_type TEXT NOT NULL CHECK (run_type IN ('report_pair', 'feature_pair', 'blueprint', 'snippet_variant')),
  left_report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  right_report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  left_feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
  right_feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
  score_completeness NUMERIC(5, 2),
  score_tone NUMERIC(5, 2),
  score_format NUMERIC(5, 2),
  summary JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE diff_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diff_run_id UUID NOT NULL REFERENCES diff_runs(id) ON DELETE CASCADE,
  kind diff_kind NOT NULL,
  path TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  weighted_score NUMERIC(6, 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Learning signals (human-in-the-loop; no silent auto-mutation)
-- ---------------------------------------------------------------------------

CREATE TABLE learning_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'approval', 'rejection', 'edit_style', 'edit_content', 'promote', 'demote', 'diff_feedback'
  )),
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Embeddings (pgvector) — reference chunks, not raw secrets
-- ---------------------------------------------------------------------------

CREATE TABLE embedding_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL CHECK (source_type IN ('report_section', 'snippet', 'feature_doc', 'blueprint')),
  source_id UUID NOT NULL,
  chunk_index INT NOT NULL DEFAULT 0,
  text_content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id, chunk_index)
);

CREATE INDEX idx_embedding_chunks_vector ON embedding_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ---------------------------------------------------------------------------
-- Validation runs (CI / sandbox / manual)
-- ---------------------------------------------------------------------------

CREATE TABLE validation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  pipeline TEXT NOT NULL DEFAULT 'default',
  status validation_status NOT NULL DEFAULT 'pending',
  scores JSONB NOT NULL DEFAULT '{}',
  log_uri TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_features_updated
  BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE PROCEDURE touch_updated_at();

CREATE TRIGGER tr_blueprints_updated
  BEFORE UPDATE ON blueprints
  FOR EACH ROW EXECUTE PROCEDURE touch_updated_at();
