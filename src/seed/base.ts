import {
  AICheckpoint,
  DecisionMemo,
  Escalation,
  Opportunity,
  StageEvent,
  WorkflowTask,
} from "../types";
import {
  createCandidateStoryRecord,
  extractSignalsFromText,
  generateCandidateStory,
} from "../intelligence";
import {
  createArtifact,
  createCandidateProfile,
  createCheckpoint,
  createCorrespondence,
  createEscalation,
  createMemo,
  createOpportunity,
  createStageEvent,
  createTask,
  nowIso,
} from "../workflow";
import { SeedBundle } from "./types";

export function buildSeedOpportunity(input: {
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
    use_case_id: "monyawn",
    pathway: "w2",
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
