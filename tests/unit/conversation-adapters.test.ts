import { describe, expect, it } from "vitest";
import {
  commitMonyawnConversationResult,
  hydrateMonyawnConversationDrafts,
} from "../../packages/conversation-adapters/src";
import {
  defaultAccountDraft,
  defaultOpportunityDraft,
  defaultUserDraft,
} from "../../src/context/MonyawnContext.types";
import { createSeedState } from "../../src/seed";

describe("conversation adapters", () => {
  it("hydrates drafts from signal content before commit", () => {
    const drafts = hydrateMonyawnConversationDrafts({
      accountDraft: defaultAccountDraft,
      userDraft: {
        ...defaultUserDraft,
        full_name: "Ari Lane",
      },
      opportunityDraft: defaultOpportunityDraft,
      signal: {
        signalType: "job_link",
        signalText: "Senior Controls Engineer at Nova Robotics",
        signalUrl: "https://jobs.novarobotics.com/roles/senior-controls-engineer",
      },
    });

    expect(drafts.accountDraft.account_name).toBe("Ari Lane workspace");
    expect(drafts.opportunityDraft.company_name).toBe("Nova Robotics");
    expect(drafts.opportunityDraft.job_posting_url).toContain("novarobotics.com");
  });

  it("commits a new opportunity and reopens it on duplicate submission", () => {
    const baseState = createSeedState();
    const drafts = {
      accountDraft: {
        ...defaultAccountDraft,
        account_name: "Cash Crew",
        account_type: "enterprise" as const,
      },
      userDraft: {
        ...defaultUserDraft,
        full_name: "Ari Lane",
        email: "ari@example.com",
      },
      opportunityDraft: {
        ...defaultOpportunityDraft,
        company_name: "Nova Robotics",
        role_title: "Senior Controls Engineer",
        job_posting_url: "https://jobs.novarobotics.com/roles/senior-controls-engineer",
      },
      signal: {
        signalType: "job_link" as const,
        signalText: "Senior Controls Engineer at Nova Robotics",
        signalUrl: "https://jobs.novarobotics.com/roles/senior-controls-engineer",
      },
    };

    const first = commitMonyawnConversationResult({
      state: baseState,
      ...drafts,
    });

    expect(first).toBeTruthy();
    expect(first!.reopenedExisting).toBe(false);
    expect(first!.nextState.opportunities.length).toBe(baseState.opportunities.length + 1);

    const second = commitMonyawnConversationResult({
      state: first!.nextState,
      ...drafts,
    });

    expect(second).toBeTruthy();
    expect(second!.reopenedExisting).toBe(true);
    expect(second!.patchLabel).toContain("reopened");
    expect(second!.nextState.opportunities.length).toBe(first!.nextState.opportunities.length);
  });
});
