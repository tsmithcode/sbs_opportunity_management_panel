import {
  DecisionMemo,
  Opportunity,
  SensitiveSupportProfile,
  StageEvent,
  User,
} from "../../types";
import {
  extractSignalsFromText,
} from "../../intelligence";
import {
  createArtifact,
  createCorrespondence,
  createMemo,
  createSensitiveSupportProfile,
  createStageEvent,
  createTask,
} from "../../workflow";
import { SeedBundle } from "../types";
import { daysAgoIso, markBundleTimeline } from "../utils";
import { buildSeedOpportunity } from "../base";

export function buildHabasitOpportunity(input: {
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
