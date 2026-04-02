import {
  applyResponse,
  createConversationState,
  getCurrentStep,
} from "../packages/conversation-core/src";
import { intakeConversationSteps } from "../packages/conversation-schema/src";
import { createConversationDebugReport } from "../packages/conversation-devtools/src";

let state = createConversationState();

state = applyResponse(intakeConversationSteps, state, "signalType", "job_text");
state = applyResponse(
  intakeConversationSteps,
  state,
  "signalText",
  "Senior controls engineer role at Nova Robotics",
);

const currentStep = getCurrentStep(intakeConversationSteps, state);
const report = createConversationDebugReport(intakeConversationSteps, state);

export const starterExample = {
  currentStepId: currentStep?.id ?? null,
  report,
};
