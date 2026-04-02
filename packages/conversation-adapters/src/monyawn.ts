import { SignalIntakePayload } from "../../../src/components/pages/SignalIntake/SignalIntakePage.contract";
import {
  AccountDraft,
  OpportunityDraft,
  UserDraft,
} from "../../../src/context/MonyawnContext.types";
import {
  AICheckpoint,
  AppState,
  CandidateProfile,
  EnterpriseControlProfile,
  Opportunity,
  RoleEntitlement,
  SourceArtifact,
  StageEvent,
  WorkflowTask,
} from "../../../src/types";
import {
  createAccount,
  createArtifact,
  createCandidateProfile,
  createCheckpoint,
  createEnterpriseControlProfile,
  createOpportunity,
  createRoleEntitlement,
  createStageEvent,
  createTask,
  createUser,
  nowIso,
} from "../../../src/workflow";
import {
  extractCompanies,
  extractEmails,
  extractRoleTitle,
  getSignalArtifactType,
  getSignalSourceLabel,
  inferCompanyFromUrl,
  summarizeSignalText,
} from "../../../src/conversation/inference";
import { ConversationAdapterOutcome } from "./types";

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export type MonyawnConversationDrafts = {
  accountDraft: AccountDraft;
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
};

export function hydrateMonyawnConversationDrafts(input: {
  accountDraft: AccountDraft;
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
  signal: SignalIntakePayload;
}): MonyawnConversationDrafts {
  const { accountDraft, userDraft, opportunityDraft, signal } = input;
  const combinedText = `${signal.signalText}\n${signal.signalUrl}`.trim();
  const companies = extractCompanies(combinedText);
  const emails = extractEmails(combinedText);
  const inferredCompany =
    companies[0] || inferCompanyFromUrl(signal.signalUrl) || opportunityDraft.company_name;
  const inferredRole = extractRoleTitle(signal.signalText) || opportunityDraft.role_title;

  const hydratedUserDraft = {
    ...userDraft,
    email: userDraft.email || emails[0] || "",
  };
  const hydratedOpportunityDraft = {
    ...opportunityDraft,
    company_name: inferredCompany || opportunityDraft.company_name,
    role_title: inferredRole || opportunityDraft.role_title,
    opportunity_source: signal.signalType.replace(/_/g, " "),
    job_posting_url: signal.signalUrl || opportunityDraft.job_posting_url,
  };
  const hydratedAccountDraft = {
    ...accountDraft,
    account_name:
      accountDraft.account_name.trim() ||
      (hydratedUserDraft.full_name.trim()
        ? `${hydratedUserDraft.full_name.trim()} workspace`
        : ""),
  };

  return {
    accountDraft: hydratedAccountDraft,
    userDraft: hydratedUserDraft,
    opportunityDraft: hydratedOpportunityDraft,
  };
}

