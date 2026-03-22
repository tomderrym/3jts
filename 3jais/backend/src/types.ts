export type Tier = "low" | "medium" | "high";

export type Suggestion = {
  id: string;
  title: string;
  short: string;
  long: string;
  category: "reliability" | "performance" | "security" | "feature";
  source: "ai_generated" | "user_feedback" | "scanner_agent";
  impact: Tier;
  effort: Tier;
  confidence: number;
  businessValue: Tier;
  risk: Tier;
  complexity: Tier;
  status: "pending" | "approved" | "rejected" | "applied";
  tags: string[];
  created_at: string;
  priorityScore?: number;
  applied_commit?: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  type: "product" | "business" | "technical";
  successMetrics: { metric: string; target: number }[];
  priority: number;
  active: boolean;
};

export type Constraint = {
  id: string;
  rule: string;
  type: "hard" | "soft";
  category: "code" | "ux" | "business" | "system";
};

export type FlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
};

export type SavedFlow = {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  updatedAt: string;
};
