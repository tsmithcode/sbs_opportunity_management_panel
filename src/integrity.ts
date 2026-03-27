import type { AppState } from "./types";

export type IntegrityReport = {
  errors: string[];
  warnings: string[];
  infos: string[];
};

function hasAccount(state: AppState, accountId: string) {
  return state.accounts.some((account) => account.account_id === accountId);
}

function hasUser(state: AppState, userId: string) {
  return state.users.some((user) => user.user_id === userId);
}

function hasOpportunity(state: AppState, opportunityId: string) {
  return state.opportunities.some(
    (opportunity) => opportunity.opportunity_id === opportunityId,
  );
}

export function validateAppStateIntegrity(state: AppState): IntegrityReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];

  if (!hasAccount(state, state.selectedAccountId)) {
    errors.push("Selected account is missing from the current state.");
  }

  if (!hasUser(state, state.selectedUserId)) {
    errors.push("Selected user is missing from the current state.");
  }

  if (!hasOpportunity(state, state.selectedOpportunityId)) {
    errors.push("Selected opportunity is missing from the current state.");
  }

  state.users.forEach((user) => {
    if (!hasAccount(state, user.account_id)) {
      errors.push(`User ${user.full_name} references a missing account.`);
    }
  });

  state.opportunities.forEach((opportunity) => {
    if (!hasAccount(state, opportunity.account_id)) {
      errors.push(
        `Opportunity ${opportunity.company_name} references a missing account.`,
      );
    }

    if (!hasUser(state, opportunity.user_id)) {
      errors.push(`Opportunity ${opportunity.company_name} references a missing user.`);
    }
  });

  state.candidateProfiles.forEach((profile) => {
    if (!hasUser(state, profile.user_id) || !hasOpportunity(state, profile.opportunity_id)) {
      errors.push(`Candidate profile ${profile.profile_id} has a broken user/opportunity link.`);
    }
  });

  state.artifacts.forEach((artifact) => {
    if (!hasOpportunity(state, artifact.opportunity_id)) {
      errors.push(`Artifact ${artifact.source_label} references a missing opportunity.`);
    }
  });

  state.tasks.forEach((task) => {
    if (!hasOpportunity(state, task.opportunity_id)) {
      errors.push(`Task ${task.task_type} references a missing opportunity.`);
    }
  });

  state.checkpoints.forEach((checkpoint) => {
    if (!hasOpportunity(state, checkpoint.opportunity_id)) {
      errors.push(`Checkpoint ${checkpoint.step_name} references a missing opportunity.`);
    }
  });

  state.escalations.forEach((escalation) => {
    if (!hasOpportunity(state, escalation.opportunity_id)) {
      errors.push(
        `Escalation ${escalation.escalation_type} references a missing opportunity.`,
      );
    }
  });

  state.correspondence.forEach((item) => {
    if (!hasOpportunity(state, item.opportunity_id)) {
      errors.push(
        `Correspondence ${item.subject || item.correspondence_id} references a missing opportunity.`,
      );
    }
  });

  state.candidateStories.forEach((story) => {
    if (!hasOpportunity(state, story.opportunity_id)) {
      errors.push(`Candidate story ${story.title} references a missing opportunity.`);
    }
  });

  state.sensitiveSupportProfiles.forEach((profile) => {
    if (!hasOpportunity(state, profile.opportunity_id)) {
      errors.push(
        `Sensitive support profile ${profile.support_profile_id} references a missing opportunity.`,
      );
    }
  });

  state.accounts.forEach((account) => {
    if (
      !state.enterpriseControlProfiles.some(
        (profile) => profile.account_id === account.account_id,
      )
    ) {
      warnings.push(`Account ${account.account_name} is missing an enterprise control profile.`);
    }

    if (
      !state.roleEntitlements.some(
        (entitlement) => entitlement.account_id === account.account_id,
      )
    ) {
      warnings.push(`Account ${account.account_name} has no role entitlements configured.`);
    }
  });

  if (!state.lastExportedAt) {
    warnings.push("No durable ZIP export has been created yet for this local workspace.");
  }

  const selectedOpportunityStory = state.candidateStories.find(
    (story) => story.opportunity_id === state.selectedOpportunityId,
  );
  if (!selectedOpportunityStory) {
    warnings.push("Selected opportunity does not yet have a candidate story.");
  }

  const blockingTasks = state.tasks.filter(
    (task) =>
      task.opportunity_id === state.selectedOpportunityId &&
      task.blocking &&
      task.status !== "completed" &&
      task.status !== "cancelled",
  ).length;
  if (blockingTasks > 0) {
    warnings.push(
      `Selected opportunity still has ${blockingTasks} blocking task${blockingTasks === 1 ? "" : "s"}.`,
    );
  }

  infos.push(`Accounts: ${state.accounts.length}`);
  infos.push(`Users: ${state.users.length}`);
  infos.push(`Opportunities: ${state.opportunities.length}`);
  infos.push(`Artifacts: ${state.artifacts.length}`);
  infos.push(`Candidate stories: ${state.candidateStories.length}`);

  return { errors, warnings, infos };
}
