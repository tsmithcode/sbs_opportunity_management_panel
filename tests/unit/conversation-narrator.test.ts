import { describe, expect, it } from "vitest";
import {
  getConversationBridge,
  getConversationCompletionSummary,
  getConversationRecap,
  getReplayNarration,
} from "../../src/conversation/narrator";
import { intakeConversationSteps } from "../../src/conversation/intakeConversation";

describe("conversation narrator", () => {
  it("creates a useful recap from snapshot history", () => {
    const recap = getConversationRecap([
      {
        stepId: "signalType",
        module: "Origin",
        label: "What are we working from?",
        summary: "Quick note",
        updatedAt: "2026-04-02T00:00:00.000Z",
        version: 1,
      },
    ]);

    expect(recap).toContain("starting from Quick note");
  });

  it("bridges from previous answer into the next prompt", () => {
    const bridge = getConversationBridge(
      intakeConversationSteps.find((step) => step.id === "fullName"),
      intakeConversationSteps.find((step) => step.id === "signalText"),
      [
        {
          stepId: "signalText",
          module: "Origin",
          label: "Drop the proof",
          summary: "Recruiter note about a controls engineer role",
          updatedAt: "2026-04-02T00:00:00.000Z",
          version: 1,
        },
      ],
    );

    expect(bridge).toContain("Recruiter note");
    expect(bridge).toContain("right name");
  });

  it("writes a concise completion summary", () => {
    const summary = getConversationCompletionSummary([
      {
        stepId: "companyName",
        module: "The Play",
        label: "Who's the company?",
        summary: "Nova Robotics",
        updatedAt: "2026-04-02T00:00:00.000Z",
        version: 1,
      },
      {
        stepId: "roleTitle",
        module: "The Play",
        label: "What role are we chasing?",
        summary: "Senior Controls Engineer",
        updatedAt: "2026-04-02T00:00:00.000Z",
        version: 1,
      },
      {
        stepId: "pathway",
        module: "The Play",
        label: "What kind of bag is this?",
        summary: "Payroll job",
        updatedAt: "2026-04-02T00:00:00.000Z",
        version: 1,
      },
    ]);

    expect(summary).toContain("Nova Robotics");
    expect(summary).toContain("Senior Controls Engineer");
  });

  it("describes replay state clearly", () => {
    expect(getReplayNarration(2)).toContain("2 answers");
  });
});
