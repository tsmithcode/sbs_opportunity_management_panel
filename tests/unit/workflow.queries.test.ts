import { describe, expect, it } from "vitest";
import { createSeedState } from "../../src/seed";
import {
  getCompletionScore,
  getOpportunityArtifacts,
  getOpportunityCandidateStory,
  getOpportunityCheckpoints,
  getOpportunityCorrespondence,
  getOpportunitySensitiveSupport,
  getOpportunityTasks,
} from "../../src/workflow/queries";

describe("workflow queries", () => {
  it("returns scoped records for the selected opportunity", () => {
    const state = createSeedState();
    const opportunityId = state.selectedOpportunityId;

    expect(getOpportunityArtifacts(state, opportunityId).length).toBeGreaterThan(0);
    expect(getOpportunityTasks(state, opportunityId).length).toBeGreaterThan(0);
    expect(getOpportunityCheckpoints(state, opportunityId).length).toBeGreaterThan(0);
    expect(getOpportunityCorrespondence(state, opportunityId).length).toBeGreaterThan(0);
    expect(getOpportunityCandidateStory(state, opportunityId)).toBeTruthy();
    expect(getOpportunitySensitiveSupport(state, opportunityId)).toBeUndefined();
  });

  it("calculates completion score from stage progress and outcome bonus", () => {
    const state = createSeedState();
    const opportunityId = state.selectedOpportunityId;
    const baseScore = getCompletionScore(state, opportunityId);

    expect(baseScore).toBeGreaterThan(0);

    const withOutcome = {
      ...state,
      outcomes: [
        ...state.outcomes,
        {
          outcome_id: "outcome_test",
          opportunity_id: opportunityId,
          resolution: "awarded" as const,
          lessons_learned: "Bag secured",
          market_intelligence: "Strong offer lane",
          content_potential: "medium" as const,
          blog_article_generated: false,
          updated_at: new Date().toISOString(),
        },
      ],
    };

    expect(getCompletionScore(withOutcome, opportunityId)).toBe(Math.min(100, baseScore + 10));
  });
});
