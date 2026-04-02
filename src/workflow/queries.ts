import {
  AICheckpoint,
  AppState,
  CandidateStory,
  CorrespondenceItem,
  Escalation,
  SensitiveSupportProfile,
  SourceArtifact,
  WorkflowTask,
} from "../types";
import { stageOrder } from "./constants";

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
