import type {
  AICheckpoint,
  AppState,
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  Escalation,
  Opportunity,
  ReportingSnapshot,
  SourceArtifact,
  WorkflowTask,
} from "./types";
import {
  createCandidateStoryRecord,
  extractSignalsFromText,
  generateCandidateStory,
} from "./intelligence";
import { SCHEMA_VERSION } from "./schema";
import {
  createAccount,
  createArtifact,
  createCandidateProfile,
  createCheckpoint,
  createCorrespondence,
  createEscalation,
  createEnterpriseControlProfile,
  createMemo,
  createOpportunity,
  createReportingSnapshot,
  createRoleEntitlement,
  createTask,
  nowIso,
} from "./workflow";

type SeedBundle = {
  opportunity: Opportunity;
  profile: CandidateProfile;
  artifacts: SourceArtifact[];
  checkpoints: AICheckpoint[];
  tasks: WorkflowTask[];
  escalations: Escalation[];
  memos: DecisionMemo[];
  correspondence: CorrespondenceItem[];
  candidateStory: CandidateStory;
};

function buildSeedOpportunity(input: {
  accountId: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  source: string;
  postingUrl: string;
  stageSteps: number;
  profile: {
    skillsSummary: string;
    experienceLevel: string;
    strengths: string;
    gaps: string;
  };
  resumeSummary: string;
  jdSummary: string;
  checkpointSummary: string;
  memoType: DecisionMemo["memo_type"];
  memoSummary: string;
  correspondenceSubject: string;
  correspondenceBody: string;
  addEscalation?: {
    type: Escalation["escalation_type"];
    owner: string;
    severity: Escalation["severity"];
    notes: string;
  };
}): SeedBundle {
  const opportunity = createOpportunity({
    account_id: input.accountId,
    user_id: input.userId,
    use_case_id: "sbs",
    company_name: input.companyName,
    role_title: input.roleTitle,
    opportunity_source: input.source,
    job_posting_url: input.postingUrl,
    employment_type: "Full-time",
    location_type: "Remote",
  });

  const profile = createCandidateProfile(input.userId, opportunity.opportunity_id);
  profile.skills_summary = input.profile.skillsSummary;
  profile.experience_level = input.profile.experienceLevel;
  profile.domain_strengths = input.profile.strengths;
  profile.declared_gaps = input.profile.gaps;
  profile.user_corrected = true;

  const artifacts = [
    createArtifact({
      opportunity_id: opportunity.opportunity_id,
      artifact_type: "resume",
      source_label: `${input.companyName} resume package`,
      origin: "user_uploaded",
      review_status: "user_reviewed",
      parse_status: "complete",
      evidence_note: "Primary candidate profile evidence",
      content_summary: input.resumeSummary,
      extracted_signals: extractSignalsFromText(input.resumeSummary, input.companyName),
    }),
    createArtifact({
      opportunity_id: opportunity.opportunity_id,
      artifact_type: "job_description",
      source_label: `${input.companyName} opportunity description`,
      origin: "organization_supplied",
      review_status: "user_reviewed",
      parse_status: "complete",
      evidence_note: "Target opportunity description",
      content_summary: input.jdSummary,
      extracted_signals: extractSignalsFromText(input.jdSummary, input.companyName),
    }),
  ];

  const checkpoints: AICheckpoint[] = [];
  const tasks: WorkflowTask[] = [];
  const memos: DecisionMemo[] = [];

  const initialCheckpoint = createCheckpoint(
    opportunity,
    "Intake evidence review",
    "Seeded platform baseline",
    "medium",
    "proceed_with_warning",
    input.checkpointSummary,
    "low",
    "low",
  );

  checkpoints.push(initialCheckpoint);
  tasks.push(
    createTask(
      opportunity.opportunity_id,
      "Confirm candidate profile and fit-review readiness",
      "Data Steward / Data Quality Lead",
      true,
    ),
  );
  memos.push(
    createMemo(
      opportunity.opportunity_id,
      input.memoType,
      input.memoSummary,
      "medium",
      false,
    ),
  );

  const correspondence = [
    createCorrespondence(
      opportunity.opportunity_id,
      "email",
      input.correspondenceSubject,
      input.correspondenceBody,
      extractSignalsFromText(input.correspondenceBody, input.companyName),
    ),
  ];

  const candidateStory = createCandidateStoryRecord(
    generateCandidateStory({
      user: undefined,
      opportunity,
      profile,
      artifacts,
      correspondence,
    }),
  );

  for (let index = 0; index < input.stageSteps; index += 1) {
    const nextStage = [
      "intake_complete",
      "fit_review",
      "positioning",
      "outreach_ready",
      "interview_active",
      "debrief_captured",
      "offer_review",
    ][index] as Opportunity["current_stage"] | undefined;

    if (!nextStage) {
      break;
    }

    opportunity.current_stage = nextStage;
    opportunity.updated_at = nowIso();

    const checkpoint = createCheckpoint(
      opportunity,
      `Seeded ${nextStage.replace(/_/g, " ")}`,
      "Reference lifecycle progression",
      nextStage === "positioning" || nextStage === "offer_review" ? "medium" : "high",
      nextStage === "outreach_ready" || nextStage === "offer_review"
        ? "escalate_for_review"
        : "proceed",
      `Reference sample progressed into ${nextStage.replace(/_/g, " ")}.`,
      nextStage === "positioning" ? "medium" : "low",
      nextStage === "offer_review" ? "medium" : "low",
    );
    checkpoints.push(checkpoint);
    tasks.push(
      createTask(
        opportunity.opportunity_id,
        `Complete ${nextStage.replace(/_/g, " ")} review`,
        checkpoint.assigned_reviewer_role,
        nextStage !== "closed_won" && nextStage !== "closed_lost",
      ),
    );
  }

  const escalations: Escalation[] = input.addEscalation
    ? [
        createEscalation(
          opportunity.opportunity_id,
          input.addEscalation.type,
          input.addEscalation.owner,
          input.addEscalation.severity,
          input.addEscalation.notes,
        ),
      ]
    : [];

  return {
    opportunity,
    profile,
    artifacts,
    checkpoints,
    tasks,
    escalations,
    memos,
    correspondence,
    candidateStory,
  };
}

