import { describe, expect, it } from "vitest";
import { applyResponse, createConversationState } from "../../packages/conversation-core/src";
import { createConversationDebugReport } from "../../packages/conversation-devtools/src";
import { intakeConversationSteps } from "../../src/conversation/intakeConversation";

describe("conversation devtools", () => {
  it("creates a compact debug report for a running conversation", () => {
    let state = createConversationState();
    state = applyResponse(intakeConversationSteps, state, "signalType", "note");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Messy recruiter note");

    const report = createConversationDebugReport(intakeConversationSteps, state);

    expect(report.schemaVersion).toBe("2026.04.02");
    expect(report.progress).toBeGreaterThan(0);
    expect(report.answeredStepIds).toEqual(["signalType", "signalText"]);
    expect(report.currentStepId).toBe("fullName");
  });
});
