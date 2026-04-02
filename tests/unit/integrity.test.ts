import { describe, expect, it } from "vitest";
import { validateAppStateIntegrity } from "../../src/integrity";
import { createSeedState } from "../../src/seed";

describe("state integrity", () => {
  it("accepts the seeded state without structural errors", () => {
    const report = validateAppStateIntegrity(createSeedState());

    expect(report.errors).toHaveLength(0);
    expect(report.infos.length).toBeGreaterThan(0);
  });

  it("flags broken selections and foreign-key links", () => {
    const state = createSeedState();
    const brokenState = {
      ...state,
      selectedOpportunityId: "missing_opportunity",
      artifacts: [
        ...state.artifacts,
        {
          ...state.artifacts[0],
          artifact_id: "artifact_broken",
          opportunity_id: "missing_opportunity",
        },
      ],
    };

    const report = validateAppStateIntegrity(brokenState);

    expect(report.errors).toContain("Selected opportunity is missing from the current state.");
    expect(
      report.errors.some((item) => item.includes("references a missing opportunity")),
    ).toBe(true);
  });
});