export function createSeedState(): AppState {
  const account = createAccount({
    account_name: "SBS Pilot Account",
    account_type: "enterprise",
    primary_region: "United States",
    support_tier: "Enterprise Premium Governance",
  });

  const userTimestamp = nowIso();
  const user = {
    user_id: "user_seed_primary",
    account_id: account.account_id,
    full_name: "Thomas Smith",
    email: "thomas@example.com",
    phone: "",
    timezone: "America/New_York",
    region: "United States",
    current_role: "Software Engineer",
    target_role_family: "Design Tools Engineering",
    target_compensation: "$165,000 - $195,000",
    accessibility_needs: "Keyboard-first workflow",
    sponsorship_type: "organization_sponsored" as const,
    created_at: userTimestamp,
    updated_at: userTimestamp,
  };

  const seededBundles = [
    buildSeedOpportunity({
      accountId: account.account_id,
      userId: user.user_id,
      companyName: "Spatial Business Systems",
      roleTitle: "Software Engineer, Design Tools",
      source: "Recruiter outreach",
      postingUrl: "https://example.com/sbs-design-tools",
      stageSteps: 1,
      profile: {
        skillsSummary:
          "C#, .NET, Autodesk ecosystem, CAD tooling, performance-sensitive workflows",
        experienceLevel: "Senior IC with architecture depth",
        strengths: "Desktop software, Autodesk integrations, enterprise design systems",
        gaps: "Revit API depth needs explicit ramp narrative",
      },
      resumeSummary:
        "Resume uploaded and parsed with Autodesk-heavy engineering evidence ready for intake completion.",
      jdSummary:
        "Mid-level design tools software engineer role with Revit API emphasis and Autodesk platform depth.",
      checkpointSummary:
        "Resume and job description are present. Intake is nearly complete, but profile review and fit routing still need confirmation.",
      memoType: "fit",
      memoSummary:
        "Proceed into fit review with explicit Revit-gap mitigation and seniority framing controls.",
      correspondenceSubject: "SBS intake follow-up draft",
      correspondenceBody:
        "Thank you for the outreach. I have strong Autodesk platform experience and would like to continue the conversation about the design tools role.",
    }),
    buildSeedOpportunity({
      accountId: account.account_id,
      userId: user.user_id,
      companyName: "Spatial Business Systems",
      roleTitle: "Implementation Engineer, Grid Design Tools",
      source: "Hiring manager referral",
      postingUrl: "https://example.com/sbs-grid-tools",
      stageSteps: 3,
      profile: {
        skillsSummary:
          "Autodesk platform work, engineering software design, systems integration, stakeholder translation",
        experienceLevel: "Senior engineer with strong platform execution depth",
        strengths: "Positioning and domain translation are strong for utilities-adjacent desktop tooling",
        gaps: "Needs sharper mid-level scope framing and utility-specific storytelling",
      },
      resumeSummary:
        "Resume tuned for Autodesk-heavy delivery work with execution-oriented scope and design-tool relevance.",
      jdSummary:
        "Role emphasizes implementation, grid design workflow knowledge, and collaborative desktop tooling support.",
      checkpointSummary:
        "Evidence supports strong fit with some domain translation work still required before outreach.",
      memoType: "positioning",
      memoSummary:
        "Positioning is viable if messaging emphasizes immediate delivery value over title inflation.",
      correspondenceSubject: "SBS positioning review draft",
      correspondenceBody:
        "I can contribute quickly in Autodesk-centric engineering workflows while staying hands-on and execution-focused.",
    }),
    buildSeedOpportunity({
      accountId: account.account_id,
      userId: user.user_id,
      companyName: "Spatial Business Systems",
      roleTitle: "Senior Design Tools Engineer",
      source: "Panel continuation",
      postingUrl: "https://example.com/sbs-senior-design-tools",
      stageSteps: 6,
      profile: {
        skillsSummary:
          "Interview-ready Autodesk and enterprise tooling experience with strong systems literacy and coaching value",
        experienceLevel: "Senior IC / architect profile with proven platform depth",
        strengths: "Interview preparation and offer logic have rich evidence to work from",
        gaps: "Comp and title calibration still need careful handling",
      },
      resumeSummary:
        "Resume and supporting materials are aligned to an advanced design-tools conversation and late-stage evaluation.",
      jdSummary:
        "Late-stage role with stronger ownership expectations, broader architecture influence, and more nuanced offer tradeoffs.",
      checkpointSummary:
        "Late-stage opportunity has strong evidence depth and should surface offer-review governance clearly.",
      memoType: "offer",
      memoSummary:
        "Offer-review sample should demonstrate high-stakes guidance, compensation calibration, and explicit human review.",
      correspondenceSubject: "SBS late-stage follow-up",
      correspondenceBody:
        "I appreciate the continued conversation. I would like to make sure scope, level, and compensation reflect both immediate contribution and long-term fit.",
      addEscalation: {
        type: "finance",
        owner: "Finance Lead",
        severity: "medium",
        notes:
          "Late-stage sample includes comp calibration questions and should keep explicit review gates visible.",
      },
    }),
  ];

  const opportunities = seededBundles.map((bundle) => bundle.opportunity);
  const candidateProfiles = seededBundles.map((bundle) => bundle.profile);
  const artifacts = seededBundles.flatMap((bundle) => bundle.artifacts);
  const checkpoints = seededBundles.flatMap((bundle) => bundle.checkpoints);
  const tasks = seededBundles.flatMap((bundle) => bundle.tasks);
  const escalations = seededBundles.flatMap((bundle) => bundle.escalations);
  const memos = seededBundles.flatMap((bundle) => bundle.memos);
  const correspondence = seededBundles.flatMap((bundle) => bundle.correspondence);
  const candidateStories: CandidateStory[] = seededBundles.map(
    (bundle) => bundle.candidateStory,
  );
  const enterpriseControlProfiles = [
    createEnterpriseControlProfile({
      account_id: account.account_id,
      entitlements_mode: "admin_controlled",
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "buyer_reviewable",
      notes:
        "Premium governance sample keeps local-only posture locked and requires explicit approval before external release.",
    }),
  ];
  const roleEntitlements = [
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Candidate / User",
      workspace_access: true,
      staff_queue_access: false,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Guided workspace and personal handoff exports only.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Staff Operations",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Can coordinate queues, reviews, and controlled handoff preparation.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Admin / Governance",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Can manage enterprise controls, buyer readiness posture, and diligence materials.",
    }),
  ];

  const baseState: AppState = {
    schemaVersion: SCHEMA_VERSION,
    accounts: [account],
    users: [user],
    opportunities,
    artifacts,
    candidateProfiles,
    events: [],
    checkpoints,
    tasks,
    escalations,
    memos,
    reportingSnapshots: [],
    correspondence,
    candidateStories,
    sensitiveSupportProfiles: [],
    enterpriseControlProfiles,
    roleEntitlements,
    releaseArtifactReviews: [],
    selectedAccountId: account.account_id,
    selectedUserId: user.user_id,
    selectedOpportunityId: opportunities[0].opportunity_id,
    currentMode: "user",
    lastSavedAt: nowIso(),
    lastExportedAt: "",
  };

  const reportingSnapshots: ReportingSnapshot[] = [createReportingSnapshot(baseState)];

  return {
    ...baseState,
    reportingSnapshots,
  };
}
