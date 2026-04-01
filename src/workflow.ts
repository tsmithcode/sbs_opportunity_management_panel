import type {
  Account,
  AccountType,
  AICheckpoint,
  AppState,
  CandidateProfile,
  CandidateStory,
  ConfidenceLevel,
  CorrespondenceItem,
  DecisionMemo,
  EventType,
  Escalation,
  EnterpriseControlProfile,
  Opportunity,
  OpportunityStage,
  ReportingSnapshot,
  RoleEntitlement,
  StageEvent,
  SensitiveSupportProfile,
  SourceArtifact,
  SponsorshipType,
  User,
  WorkflowTask,
  ActorType,
} from "./types";

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

export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function getNextStage(stage: OpportunityStage): OpportunityStage {
  const index = stageOrder.indexOf(stage);
  if (index === -1 || index >= stageOrder.length - 2) {
    return stage;
  }
  return stageOrder[index + 1];
}

export function isClosedStage(stage: OpportunityStage): boolean {
  return stage === "closed_won" || stage === "closed_lost";
}

export function getOpportunityArtifacts(
  state: AppState,
  opportunityId: string,
): SourceArtifact[] {
  return state.artifacts.filter((artifact) => artifact.opportunity_id === opportunityId);
}

export function getOpportunityTasks(
  state: AppState,
  opportunityId: string,
): WorkflowTask[] {
  return state.tasks.filter((task) => task.opportunity_id === opportunityId);
}

export function getOpportunityCheckpoints(
  state: AppState,
  opportunityId: string,
): AICheckpoint[] {
  return state.checkpoints.filter(
    (checkpoint) => checkpoint.opportunity_id === opportunityId,
  );
}

export function getOpportunityEscalations(
  state: AppState,
  opportunityId: string,
): Escalation[] {
  return state.escalations.filter(
    (escalation) => escalation.opportunity_id === opportunityId,
  );
}

export function getOpportunityCorrespondence(
  state: AppState,
  opportunityId: string,
): CorrespondenceItem[] {
  return state.correspondence.filter(
    (item) => item.opportunity_id === opportunityId,
  );
}

export function getOpportunityCandidateStory(
  state: AppState,
  opportunityId: string,
): CandidateStory | undefined {
  return state.candidateStories.find((story) => story.opportunity_id === opportunityId);
}

export function getOpportunitySensitiveSupport(
  state: AppState,
  opportunityId: string,
): SensitiveSupportProfile | undefined {
  return state.sensitiveSupportProfiles.find(
    (profile) => profile.opportunity_id === opportunityId,
  );
}

export function getCompletionScore(state: AppState, opportunityId: string): number {
  const opportunity = state.opportunities.find(
    (candidate) => candidate.opportunity_id === opportunityId,
  );
  if (!opportunity) {
    return 0;
  }

  const stageIndex = stageOrder.indexOf(opportunity.current_stage);
  let baseScore = Math.round(((Math.max(stageIndex, 0) + 1) / stageOrder.length) * 100);
  
  // Bonus for having an outcome recorded
  if (state.outcomes.some(o => o.opportunity_id === opportunityId)) {
    baseScore = Math.min(100, baseScore + 10);
  }

  return baseScore;
}

export function getGovernanceOverlays(
  account: Account | undefined,
  user: User | undefined,
  opportunity: Opportunity | undefined,
): string[] {
  const overlays = [
    "Human review enforced for high-stakes outputs",
    "Evidence and confidence shown before recommendation",
  ];

  if (!account || !user || !opportunity) {
    return overlays;
  }

  if (account.account_type === "government") {
    overlays.push("Government account: route legal, accessibility, and procurement questions to staffed reviewers.");
  }

  if (account.account_type === "enterprise") {
    overlays.push("Enterprise account: keep implementation logging, export paths, and reviewer assignment visible.");
  }

  if (user.sponsorship_type === "managed_service") {
    overlays.push("Managed-service overlay: staff queues and review ownership are part of the product promise.");
  }

  if (user.region.toLowerCase().includes("eu")) {
    overlays.push("Region-sensitive privacy review is required before making stronger cross-border data claims.");
  }

  if (opportunity.current_stage === "outreach_ready" || opportunity.current_stage === "offer_review") {
    overlays.push("External use blocked until explicit approval is recorded.");
  }

  return overlays;
}

