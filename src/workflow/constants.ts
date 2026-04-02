import { OpportunityStage } from "../types";

export const stageOrder: OpportunityStage[] = [
  "intake_started",
  "intake_complete",
  "fit_review",
  "positioning",
  "outreach_ready",
  "interview_active",
  "debrief_captured",
  "offer_review",
  "closed_won",
  "closed_lost",
];

export const stageMeta: Record<
  OpportunityStage,
  { label: string; reviewerRole: string; description: string }
> = {
  intake_started: {
    label: "Intake started",
    reviewerRole: "Customer Success Lead",
    description: "Account, user, and opportunity setup have begun.",
  },
  intake_complete: {
    label: "Intake complete",
    reviewerRole: "Data Steward / Data Quality Lead",
    description: "Artifacts and candidate profile have enough evidence to proceed.",
  },
  fit_review: {
    label: "Fit review",
    reviewerRole: "Opportunity Strategist",
    description: "Opportunity strengths, risks, and pursue logic are being evaluated.",
  },
  positioning: {
    label: "Positioning",
    reviewerRole: "Resume And Positioning Architect",
    description: "Narrative, proof points, and artifact framing are being refined.",
  },
  outreach_ready: {
    label: "Outreach ready",
    reviewerRole: "CRM / Correspondence Operations Lead",
    description: "Correspondence drafts are being reviewed before outbound use.",
  },
  interview_active: {
    label: "Interview active",
    reviewerRole: "Technical Interview Coach",
    description: "Preparation and live interview support are in progress.",
  },
  debrief_captured: {
    label: "Debrief captured",
    reviewerRole: "Workflow Analyst",
    description: "Interview outcomes have been recorded and routed into the lifecycle.",
  },
  offer_review: {
    label: "Offer review",
    reviewerRole: "Compensation And Offer Analyst",
    description: "Title, level, and compensation guidance are under human review.",
  },
  closed_won: {
    label: "Closed won",
    reviewerRole: "Implementation Program Manager",
    description: "Opportunity has been accepted and can be archived or summarized.",
  },
  closed_lost: {
    label: "Closed lost",
    reviewerRole: "Workflow Analyst",
    description: "Opportunity has been closed or declined with audit history preserved.",
  },
};

export const apiSurface = [
  "Account",
  "User",
  "Opportunity",
  "SourceArtifact",
  "CandidateProfile",
  "AICheckpoint",
  "WorkflowTask",
  "Escalation",
  "DecisionMemo",
  "ReportingSnapshot",
  "CorrespondenceItem",
  "CandidateStory",
  "SensitiveSupportProfile",
  "EnterpriseControlProfile",
  "RoleEntitlement",
];
