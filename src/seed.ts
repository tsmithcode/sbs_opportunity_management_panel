import type {
  AICheckpoint,
  AppState,
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  EnterpriseControlProfile,
  Escalation,
  Opportunity,
  ReportingSnapshot,
  RoleEntitlement,
  SensitiveSupportProfile,
  StageEvent,
  SourceArtifact,
  User,
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
  createSensitiveSupportProfile,
  createStageEvent,
  createTask,
  createUser,
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
  events: StageEvent[];
  sensitiveSupportProfiles: SensitiveSupportProfile[];
};

function daysAgoIso(daysAgo: number, hour = 10, minute = 0): string {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  value.setHours(hour, minute, 0, 0);
  return value.toISOString();
}

function markBundleTimeline(
  bundle: SeedBundle,
  input: {
    createdDaysAgo: number;
    updatedDaysAgo: number;
    checkpointDaysAgo: number[];
    taskDaysAgo: number[];
    memoDaysAgo: number[];
    correspondenceDaysAgo: number[];
    artifactDaysAgo: number[];
  },
) {
  bundle.opportunity.created_at = daysAgoIso(input.createdDaysAgo, 9, 15);
  bundle.opportunity.updated_at = daysAgoIso(input.updatedDaysAgo, 16, 10);
  bundle.profile.updated_at = daysAgoIso(Math.max(input.updatedDaysAgo, 1), 11, 20);

  bundle.artifacts.forEach((artifact, index) => {
    artifact.created_at = daysAgoIso(input.artifactDaysAgo[index] ?? input.updatedDaysAgo, 10, 45);
  });
  bundle.checkpoints.forEach((checkpoint, index) => {
    checkpoint.created_at = daysAgoIso(input.checkpointDaysAgo[index] ?? input.updatedDaysAgo, 13, 10);
  });
  bundle.tasks.forEach((task, index) => {
    const taskDay = input.taskDaysAgo[index] ?? input.updatedDaysAgo;
    task.created_at = daysAgoIso(taskDay, 14, 0);
    task.due_at = daysAgoIso(Math.max(taskDay - 2, 0), 17, 0);
  });
  bundle.memos.forEach((memo, index) => {
    memo.created_at = daysAgoIso(input.memoDaysAgo[index] ?? input.updatedDaysAgo, 15, 20);
  });
  bundle.correspondence.forEach((item, index) => {
    item.created_at = daysAgoIso(input.correspondenceDaysAgo[index] ?? input.updatedDaysAgo, 11, 40);
  });
}

