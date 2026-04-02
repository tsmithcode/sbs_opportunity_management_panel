import { describe, expect, it } from "vitest";
import {
  applyResponse,
  createConversationState,
  getCurrentStep,
  getProgress,
  getSnapshot,
  getStaleSteps,
  getTranscript,
  getVisibleSteps,
  validateStep,
} from "../../packages/conversation-core/src";
import {
  buildConversationSeedState,
  deriveConversationState,
  intakeConversationSteps,
} from "../../src/conversation/intakeConversation";
import {
  defaultAccountDraft,
  defaultOpportunityDraft,
  defaultUserDraft,
} from "../../src/context/MonyawnContext.types";

describe("conversation core", () => {
  it("walks the golden path in declaration order", () => {
    let state = createConversationState();

    expect(getCurrentStep(intakeConversationSteps, state)?.id).toBe("signalType");

    state = applyResponse(intakeConversationSteps, state, "signalType", "job_link");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Senior engineer role");

    expect(getCurrentStep(intakeConversationSteps, state)?.id).toBe("signalUrl");
    expect(getVisibleSteps(intakeConversationSteps, state).map((step) => step.id)).toContain("signalUrl");
  });

  it("clears downstream answers when an earlier answer changes", () => {
    let state = createConversationState();
    state = applyResponse(intakeConversationSteps, state, "signalType", "job_text");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Some proof");
    state = applyResponse(intakeConversationSteps, state, "fullName", "Thomas Smith");
    state = applyResponse(intakeConversationSteps, state, "email", "thomas@example.com");

    state = applyResponse(intakeConversationSteps, state, "signalType", "recruiter_email");

    const snapshot = getSnapshot(intakeConversationSteps, state);
    expect(snapshot.map((item) => item.stepId)).toEqual(["signalType"]);
    expect(getCurrentStep(intakeConversationSteps, state)?.id).toBe("signalText");
    expect(getStaleSteps(intakeConversationSteps, state).map((step) => step.id)).toEqual([
      "signalText",
      "fullName",
      "email",
    ]);
    expect(getTranscript(intakeConversationSteps, state).some((item) => item.kind === "stale")).toBe(true);
  });

  it("validates required and conditional fields correctly", () => {
    let state = createConversationState();
    state = applyResponse(intakeConversationSteps, state, "signalType", "job_link");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Role text");

    const urlStep = intakeConversationSteps.find((step) => step.id === "signalUrl");
    expect(urlStep).toBeTruthy();
    expect(validateStep(urlStep!, "", state)).toBe("A job link needs the actual URL.");
  });

  it("reports progress as answers accumulate", () => {
    let state = createConversationState();
    state = applyResponse(intakeConversationSteps, state, "signalType", "note");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Messy notes from a recruiter ping");

    expect(getProgress(intakeConversationSteps, state)).toBeGreaterThan(0);
    expect(getSnapshot(intakeConversationSteps, state)).toHaveLength(2);
  });

  it("seeds account answers and derives a workspace-ready account draft", () => {
    const seeded = buildConversationSeedState(
      {
        ...defaultAccountDraft,
        account_name: "Money Crew",
        account_type: "enterprise",
      },
      {
        ...defaultUserDraft,
        full_name: "Thomas Smith",
      },
      defaultOpportunityDraft,
    );

    expect(getSnapshot(intakeConversationSteps, seeded).map((item) => item.stepId)).toContain("accountName");
    expect(getSnapshot(intakeConversationSteps, seeded).map((item) => item.stepId)).toContain("accountType");

    const derived = deriveConversationState(
      defaultAccountDraft,
      {
        ...defaultUserDraft,
        full_name: "Thomas Smith",
      },
      defaultOpportunityDraft,
      {
        fullName: "Thomas Smith",
        signalText: "Recruiter said this is a senior controls engineer job",
      },
    );

    expect(derived.accountDraft.account_name).toBe("Thomas Smith workspace");
    expect(derived.accountDraft.account_type).toBe("enterprise");
  });

  it("keeps an immutable transcript when answers are edited and replayed", () => {
    let state = createConversationState();
    state = applyResponse(intakeConversationSteps, state, "signalType", "job_text");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Original proof");
    state = applyResponse(intakeConversationSteps, state, "fullName", "Thomas Smith");
    state = applyResponse(intakeConversationSteps, state, "signalText", "Updated proof after review");

    const transcript = getTranscript(intakeConversationSteps, state);
    const signalTextEntries = transcript.filter((item) => item.stepId === "signalText");

    expect(signalTextEntries.filter((item) => item.kind === "answer")).toHaveLength(2);
    expect(getStaleSteps(intakeConversationSteps, state).map((step) => step.id)).toContain("fullName");
  });
});
