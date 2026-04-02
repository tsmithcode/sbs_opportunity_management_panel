import {
  ActorType,
  ApprovalState,
  CheckpointDecision,
  ConfidenceLevel,
  EscalationStatus,
  EscalationType,
  EventType,
  MemoType,
  OpportunityStage,
  RiskLevel,
  TaskStatus,
} from "./common";

export type StageEvent = {
  event_id: string;
  opportunity_id: string;
  stage: OpportunityStage;
  event_type: EventType;
  actor_type: ActorType;
  actor_id: string;
  event_timestamp: string;
  notes: string;
};

export type AICheckpoint = {
  checkpoint_id: string;
  opportunity_id: string;
  stage: OpportunityStage;
  step_name: string;
  trigger_reason: string;
  decision: CheckpointDecision;
  confidence_level: ConfidenceLevel;
  evidence_summary: string;
  policy_risk: RiskLevel;
  truthfulness_risk: RiskLevel;
  human_review_required: boolean;
  assigned_reviewer_role: string;
  created_at: string;
};

export type WorkflowTask = {
  task_id: string;
  opportunity_id: string;
  task_type: string;
  owner_role: string;
  owner_id: string;
  due_at: string;
  status: TaskStatus;
  blocking: boolean;
  created_at: string;
};

export type Escalation = {
  escalation_id: string;
  opportunity_id: string;
  escalation_type: EscalationType;
  severity: "low" | "medium" | "high" | "critical";
  owner_role: string;
  status: EscalationStatus;
  resolution_notes: string;
  created_at: string;
};

export type DecisionMemo = {
  memo_id: string;
  opportunity_id: string;
  memo_type: MemoType;
  status: ApprovalState;
  summary: string;
  confidence_level: ConfidenceLevel;
  human_approved: boolean;
  created_at: string;
};

export type ReportingSnapshot = {
  snapshot_id: string;
  account_id: string;
  use_case_id: string;
  period_start: string;
  period_end: string;
  active_opportunities: number;
  intake_completion_rate: number;
  fit_review_completion_rate: number;
  approval_rate: number;
  escalation_rate: number;
  user_trust_score: number;
  created_at: string;
};

export type OutcomeMetadata = {
  outcome_id: string;
  opportunity_id: string;
  resolution: "awarded" | "denied" | "withdrawn";
  lessons_learned: string;
  market_intelligence: string;
  content_potential: "low" | "medium" | "high";
  blog_article_generated: boolean;
  updated_at: string;
};
