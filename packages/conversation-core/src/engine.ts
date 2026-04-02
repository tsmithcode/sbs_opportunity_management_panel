import {
  ConversationHistoryEntry,
  ConversationResponse,
  ConversationSnapshotItem,
  ConversationState,
  ConversationStep,
  ConversationTranscriptItem,
} from "./types";

export function createConversationState(
  responses: Record<string, ConversationResponse> = {},
  history: ConversationHistoryEntry[] = [],
  staleStepIds: string[] = [],
): ConversationState {
  return { responses, history, staleStepIds };
}

export function getAnswers(state: ConversationState): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(state.responses).map(([stepId, response]) => [stepId, response.value]),
  );
}

export function getVisibleSteps(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationStep[] {
  const answers = getAnswers(state);
  return steps.filter((step) => step.isVisible?.(answers) ?? true);
}

export function getCurrentStep(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationStep | undefined {
  const visibleSteps = getVisibleSteps(steps, state);
  return visibleSteps.find((step) => !(step.id in state.responses));
}

export function getStepIndex(steps: ConversationStep[], stepId: string): number {
  return steps.findIndex((step) => step.id === stepId);
}

export function applyResponse(
  steps: ConversationStep[],
  state: ConversationState,
  stepId: string,
  value: unknown,
): ConversationState {
  const now = new Date().toISOString();
  const stepIndex = getStepIndex(steps, stepId);
  if (stepIndex === -1) {
    return state;
  }

  const nextResponses: Record<string, ConversationResponse> = {};
  const nextHistory = [...state.history];
  const staleStepIds = new Set(state.staleStepIds);
  for (const [currentStepId, response] of Object.entries(state.responses)) {
    const currentIndex = getStepIndex(steps, currentStepId);
    if (currentIndex !== -1 && currentIndex < stepIndex) {
      nextResponses[currentStepId] = response;
      staleStepIds.delete(currentStepId);
      continue;
    }

    if (currentIndex !== -1 && currentIndex > stepIndex) {
      staleStepIds.add(currentStepId);
      nextHistory.push({
        kind: "stale",
        stepId: currentStepId,
        invalidatedByStepId: stepId,
        previousValue: response.value,
        updatedAt: now,
        version: response.version,
      });
    }
  }

  const previousVersion = state.responses[stepId]?.version ?? 0;
  nextResponses[stepId] = {
    value,
    updatedAt: now,
    version: previousVersion + 1,
  };
  staleStepIds.delete(stepId);
  nextHistory.push({
    kind: "answer",
    stepId,
    value,
    updatedAt: now,
    version: previousVersion + 1,
  });

  return createConversationState(nextResponses, nextHistory, Array.from(staleStepIds));
}

export function getProgress(steps: ConversationStep[], state: ConversationState): number {
  const visibleSteps = getVisibleSteps(steps, state);
  if (visibleSteps.length === 0) {
    return 0;
  }

  const answered = visibleSteps.filter((step) => step.id in state.responses).length;
  return Math.round((answered / visibleSteps.length) * 100);
}

export function getSnapshot(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationSnapshotItem[] {
  const answers = getAnswers(state);

  return getVisibleSteps(steps, state)
    .filter((step) => state.responses[step.id])
    .map((step) => {
      const response = state.responses[step.id];
      const fallback =
        typeof response.value === "boolean"
          ? response.value
            ? "Yes"
            : "No"
          : String(response.value ?? "");

      return {
        stepId: step.id,
        module: step.module,
        label: step.label,
        summary: step.summarize?.(response.value, answers) ?? fallback,
        updatedAt: response.updatedAt,
        version: response.version,
      };
    });
}

export function getTranscript(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationTranscriptItem[] {
  return state.history.map((entry) => {
    const step = steps.find((candidate) => candidate.id === entry.stepId);
    const answers = getAnswers(state);
    const fallbackValue =
      entry.kind === "answer"
        ? entry.value
        : entry.previousValue;
    const fallback =
      typeof fallbackValue === "boolean"
        ? fallbackValue
          ? "Yes"
          : "No"
        : String(fallbackValue ?? "");

    return {
      kind: entry.kind,
      stepId: entry.stepId,
      module: step?.module ?? "Unknown",
      label: step?.label ?? entry.stepId,
      summary: step?.summarize?.(fallbackValue, answers) ?? fallback,
      updatedAt: entry.updatedAt,
      version: entry.version,
      invalidatedByStepId:
        entry.kind === "stale" ? entry.invalidatedByStepId : undefined,
    };
  });
}

export function getStaleSteps(
  steps: ConversationStep[],
  state: ConversationState,
): ConversationStep[] {
  return state.staleStepIds
    .map((stepId) => steps.find((step) => step.id === stepId))
    .filter((step): step is ConversationStep => Boolean(step));
}

export function validateStep(
  step: ConversationStep,
  value: unknown,
  state: ConversationState,
): string | null {
  const isEmptyString = typeof value === "string" && value.trim().length === 0;
  const isMissing = value === undefined || value === null || isEmptyString;

  if (isMissing && !step.optional) {
    return "This one still needs an answer.";
  }

  if (step.validate) {
    return step.validate(value, getAnswers(state));
  }

  if (isMissing && step.optional) {
    return null;
  }

  return null;
}
