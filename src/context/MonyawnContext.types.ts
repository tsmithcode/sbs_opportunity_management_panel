import {
  AccountType,
  ArtifactType,
  OpportunityPathway,
  ParseStatus,
  ReviewStatus,
  SensitiveSupportType,
  SponsorshipType,
} from "../types";

export type AppPage =
  | "login"
  | "start"
  | "proof-drop"
  | "confirm"
  | "setup-base"
  | "workspace"
  | "about";

export type Notice = { tone: "success" | "info"; message: string } | null;

export type ImportedReleaseArtifact = {
  title: string;
  summary: string;
  sourceName: string;
  entries: string[];
  content: string;
} | null;

export type AccountDraft = {
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
};

export type UserDraft = {
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
};

export type OpportunityDraft = {
  pathway: OpportunityPathway;
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
};

export type ArtifactDraft = {
  artifact_type: ArtifactType;
  source_label: string;
  origin: "user_uploaded" | "system_generated" | "imported" | "organization_supplied";
  review_status: ReviewStatus;
  parse_status: ParseStatus;
  evidence_note: string;
  content_summary: string;
};

export type ProfileDraft = {
  skills_summary: string;
  experience_level: string;
  domain_strengths: string;
  declared_gaps: string;
  user_corrected: boolean;
};

export type TaskDraft = {
  task_type: string;
  owner_role: string;
  blocking: boolean;
};

export type EscalationDraft = {
  escalation_type:
    | "product"
    | "accessibility"
    | "security"
    | "privacy"
    | "legal"
    | "policy"
    | "finance"
    | "support"
    | "delivery";
  owner_role: string;
  severity: "low" | "medium" | "high" | "critical";
  resolution_notes: string;
};

export type CorrespondenceDraft = {
  channel: "email" | "linkedin" | "note";
  subject: string;
  body: string;
};

export type SensitiveSupportDraft = {
  enabled: boolean;
  categories: SensitiveSupportType[];
  notes: string;
  encouragement_plan: string;
  include_in_export: boolean;
};

export const defaultAccountDraft: AccountDraft = {
  account_name: "",
  account_type: "enterprise",
  primary_region: "United States",
  support_tier: "Enterprise Premium Governance",
};

export const defaultUserDraft: UserDraft = {
  full_name: "",
  email: "",
  phone: "",
  timezone: "America/New_York",
  region: "United States",
  current_role: "",
  target_role_family: "",
  target_compensation: "",
  accessibility_needs: "",
  sponsorship_type: "organization_sponsored",
};

export const defaultOpportunityDraft: OpportunityDraft = {
  pathway: "w2",
  company_name: "",
  role_title: "",
  opportunity_source: "",
  job_posting_url: "",
  employment_type: "Full-time",
  location_type: "Remote",
};

export const defaultArtifactDraft: ArtifactDraft = {
  artifact_type: "resume",
  source_label: "",
  origin: "user_uploaded",
  review_status: "unreviewed",
  parse_status: "pending",
  evidence_note: "",
  content_summary: "",
};

export const defaultTaskDraft: TaskDraft = {
  task_type: "Review generated output",
  owner_role: "Workflow Analyst",
  blocking: true,
};

export const defaultEscalationDraft: EscalationDraft = {
  escalation_type: "policy",
  owner_role: "Safety / Policy Lead",
  severity: "medium",
  resolution_notes: "",
};

export const defaultCorrespondenceDraft: CorrespondenceDraft = {
  channel: "email",
  subject: "",
  body: "",
};

export const defaultSensitiveSupportDraft: SensitiveSupportDraft = {
  enabled: false,
  categories: [],
  notes: "",
  encouragement_plan: "",
  include_in_export: false,
};
