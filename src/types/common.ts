export type AccountType =
  | "individual"
  | "enterprise"
  | "government"
  | "education"
  | "workforce_program";

export type SponsorshipType =
  | "self_serve"
  | "organization_sponsored"
  | "managed_service";

export type OpportunityStage =
  | "intake_started"
  | "intake_complete"
  | "fit_review"
  | "positioning"
  | "outreach_ready"
  | "interview_active"
  | "debrief_captured"
  | "offer_review"
  | "closed_won"
  | "closed_lost";

export type OpportunityStatus =
  | "active"
  | "paused"
  | "closed_won"
  | "closed_lost"
  | "withdrawn";

export type OpportunityPathway = "w2" | "1099";

export type ArtifactType =
  | "resume"
  | "job_description"
  | "message"
  | "note"
  | "offer"
  | "debrief"
  | "generated_output"
  | "sow"
  | "proposal"
  | "rate_sheet"
  | "other";

export type ReviewStatus =
  | "unreviewed"
  | "user_reviewed"
  | "approved"
  | "rejected"
  | "archived";

export type ParseStatus =
  | "pending"
  | "complete"
  | "failed"
  | "not_applicable";

export type EventType =
  | "created"
  | "updated"
  | "advanced"
  | "paused"
  | "approved"
  | "rejected"
  | "escalated"
  | "completed";

export type ActorType = "user" | "staff" | "ai_agent" | "system";

export type CheckpointDecision =
  | "proceed"
  | "proceed_with_warning"
  | "pause_for_input"
  | "escalate_for_review"
  | "block";

export type ConfidenceLevel = "low" | "medium" | "high";

export type RiskLevel = "none" | "low" | "medium" | "high";

export type TaskStatus =
  | "open"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

export type EscalationType =
  | "product"
  | "accessibility"
  | "security"
  | "privacy"
  | "legal"
  | "policy"
  | "finance"
  | "support"
  | "delivery";

export type EscalationStatus = "open" | "under_review" | "resolved" | "closed";

export type MemoType =
  | "fit"
  | "pursuit"
  | "positioning"
  | "interview"
  | "offer"
  | "final";

export type ApprovalState =
  | "draft"
  | "review"
  | "approved"
  | "rejected"
  | "archived";

export type CorrespondenceStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "scheduled"
  | "sent"
  | "archived";

export type AppMode = "user" | "staff" | "admin";

export type SensitiveSupportType =
  | "layoff"
  | "fired"
  | "quit_without_notice"
  | "criminal_history"
  | "reentry"
  | "background_concern";

export type ExtractedSignalSet = {
  names: string[];
  emails: string[];
  phones: string[];
  companies: string[];
  locations: string[];
  dates: string[];
  times: string[];
  interviews: string[];
  contingencies: string[];
};

export type ExportPackageManifest = {
  package_version: string;
  schema_version: string;
  generated_at: string;
  account_id: string;
  selected_user_id: string;
  selected_opportunity_id: string;
  use_case_ids: string[];
  included_paths: string[];
  notes: string[];
};
