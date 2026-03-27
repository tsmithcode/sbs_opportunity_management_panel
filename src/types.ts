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

export type ArtifactType =
  | "resume"
  | "job_description"
  | "message"
  | "note"
  | "offer"
  | "debrief"
  | "generated_output"
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

export type Account = {
  account_id: string;
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
  created_at: string;
};

export type User = {
  user_id: string;
  account_id: string;
  full_name: string;
  email: string;
  phone: string;
  timezone: string;
  region: string;
  current_role: string;
  target_role_family: string;
  target_compensation: string;
  accessibility_needs: string;
  sponsorship_type: SponsorshipType;
  created_at: string;
  updated_at: string;
};

export type Opportunity = {
  opportunity_id: string;
  account_id: string;
  user_id: string;
  use_case_id: string;
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
  current_stage: OpportunityStage;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
};

export type SourceArtifact = {
  artifact_id: string;
  opportunity_id: string;
  artifact_type: ArtifactType;
  source_label: string;
  origin: "user_uploaded" | "system_generated" | "imported" | "organization_supplied";
  review_status: ReviewStatus;
  parse_status: ParseStatus;
  version_number: number;
  evidence_note: string;
  content_summary: string;
  extracted_signals?: ExtractedSignalSet;
  created_at: string;
};

export type CandidateProfile = {
  profile_id: string;
  user_id: string;
  opportunity_id: string;
  skills_summary: string;
  experience_level: string;
  domain_strengths: string;
  declared_gaps: string;
  user_corrected: boolean;
  updated_at: string;
};

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

export type CorrespondenceItem = {
  correspondence_id: string;
  opportunity_id: string;
  channel: "email" | "linkedin" | "note";
  subject: string;
  body: string;
  status: CorrespondenceStatus;
  scheduled_for: string;
  owner_role: string;
  extracted_signals?: ExtractedSignalSet;
  created_at: string;
};

export type CandidateStory = {
  story_id: string;
  opportunity_id: string;
  title: string;
  summary: string;
  markdown: string;
  status: ApprovalState;
  source_artifact_ids: string[];
  source_correspondence_ids: string[];
  updated_at: string;
};

export type SensitiveSupportProfile = {
  support_profile_id: string;
  opportunity_id: string;
  enabled: boolean;
  categories: SensitiveSupportType[];
  notes: string;
  encouragement_plan: string;
  include_in_export: boolean;
  updated_at: string;
};

export type EnterpriseControlProfile = {
  control_profile_id: string;
  account_id: string;
  entitlements_mode: "guided_default" | "staff_review" | "admin_controlled";
  external_release_requires_approval: boolean;
  export_confirmation_required: boolean;
  allow_sensitive_support_export: boolean;
  local_only_posture_locked: boolean;
  deployment_posture: string;
  buyer_readiness_stage: "internal_only" | "guided_pilot" | "buyer_reviewable";
  notes: string;
  updated_at: string;
};

export type RoleEntitlement = {
  entitlement_id: string;
  account_id: string;
  role_name: string;
  workspace_access: boolean;
  staff_queue_access: boolean;
  admin_console_access: boolean;
  export_package_access: boolean;
  diligence_packet_access: boolean;
  notes: string;
  updated_at: string;
};

export type ReleaseArtifactReviewRecord = {
  review_id: string;
  account_id: string;
  opportunity_id: string;
  title: string;
  summary: string;
  source_name: string;
  entries: string[];
  content: string;
  pinned: boolean;
  imported_at: string;
};

export type AppState = {
  schemaVersion: string;
  accounts: Account[];
  users: User[];
  opportunities: Opportunity[];
  artifacts: SourceArtifact[];
  candidateProfiles: CandidateProfile[];
  events: StageEvent[];
  checkpoints: AICheckpoint[];
  tasks: WorkflowTask[];
  escalations: Escalation[];
  memos: DecisionMemo[];
  reportingSnapshots: ReportingSnapshot[];
  correspondence: CorrespondenceItem[];
  candidateStories: CandidateStory[];
  sensitiveSupportProfiles: SensitiveSupportProfile[];
  enterpriseControlProfiles: EnterpriseControlProfile[];
  roleEntitlements: RoleEntitlement[];
  releaseArtifactReviews: ReleaseArtifactReviewRecord[];
  selectedAccountId: string;
  selectedUserId: string;
  selectedOpportunityId: string;
  currentMode: AppMode;
  lastSavedAt: string;
  lastExportedAt: string;
};