function buildHabasitOpportunity(input: {
  accountId: string;
  user: User;
  roleTitle: string;
  source: string;
  postingUrl: string;
  stageSteps: number;
  finalStage?: Opportunity["current_stage"];
  employmentType: string;
  locationType: string;
  resumeSummary: string;
  jdSummary: string;
  checkpointSummary: string;
  memoType: DecisionMemo["memo_type"];
  memoSummary: string;
  correspondenceSubject: string;
  correspondenceBody: string;
  coachingBody: string;
  profile: {
    skillsSummary: string;
    experienceLevel: string;
    strengths: string;
    gaps: string;
  };
  timeline: {
    createdDaysAgo: number;
    updatedDaysAgo: number;
    checkpointDaysAgo: number[];
    taskDaysAgo: number[];
    memoDaysAgo: number[];
    correspondenceDaysAgo: number[];
    artifactDaysAgo: number[];
    stageEventDaysAgo: number[];
  };
  support?: {
    categories: SensitiveSupportProfile["categories"];
    notes: string;
    encouragementPlan: string;
    includeInExport: boolean;
    updatedDaysAgo: number;
  };
}): SeedBundle {
  const bundle = buildSeedOpportunity({
    accountId: input.accountId,
    userId: input.user.user_id,
    companyName: "Habasit America",
    roleTitle: input.roleTitle,
    source: input.source,
    postingUrl: input.postingUrl,
    stageSteps: input.stageSteps,
    profile: {
      skillsSummary: input.profile.skillsSummary,
      experienceLevel: input.profile.experienceLevel,
      strengths: input.profile.strengths,
      gaps: input.profile.gaps,
    },
    resumeSummary: input.resumeSummary,
    jdSummary: input.jdSummary,
    checkpointSummary: input.checkpointSummary,
    memoType: input.memoType,
    memoSummary: input.memoSummary,
    correspondenceSubject: input.correspondenceSubject,
    correspondenceBody: input.correspondenceBody,
  });

  bundle.opportunity.location_type = input.locationType;
  bundle.opportunity.employment_type = input.employmentType;
  if (input.finalStage) {
    bundle.opportunity.current_stage = input.finalStage;
    bundle.opportunity.status =
      input.finalStage === "closed_won"
        ? "closed_won"
        : input.finalStage === "closed_lost"
          ? "closed_lost"
          : "active";
  }

  const coachingArtifact = createArtifact({
    opportunity_id: bundle.opportunity.opportunity_id,
    artifact_type: "note",
    source_label: `${input.roleTitle} field intelligence`,
    origin: "system_generated",
    review_status: "approved",
    parse_status: "complete",
    evidence_note: "Thirty-day sample operational note",
    content_summary: input.coachingBody,
    extracted_signals: extractSignalsFromText(input.coachingBody, "Habasit America"),
  });
  bundle.artifacts.push(coachingArtifact);

  const followupCorrespondence = createCorrespondence(
    bundle.opportunity.opportunity_id,
    "email",
    `${input.roleTitle} scheduling follow-up`,
    `${input.correspondenceBody}\n\nSite reference: Habasit America, Suwanee, GA. Candidate is coordinating next-step timing and onsite expectations.`,
    extractSignalsFromText(
      `${input.correspondenceBody}\nSuwanee, GA onsite timing and follow-up scheduling.`,
      "Habasit America",
    ),
  );
  followupCorrespondence.status =
    input.finalStage === "closed_won" || input.finalStage === "closed_lost" ? "sent" : "approved";
  bundle.correspondence.push(followupCorrespondence);

  const reviewMemo = createMemo(
    bundle.opportunity.opportunity_id,
    input.finalStage === "closed_lost" ? "final" : "interview",
    `Thirty-day Habasit sample review: ${input.memoSummary}`,
    input.finalStage === "closed_lost" ? "medium" : "high",
    input.finalStage === "closed_won",
  );
  bundle.memos.push(reviewMemo);

  const qualityTask = createTask(
    bundle.opportunity.opportunity_id,
    "Capture thirty-day sample findings for CEO review",
    "Data Pipeline Validation Lead",
    false,
  );
  qualityTask.status = input.finalStage === "closed_lost" ? "completed" : "in_progress";
  bundle.tasks.unshift(qualityTask);

  const events: StageEvent[] = [];
  const eventStages: Opportunity["current_stage"][] = [
    "intake_started",
    "intake_complete",
    "fit_review",
    "positioning",
    "outreach_ready",
    "interview_active",
    "debrief_captured",
    "offer_review",
  ];
  const finalStage =
    input.finalStage && (input.finalStage === "closed_won" || input.finalStage === "closed_lost")
      ? input.finalStage
      : undefined;

  events.push(
    createStageEvent(
      bundle.opportunity.opportunity_id,
      "intake_started",
      "created",
      "user",
      input.user.user_id,
      `${input.roleTitle} seeded as part of the Habasit America 30-day mock sample.`,
    ),
  );
  for (let index = 0; index < input.stageSteps; index += 1) {
    const stage = eventStages[index];
    if (!stage) {
      break;
    }
    events.push(
      createStageEvent(
        bundle.opportunity.opportunity_id,
        stage,
        "advanced",
        "staff",
        input.user.user_id,
        `${stage.replace(/_/g, " ")} review completed for the Habasit sample.`,
      ),
    );
  }
  if (finalStage) {
    events.push(
      createStageEvent(
        bundle.opportunity.opportunity_id,
        finalStage,
        "completed",
        "staff",
        input.user.user_id,
        `Opportunity reached ${finalStage.replace(/_/g, " ")} in the Habasit sample timeline.`,
      ),
    );
  }
  events.forEach((event, index) => {
    event.event_timestamp = daysAgoIso(
      input.timeline.stageEventDaysAgo[index] ?? input.timeline.updatedDaysAgo,
      16,
      30,
    );
  });
  bundle.events = events;

  if (input.support) {
    const supportProfile = createSensitiveSupportProfile(bundle.opportunity.opportunity_id);
    supportProfile.enabled = true;
    supportProfile.categories = input.support.categories;
    supportProfile.notes = input.support.notes;
    supportProfile.encouragement_plan = input.support.encouragementPlan;
    supportProfile.include_in_export = input.support.includeInExport;
    supportProfile.updated_at = daysAgoIso(input.support.updatedDaysAgo, 12, 25);
    bundle.sensitiveSupportProfiles = [supportProfile];
  }

  markBundleTimeline(bundle, input.timeline);

  bundle.tasks.forEach((task, index) => {
    task.status =
      index === 0
        ? qualityTask.status
        : input.finalStage === "closed_won"
          ? "completed"
          : input.finalStage === "closed_lost"
            ? index < 3
              ? "completed"
              : "cancelled"
            : index < 2
              ? "completed"
              : "open";
  });
  bundle.memos.forEach((memo, index) => {
    memo.status =
      input.finalStage === "closed_won" || (input.finalStage === "closed_lost" && index === 0)
        ? "approved"
        : "review";
    memo.human_approved = memo.status === "approved";
  });

  return bundle;
}

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
  const events: StageEvent[] = [
    createStageEvent(
      opportunity.opportunity_id,
      "intake_started",
      "created",
      "user",
      input.userId,
      `${input.companyName} seeded opportunity created.`,
    ),
  ];

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
    events.push(
      createStageEvent(
        opportunity.opportunity_id,
        nextStage,
        "advanced",
        "system",
        input.userId,
        `Seed reference advanced into ${nextStage.replace(/_/g, " ")}.`,
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
    events,
    sensitiveSupportProfiles: [],
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

  const habasitAccount = createAccount({
    account_name: "Habasit America - Suwanee 30 Day Sample",
    account_type: "enterprise",
    primary_region: "Suwanee, Georgia, United States",
    support_tier: "CEO Town Hall Product Hardening",
  });

  const habasitUsers = [
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Ava Coleman",
      email: "ava.coleman@example.com",
      phone: "470-555-0101",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Application Engineer",
      target_role_family: "Industrial Applications Engineering",
      target_compensation: "$118,000 - $132,000",
      accessibility_needs: "Desktop-first proof capture",
      sponsorship_type: "organization_sponsored",
    }),
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Darius Reed",
      email: "darius.reed@example.com",
      phone: "470-555-0102",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Manufacturing Technician",
      target_role_family: "Fabrication and operations support",
      target_compensation: "$62,000 - $74,000",
      accessibility_needs: "Clear next-step instructions and confidence reinforcement",
      sponsorship_type: "managed_service",
    }),
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Melissa Grant",
      email: "melissa.grant@example.com",
      phone: "470-555-0103",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Operations Analyst",
      target_role_family: "Customer operations and continuous improvement",
      target_compensation: "$88,000 - $102,000",
      accessibility_needs: "Low-noise task sequencing",
      sponsorship_type: "organization_sponsored",
    }),
  ];
  habasitUsers.forEach((user, index) => {
    user.created_at = daysAgoIso(30 - index * 3, 8, 30);
    user.updated_at = daysAgoIso(1 + index, 9, 15);
  });

  const habasitBundles = [
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[0],
      roleTitle: "Application Engineer, Conveyor Solutions",
      source: "Mock sample based on Habasit America Suwanee operations",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 7,
      finalStage: "closed_won",
      employmentType: "Full-time",
      locationType: "Hybrid - Suwanee, GA",
      resumeSummary:
        "Ava has applications engineering experience across power transmission, plant support, and customer-facing solution design with strong onsite collaboration habits.",
      jdSummary:
        "Mock Habasit America sample for Suwanee, GA focused on conveyor and belting applications, customer problem solving, plant coordination, and technical sales partnership.",
      checkpointSummary:
        "Evidence supports a strong technical-fit path for a Georgia-based applications role tied to conveyor and belting workflows.",
      memoType: "offer",
      memoSummary:
        "Closed-won sample should demonstrate how clean narrative, correspondence, and operating evidence survive export/import at the end of a 30-day cycle.",
      correspondenceSubject: "Habasit America applications engineering follow-up",
      correspondenceBody:
        "Thank you for the Suwanee conversation. I can support conveyor applications, technical customer translation, and plant-facing troubleshooting while staying grounded in fast operational follow-through.",
      coachingBody:
        "Town hall note: this sample should show a premium industrial workflow, not a demo. Candidate story, interview evidence, and offer review all need to read like one operating thread.",
      profile: {
        skillsSummary:
          "Industrial applications engineering, belt and conveyor troubleshooting, field support, customer translation, technical discovery",
        experienceLevel: "Senior individual contributor",
        strengths: "Strong on plant-floor communication, technical issue framing, and converting field evidence into usable action",
        gaps: "Needs sharper compensation framing and cleaner employer-of-record timeline language",
      },
      timeline: {
        createdDaysAgo: 30,
        updatedDaysAgo: 1,
        checkpointDaysAgo: [29, 26, 22, 18, 14, 10, 6, 2],
        taskDaysAgo: [1, 28, 25, 20, 16, 12, 8, 4, 2],
        memoDaysAgo: [27, 5],
        correspondenceDaysAgo: [23, 11],
        artifactDaysAgo: [30, 29, 9],
        stageEventDaysAgo: [30, 27, 24, 20, 16, 12, 8, 4, 1],
      },
    }),
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[1],
      roleTitle: "Fabrication Technician, Timing Belt Operations",
      source: "Mock sample based on Habasit America Suwanee fabrication operations",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 6,
      finalStage: "offer_review",
      employmentType: "Full-time",
      locationType: "Onsite - Suwanee, GA",
      resumeSummary:
        "Darius has machine setup, fabrication support, forklift, shift coordination, and documented production reliability experience after re-entry workforce training.",
      jdSummary:
        "Mock Habasit America fabrication sample for Suwanee, GA focused on timing belt fabrication, production quality, shift handoffs, and dependable plant operations.",
      checkpointSummary:
        "Candidate is technically credible for operations support, but the support path must stay local-only by default and encouragement must be explicit.",
      memoType: "positioning",
      memoSummary:
        "Sensitive-support sample should prove re-entry guidance, export exclusion by default, and optional inclusion only when intentionally enabled.",
      correspondenceSubject: "Habasit America fabrication shift discussion",
      correspondenceBody:
        "I appreciate the chance to discuss the fabrication role in Suwanee. I can contribute on shift, stay coachable, and bring consistent attendance plus careful production follow-through.",
      coachingBody:
        "Town hall note: this sample exists to verify the product can handle re-entry support with dignity, practical next steps, and strict export boundaries.",
      profile: {
        skillsSummary:
          "Fabrication support, production floor discipline, machine changeovers, quality checks, dependable shift execution",
        experienceLevel: "Early-mid operations contributor",
        strengths: "Reliable execution, willingness to learn, and calm documentation habits under supervision",
        gaps: "Needs confidence support around background questions and a cleaner explanation of recent work history",
      },
      timeline: {
        createdDaysAgo: 28,
        updatedDaysAgo: 2,
        checkpointDaysAgo: [27, 24, 21, 17, 13, 9, 5, 2],
        taskDaysAgo: [2, 26, 23, 19, 15, 11, 7, 3, 2],
        memoDaysAgo: [22, 6],
        correspondenceDaysAgo: [20, 8],
        artifactDaysAgo: [28, 27, 12],
        stageEventDaysAgo: [28, 25, 22, 18, 14, 10, 6],
      },
      support: {
        categories: ["criminal_history", "reentry", "background_concern"],
        notes:
          "Candidate disclosed re-entry context and wants help answering background questions without shame or oversharing.",
        encouragementPlan:
          "Keep support local-only, practice a short truthful explanation, and anchor the story in reliability, coachability, and current work readiness.",
        includeInExport: false,
        updatedDaysAgo: 2,
      },
    }),
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[2],
      roleTitle: "Customer Operations And Continuous Improvement Lead",
      source: "Mock sample based on Habasit America Suwanee customer support and operations coordination",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 7,
      finalStage: "closed_lost",
      employmentType: "Full-time",
      locationType: "Hybrid - Suwanee, GA",
      resumeSummary:
        "Melissa has customer operations, quoting support, process cleanup, and reporting discipline after a recent layoff from a manufacturing-adjacent employer.",
      jdSummary:
        "Mock Habasit America operations sample for Suwanee, GA focused on customer operations, process improvement, quoting coordination, and cross-functional reliability.",
      checkpointSummary:
        "The candidate is viable, but this scenario should prove layoff-recovery coaching, compensation education, and graceful close-lost handling.",
      memoType: "final",
      memoSummary:
        "Closed-lost sample should still export cleanly with a readable story, compensation education evidence, and debrief history intact.",
      correspondenceSubject: "Habasit America operations follow-up and next steps",
      correspondenceBody:
        "Thank you for the update. Even if timing does not align right now, I value the conversation and can clearly speak to customer operations, process discipline, and rapid onboarding support.",
      coachingBody:
        "Town hall note: this sample should prove the product stays supportive after a loss instead of collapsing into a dead-end tracker.",
      profile: {
        skillsSummary:
          "Customer operations, process improvement, quoting support, reporting cadence, manufacturing-adjacent coordination",
        experienceLevel: "Mid-senior operations lead",
        strengths: "Strong calm-through-chaos communication and practical process cleanup instincts",
        gaps: "Needs layoff narrative support and tighter compensation framing after a disrupted last role",
      },
      timeline: {
        createdDaysAgo: 26,
        updatedDaysAgo: 0,
        checkpointDaysAgo: [25, 22, 19, 15, 11, 7, 3, 0],
        taskDaysAgo: [0, 24, 21, 17, 13, 9, 5, 2, 0],
        memoDaysAgo: [20, 1],
        correspondenceDaysAgo: [18, 4],
        artifactDaysAgo: [26, 25, 14],
        stageEventDaysAgo: [26, 23, 20, 16, 12, 8, 4, 2, 0],
      },
      support: {
        categories: ["layoff", "fired"],
        notes:
          "Candidate is processing a layoff and wants help keeping confidence and structure while re-entering a premium industrial environment.",
        encouragementPlan:
          "Normalize the layoff, focus on measurable process wins, and use compensation education to rebuild decision confidence before the next offer cycle.",
        includeInExport: true,
        updatedDaysAgo: 1,
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
  const events = seededBundles.flatMap((bundle) => bundle.events);
  const sensitiveSupportProfiles = seededBundles.flatMap(
    (bundle) => bundle.sensitiveSupportProfiles,
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

  const habasitEnterpriseControls: EnterpriseControlProfile[] = [
    createEnterpriseControlProfile({
      account_id: habasitAccount.account_id,
      entitlements_mode: "admin_controlled",
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: true,
      local_only_posture_locked: true,
      deployment_posture:
        "Local-only browser workspace with persistent sample history, buyer packet review, and ZIP handoff discipline.",
      buyer_readiness_stage: "guided_pilot",
      notes:
        "CEO town hall sample for Habasit America in Suwanee, GA. Used to capture failures, prove export/import, and harden the app from demo into product.",
    }),
  ];
  const habasitRoleEntitlements: RoleEntitlement[] = [
    createRoleEntitlement({
      account_id: habasitAccount.account_id,
      role_name: "CEO Town Hall Observer",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Can review failures, release posture, and sample-state evidence in one workspace.",
    }),
  ];

  const allOpportunities = [...opportunities, ...habasitBundles.map((bundle) => bundle.opportunity)];
  const allProfiles = [...candidateProfiles, ...habasitBundles.map((bundle) => bundle.profile)];
  const allArtifacts = [...artifacts, ...habasitBundles.flatMap((bundle) => bundle.artifacts)];
  const allCheckpoints = [...checkpoints, ...habasitBundles.flatMap((bundle) => bundle.checkpoints)];
  const allTasks = [...tasks, ...habasitBundles.flatMap((bundle) => bundle.tasks)];
  const allEscalations = [...escalations, ...habasitBundles.flatMap((bundle) => bundle.escalations)];
  const allMemos = [...memos, ...habasitBundles.flatMap((bundle) => bundle.memos)];
  const allCorrespondence = [...correspondence, ...habasitBundles.flatMap((bundle) => bundle.correspondence)];
  const allCandidateStories = [
    ...candidateStories,
    ...habasitBundles.map((bundle) => bundle.candidateStory),
  ];
  const allEvents = [...events, ...habasitBundles.flatMap((bundle) => bundle.events)];
  const allSupportProfiles = [
    ...sensitiveSupportProfiles,
    ...habasitBundles.flatMap((bundle) => bundle.sensitiveSupportProfiles),
  ];

  const baseState: AppState = {
    schemaVersion: SCHEMA_VERSION,
    accounts: [account, habasitAccount],
    users: [user, ...habasitUsers],
    opportunities: allOpportunities,
    artifacts: allArtifacts,
    candidateProfiles: allProfiles,
    events: allEvents,
    checkpoints: allCheckpoints,
    tasks: allTasks,
    escalations: allEscalations,
    memos: allMemos,
    reportingSnapshots: [],
    correspondence: allCorrespondence,
    candidateStories: allCandidateStories,
    sensitiveSupportProfiles: allSupportProfiles,
    enterpriseControlProfiles: [...enterpriseControlProfiles, ...habasitEnterpriseControls],
    roleEntitlements: [...roleEntitlements, ...habasitRoleEntitlements],
    releaseArtifactReviews: [],
    outcomes: [],
    selectedAccountId: account.account_id,
    selectedUserId: user.user_id,
    selectedOpportunityId: allOpportunities[0].opportunity_id,
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
