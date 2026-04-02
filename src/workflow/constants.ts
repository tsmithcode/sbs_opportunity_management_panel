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
    label: "Start",
    reviewerRole: "Support lead",
    description: "Base, hero, and play are getting set.",
  },
  intake_complete: {
    label: "Setup done",
    reviewerRole: "Proof lead",
    description: "Proof and profile are clean enough to move.",
  },
  fit_review: {
    label: "Fit check",
    reviewerRole: "Strategy lead",
    description: "We check strengths, risks, and whether to push.",
  },
  positioning: {
    label: "Positioning",
    reviewerRole: "Story lead",
    description: "Story and proof points are getting sharpened.",
  },
  outreach_ready: {
    label: "DMs ready",
    reviewerRole: "DM lead",
    description: "Drafts are reviewed before sending.",
  },
  interview_active: {
    label: "Interview live",
    reviewerRole: "Interview coach",
    description: "Prep and live support are on.",
  },
  debrief_captured: {
    label: "Debrief saved",
    reviewerRole: "Ops analyst",
    description: "Interview results are recorded and routed.",
  },
  offer_review: {
    label: "Offer review",
    reviewerRole: "Money analyst",
    description: "Title, level, and pay guidance are checked.",
  },
  closed_won: {
    label: "Won",
    reviewerRole: "Ops lead",
    description: "Offer accepted. Archive or recap.",
  },
  closed_lost: {
    label: "Lost",
    reviewerRole: "Ops analyst",
    description: "Closed or declined, history preserved.",
  },
};

export const apiSurface = [
  "Base",
  "Hero",
  "Play",
  "Proof",
  "Profile",
  "Checkpoint",
  "Task",
  "Escalation",
  "DecisionMemo",
  "ReportingSnapshot",
  "DMs",
  "Story",
  "PrivateNotes",
  "BossControls",
  "Roles",
];