export function commitMonyawnConversationResult(input: {
  state: AppState;
  accountDraft: AccountDraft;
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
  signal: SignalIntakePayload | null;
}): ConversationAdapterOutcome<AppState, MonyawnConversationDrafts> | null {
  const { state, accountDraft, userDraft, opportunityDraft, signal } = input;
  const trimmedName = userDraft.full_name.trim();
  const trimmedEmail = userDraft.email.trim();
  const trimmedCompany = opportunityDraft.company_name.trim();
  const trimmedRole = opportunityDraft.role_title.trim();

  if (!trimmedName || !trimmedCompany || !trimmedRole) {
    return null;
  }

  const normalizedEmail = normalizeValue(trimmedEmail);
  const normalizedName = normalizeValue(trimmedName);
  const normalizedCompany = normalizeValue(trimmedCompany);
  const normalizedRole = normalizeValue(trimmedRole);
  const normalizedUrl = normalizeValue(opportunityDraft.job_posting_url);

  const matchedUser = state.users.find((user) => {
    if (normalizedEmail && normalizeValue(user.email) === normalizedEmail) {
      return true;
    }
    return normalizeValue(user.full_name) === normalizedName;
  });

  const nextAccountAdditions: Array<ReturnType<typeof createAccount>> = [];
  const nextUserAdditions: Array<ReturnType<typeof createUser>> = [];
  const nextControlProfileAdditions: EnterpriseControlProfile[] = [];
  const nextEntitlementAdditions: RoleEntitlement[] = [];
  const nextOpportunityAdditions: Opportunity[] = [];
  const nextProfileAdditions: CandidateProfile[] = [];
  const nextCheckpointAdditions: AICheckpoint[] = [];
  const nextTaskAdditions: WorkflowTask[] = [];
  const nextEventAdditions: StageEvent[] = [];
  const nextArtifactAdditions: SourceArtifact[] = [];

  let selectedAccountId = matchedUser?.account_id ?? "";
  let selectedUserId = matchedUser?.user_id ?? "";
  let selectedOpportunityId = "";

  if (!matchedUser) {
    const account = createAccount({
      account_name: accountDraft.account_name.trim() || `${trimmedName} workspace`,
      account_type: accountDraft.account_type || "individual",
      primary_region: accountDraft.primary_region || userDraft.region || "United States",
      support_tier: accountDraft.support_tier || "Guided opportunity workspace",
    });

    nextAccountAdditions.push(account);
    selectedAccountId = account.account_id;

    nextControlProfileAdditions.push(
      createEnterpriseControlProfile({
        account_id: account.account_id,
        entitlements_mode: "guided_default",
        external_release_requires_approval: true,
        export_confirmation_required: true,
        allow_sensitive_support_export: false,
        local_only_posture_locked: true,
        deployment_posture: "Local-first guided opportunity workspace.",
        buyer_readiness_stage: "internal_only",
        notes: "Auto-created from fast opportunity confirmation.",
      }),
    );

    nextEntitlementAdditions.push(
      createRoleEntitlement({
        account_id: account.account_id,
        role_name: "Candidate / User",
        workspace_access: true,
        staff_queue_access: false,
        admin_console_access: false,
        export_package_access: true,
        diligence_packet_access: false,
        notes: "Default guided candidate access.",
      }),
      createRoleEntitlement({
        account_id: account.account_id,
        role_name: "Admin / Governance",
        workspace_access: true,
        staff_queue_access: true,
        admin_console_access: true,
        export_package_access: true,
        diligence_packet_access: true,
        notes: "Default governance access.",
      }),
    );

    const nextUser = createUser({
      account_id: account.account_id,
      ...userDraft,
      full_name: trimmedName,
      email: trimmedEmail,
    });

    nextUserAdditions.push(nextUser);
    selectedUserId = nextUser.user_id;
  } else {
    const mergedUser = {
      ...matchedUser,
      full_name: trimmedName || matchedUser.full_name,
      email: trimmedEmail || matchedUser.email,
      phone: userDraft.phone || matchedUser.phone,
      timezone: userDraft.timezone || matchedUser.timezone,
      region: userDraft.region || matchedUser.region,
      current_role: userDraft.current_role || matchedUser.current_role,
      target_role_family: userDraft.target_role_family || matchedUser.target_role_family,
      target_compensation: userDraft.target_compensation || matchedUser.target_compensation,
      accessibility_needs: userDraft.accessibility_needs || matchedUser.accessibility_needs,
      sponsorship_type: userDraft.sponsorship_type || matchedUser.sponsorship_type,
      updated_at: nowIso(),
    };

    if (JSON.stringify(mergedUser) !== JSON.stringify(matchedUser)) {
      nextUserAdditions.push(mergedUser);
    }

    if (!state.enterpriseControlProfiles.some((profile) => profile.account_id === matchedUser.account_id)) {
      nextControlProfileAdditions.push(
        createEnterpriseControlProfile({
          account_id: matchedUser.account_id,
          entitlements_mode: "guided_default",
          external_release_requires_approval: true,
          export_confirmation_required: true,
          allow_sensitive_support_export: false,
          local_only_posture_locked: true,
          deployment_posture: "Local-first guided opportunity workspace.",
          buyer_readiness_stage: "internal_only",
          notes: "Auto-created during fast confirmation.",
        }),
      );
    }

    if (state.roleEntitlements.filter((entitlement) => entitlement.account_id === matchedUser.account_id).length === 0) {
      nextEntitlementAdditions.push(
        createRoleEntitlement({
          account_id: matchedUser.account_id,
          role_name: "Candidate / User",
          workspace_access: true,
          staff_queue_access: false,
          admin_console_access: false,
          export_package_access: true,
          diligence_packet_access: false,
          notes: "Default guided candidate access.",
        }),
        createRoleEntitlement({
          account_id: matchedUser.account_id,
          role_name: "Admin / Governance",
          workspace_access: true,
          staff_queue_access: true,
          admin_console_access: true,
          export_package_access: true,
          diligence_packet_access: true,
          notes: "Default governance access.",
        }),
      );
    }
  }

  const matchedOpportunity = state.opportunities.find((currentOpportunity) => {
    if (
      currentOpportunity.account_id !== selectedAccountId ||
      currentOpportunity.user_id !== selectedUserId
    ) {
      return false;
    }

    const sameCompany = normalizeValue(currentOpportunity.company_name) === normalizedCompany;
    const sameRole = normalizeValue(currentOpportunity.role_title) === normalizedRole;
    const sameUrl = normalizedUrl
      ? normalizeValue(currentOpportunity.job_posting_url) === normalizedUrl
      : true;

    return sameCompany && sameRole && sameUrl;
  });

  let opportunity = matchedOpportunity;
  let profileExists = false;

  if (!opportunity) {
    opportunity = createOpportunity({
      account_id: selectedAccountId,
      user_id: selectedUserId,
      use_case_id: "monyawn",
      ...opportunityDraft,
      company_name: trimmedCompany,
      role_title: trimmedRole,
      opportunity_source: opportunityDraft.opportunity_source || "signal intake",
      job_posting_url: opportunityDraft.job_posting_url.trim(),
    });

    nextOpportunityAdditions.push(opportunity);
    nextProfileAdditions.push(createCandidateProfile(selectedUserId, opportunity.opportunity_id));
    nextCheckpointAdditions.push(
      createCheckpoint(
        opportunity,
        "Opportunity created",
        "Fast confirmation from signal intake",
        "high",
        "proceed",
        "A structured opportunity was created from a confirmed signal with minimal manual entry.",
        "none",
        "low",
      ),
    );
    nextTaskAdditions.push(
      createTask(
        opportunity.opportunity_id,
        "Review generated opportunity context and next steps",
        "Customer Success Lead",
        true,
      ),
    );
    nextEventAdditions.push(
      createStageEvent(
        opportunity.opportunity_id,
        opportunity.current_stage,
        "created",
        "user",
        selectedUserId,
        "Opportunity created from fast signal confirmation.",
      ),
    );
  } else {
    selectedOpportunityId = opportunity.opportunity_id;
    profileExists = state.candidateProfiles.some(
      (profile) => profile.opportunity_id === opportunity?.opportunity_id,
    );
  }

  if (opportunity) {
    selectedOpportunityId = opportunity.opportunity_id;
  }

  if (opportunity && matchedOpportunity && !profileExists) {
    nextProfileAdditions.push(createCandidateProfile(selectedUserId, opportunity.opportunity_id));
  }

  if (signal && opportunity) {
    const sourceText = signal.signalText.trim() || signal.signalUrl.trim();
    const duplicateArtifact = state.artifacts.some(
      (artifact) =>
        artifact.opportunity_id === opportunity?.opportunity_id &&
        normalizeValue(artifact.source_label) === normalizeValue(getSignalSourceLabel(signal)) &&
        normalizeValue(artifact.source_text ?? "") === normalizeValue(sourceText),
    );

    if (sourceText && !duplicateArtifact) {
      nextArtifactAdditions.push(
        createArtifact({
          opportunity_id: opportunity.opportunity_id,
          artifact_type: getSignalArtifactType(signal.signalType),
          source_label: getSignalSourceLabel(signal),
          origin: "imported",
          review_status: "user_reviewed",
          parse_status: "complete",
          evidence_note: `Captured from ${signal.signalType.replace(/_/g, " ")}.`,
          content_summary: summarizeSignalText(sourceText),
          source_text: sourceText,
        }),
      );
    }
  }

  const nextState: AppState = {
    ...state,
    accounts: [...nextAccountAdditions, ...state.accounts],
    users: nextUserAdditions.length
      ? [
          ...nextUserAdditions,
          ...state.users.filter(
            (user) => !nextUserAdditions.some((nextUser) => nextUser.user_id === user.user_id),
          ),
        ]
      : state.users,
    enterpriseControlProfiles: [...nextControlProfileAdditions, ...state.enterpriseControlProfiles],
    roleEntitlements: [...nextEntitlementAdditions, ...state.roleEntitlements],
    opportunities: [...nextOpportunityAdditions, ...state.opportunities],
    candidateProfiles: [...nextProfileAdditions, ...state.candidateProfiles],
    checkpoints: [...nextCheckpointAdditions, ...state.checkpoints],
    tasks: [...nextTaskAdditions, ...state.tasks],
    events: [...nextEventAdditions, ...state.events],
    artifacts: [...nextArtifactAdditions, ...state.artifacts],
    selectedAccountId,
    selectedUserId,
    selectedOpportunityId,
  };

  return {
    nextState,
    drafts: {
      accountDraft,
      userDraft,
      opportunityDraft,
    },
    patchLabel: matchedOpportunity
      ? "Existing opportunity reopened from confirmed signal."
      : "Opportunity created from confirmed signal.",
    noticeMessage: matchedOpportunity
      ? "Existing play found. We reopened it and kept the proof."
      : "Play created. Your workspace is ready.",
    reopenedExisting: Boolean(matchedOpportunity),
  };
}