export function createAccount(input: {
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
}): Account {
  return {
    account_id: createId("acct"),
    created_at: nowIso(),
    ...input,
  };
}

export function createUser(input: {
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
}): User {
  const timestamp = nowIso();
  return {
    user_id: createId("user"),
    created_at: timestamp,
    updated_at: timestamp,
    ...input,
  };
}

export function createOpportunity(input: {
  account_id: string;
  user_id: string;
  use_case_id: string;
  pathway: "w2" | "1099";
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
}): Opportunity {
  const timestamp = nowIso();
  return {
    opportunity_id: createId("opp"),
    current_stage: "intake_started",
    status: "active",
    created_at: timestamp,
    updated_at: timestamp,
    ...input,
  };
}

export function createCandidateProfile(userId: string, opportunityId: string): CandidateProfile {
  return {
    profile_id: createId("profile"),
    user_id: userId,
    opportunity_id: opportunityId,
    skills_summary: "",
    experience_level: "",
    domain_strengths: "",
    declared_gaps: "",
    user_corrected: false,
    updated_at: nowIso(),
  };
}

export function createArtifact(input: {
  opportunity_id: string;
  artifact_type: SourceArtifact["artifact_type"];
  source_label: string;
  origin: SourceArtifact["origin"];
  review_status: SourceArtifact["review_status"];
  parse_status: SourceArtifact["parse_status"];
  evidence_note: string;
  content_summary: string;
  source_text?: string;
  extracted_signals?: SourceArtifact["extracted_signals"];
  version_number?: number;
}): SourceArtifact {
  return {
    artifact_id: createId("artifact"),
    version_number: input.version_number ?? 1,
    created_at: nowIso(),
    source_text: input.source_text ?? input.content_summary,
    ...input,
  };
}

export function createCheckpoint(
  opportunity: Opportunity,
  stepName: string,
  triggerReason: string,
  confidenceLevel: ConfidenceLevel,
  decision: AICheckpoint["decision"],
  evidenceSummary: string,
  truthfulnessRisk: AICheckpoint["truthfulness_risk"],
  policyRisk: AICheckpoint["policy_risk"],
): AICheckpoint {
  return {
    checkpoint_id: createId("checkpoint"),
    opportunity_id: opportunity.opportunity_id,
    stage: opportunity.current_stage,
    step_name: stepName,
    trigger_reason: triggerReason,
    decision,
    confidence_level: confidenceLevel,
    evidence_summary: evidenceSummary,
    policy_risk: policyRisk,
    truthfulness_risk: truthfulnessRisk,
    human_review_required:
      decision === "escalate_for_review" ||
      decision === "block" ||
      opportunity.current_stage === "positioning" ||
      opportunity.current_stage === "outreach_ready" ||
      opportunity.current_stage === "offer_review",
    assigned_reviewer_role: stageMeta[opportunity.current_stage].reviewerRole,
    created_at: nowIso(),
  };
}

export function createTask(
  opportunityId: string,
  taskType: string,
  ownerRole: string,
  blocking: boolean,
): WorkflowTask {
  return {
    task_id: createId("task"),
    opportunity_id: opportunityId,
    task_type: taskType,
    owner_role: ownerRole,
    owner_id: "",
    due_at: "",
    status: "open",
    blocking,
    created_at: nowIso(),
  };
}

export function createStageEvent(
  opportunityId: string,
  stage: OpportunityStage,
  eventType: EventType,
  actorType: ActorType,
  actorId: string,
  notes: string,
): StageEvent {
  return {
    event_id: createId("event"),
    opportunity_id: opportunityId,
    stage,
    event_type: eventType,
    actor_type: actorType,
    actor_id: actorId,
    event_timestamp: nowIso(),
    notes,
  };
}

export function createMemo(
  opportunityId: string,
  memoType: DecisionMemo["memo_type"],
  summary: string,
  confidence: ConfidenceLevel,
  humanApproved: boolean,
): DecisionMemo {
  return {
    memo_id: createId("memo"),
    opportunity_id: opportunityId,
    memo_type: memoType,
    status: humanApproved ? "approved" : "review",
    summary,
    confidence_level: confidence,
    human_approved: humanApproved,
    created_at: nowIso(),
  };
}

