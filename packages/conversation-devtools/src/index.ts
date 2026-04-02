import {
  ConversationState,
  ConversationStep,
  getCurrentStep,
  getProgress,
  getSnapshot,
  getStaleSteps,
  getTranscript,
} from "../../conversation-core/src";
import { getConversationSchemaMeta } from "../../conversation-schema/src";

export type ConversationDebugReport = {
  schemaVersion: string;
  progress: number;
  currentStepId: string | null;
  answeredStepIds: string[];
  staleStepIds: string[];
  transcriptCount: number;
};

export function createConversationDebugReport(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationDebugReport {
  return {
    schemaVersion: getConversationSchemaMeta().version,
    progress: getProgress(steps, state),
    currentStepId: getCurrentStep(steps, state)?.id ?? null,
    answeredStepIds: getSnapshot(steps, state).map((item) => item.stepId),
    staleStepIds: getStaleSteps(steps, state).map((step) => step.id),
    transcriptCount: getTranscript(steps, state).length,
  };
}
