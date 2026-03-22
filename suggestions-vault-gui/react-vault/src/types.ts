export type Tier = "low" | "medium" | "high";

export type SuggestionStatus = "pending" | "approved" | "rejected" | "applied";

/** Matches Python `main.py` Suggestion; optional fields when talking to 3jAIS API */
export type Suggestion = {
  id: string;
  title: string;
  short: string;
  long: string;
  category: string;
  source: string;
  confidence: number;
  impact: Tier;
  effort: Tier;
  status: SuggestionStatus;
  tags: string[];
  created_at: string;
  applied_commit?: string | null;
  git_branch?: string | null;
  /** 3jAIS extras */
  priorityScore?: number;
  businessValue?: Tier;
  risk?: Tier;
  complexity?: Tier;
  _canApprove?: { ok: boolean; reasons: string[] };
};

export type TraceEntry = {
  id: string;
  t: number;
  kind: "system" | "tool" | "plan" | "human";
  title: string;
  detail: string;
};