export function createEscalation(
  opportunityId: string,
  escalationType: Escalation["escalation_type"],
  ownerRole: string,
  severity: Escalation["severity"],
  resolutionNotes: string,
): Escalation {
  return {
    escalation_id: createId("escalation"),
    opportunity_id: opportunityId,
    escalation_type: escalationType,
    severity,
    owner_role: ownerRole,
    status: "open",
    resolution_notes: resolutionNotes,
    created_at: nowIso(),
  };
}

export function createCorrespondence(
  opportunityId: string,
  channel: CorrespondenceItem["channel"],
  subject: string,
  body: string,
  extractedSignals?: CorrespondenceItem["extracted_signals"],
): CorrespondenceItem {
  return {
    correspondence_id: createId("cor"),
    opportunity_id: opportunityId,
    channel,
    subject,
    body,
    status: "draft",
    scheduled_for: "",
    owner_role: "CRM / Correspondence Operations Lead",
    extracted_signals: extractedSignals,
    created_at: nowIso(),
  };
}

export function createReportingSnapshot(state: AppState): ReportingSnapshot {
  const activeOpportunities = state.opportunities.filter(
    (opportunity) => opportunity.status === "active",
  );
  const eligibleOpportunities = state.opportunities.length || 1;
  const approvals = state.artifacts.filter(
    (artifact) => artifact.review_status === "approved",
  ).length;
  const reviewableArtifacts = state.artifacts.length || 1;
  const escalations = state.escalations.length;
  const trustBase = state.checkpoints.length || 1;
  const highConfidence = state.checkpoints.filter(
    (checkpoint) => checkpoint.confidence_level === "high",
  ).length;

  return {
    snapshot_id: createId("snapshot"),
    account_id: state.selectedAccountId,
    use_case_id: "sbs",
    period_start: state.lastSavedAt,
    period_end: nowIso(),
    active_opportunities: activeOpportunities.length,
    intake_completion_rate:
      state.opportunities.filter((opportunity) =>
        stageOrder.indexOf(opportunity.current_stage) >=
        stageOrder.indexOf("intake_complete"),
      ).length / eligibleOpportunities,
    fit_review_completion_rate:
      state.opportunities.filter((opportunity) =>
        stageOrder.indexOf(opportunity.current_stage) >=
        stageOrder.indexOf("fit_review"),
      ).length / eligibleOpportunities,
    approval_rate: approvals / reviewableArtifacts,
    escalation_rate: escalations / eligibleOpportunities,
    user_trust_score: highConfidence / trustBase,
    created_at: nowIso(),
  };
}

export function createSensitiveSupportProfile(
  opportunityId: string,
): SensitiveSupportProfile {
  return {
    support_profile_id: createId("support"),
    opportunity_id: opportunityId,
    enabled: false,
    categories: [],
    notes: "",
    encouragement_plan: "",
    include_in_export: false,
    updated_at: nowIso(),
  };
}

export function createEnterpriseControlProfile(input: {
  account_id: string;
  entitlements_mode: EnterpriseControlProfile["entitlements_mode"];
  external_release_requires_approval: boolean;
  export_confirmation_required: boolean;
  allow_sensitive_support_export: boolean;
  local_only_posture_locked: boolean;
  deployment_posture: string;
  buyer_readiness_stage: EnterpriseControlProfile["buyer_readiness_stage"];
  notes: string;
}): EnterpriseControlProfile {
  return {
    control_profile_id: createId("control"),
    updated_at: nowIso(),
    ...input,
  };
}

export function createRoleEntitlement(input: {
  account_id: string;
  role_name: string;
  workspace_access: boolean;
  staff_queue_access: boolean;
  admin_console_access: boolean;
  export_package_access: boolean;
  diligence_packet_access: boolean;
  notes: string;
}): RoleEntitlement {
  return {
    entitlement_id: createId("entitlement"),
    updated_at: nowIso(),
    ...input,
  };
}
