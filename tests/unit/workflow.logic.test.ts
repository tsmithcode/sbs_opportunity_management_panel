import { describe, expect, it } from "vitest";
import { createSeedState } from "../../src/seed";
import { getGovernanceOverlays, getNextStage, isClosedStage } from "../../src/workflow/logic";

describe("workflow logic", () => {
  it("advances through active stages but stops before closed states", () => {
    expect(getNextStage("intake_started")).toBe("intake_complete");
    expect(getNextStage("offer_review")).toBe("closed_won");
    expect(getNextStage("closed_won")).toBe("closed_won");
  });

  it("detects closed stages correctly", () => {
    expect(isClosedStage("closed_won")).toBe(true);
    expect(isClosedStage("closed_lost")).toBe(true);
    expect(isClosedStage("outreach_ready")).toBe(false);
  });

  it("adds governance overlays for higher-risk contexts", () => {
    const state = createSeedState();
    const account = { ...state.accounts[0], account_type: "government" as const };
    const user = { ...state.users[0], sponsorship_type: "managed_service" as const, region: "EU West" };
    const opportunity = { ...state.opportunities[0], current_stage: "offer_review" as const };

    const overlays = getGovernanceOverlays(account, user, opportunity);

    expect(overlays).toContain(
      "Government account: route legal, accessibility, and procurement questions to staffed reviewers.",
    );
    expect(overlays).toContain(
      "Managed-service overlay: staff queues and review ownership are part of the product promise.",
    );
    expect(overlays).toContain(
      "Region-sensitive privacy review is required before making stronger cross-border data claims.",
    );
    expect(overlays).toContain("External use blocked until explicit approval is recorded.");
  });
});
