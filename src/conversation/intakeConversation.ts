import {
  applyResponse,
  createConversationState,
  getAnswers,
  getCurrentStep,
  getProgress,
  getSnapshot,
  getVisibleSteps,
  validateStep,
} from "../../packages/conversation-core/src";
import { intakeConversationSteps } from "../../packages/conversation-schema/src";
import { AccountDraft, OpportunityDraft, UserDraft } from "../context/MonyawnContext.types";
import {
  extractCompanies,
  extractEmails,
  extractRoleTitle,
  inferCompanyFromUrl,
} from "./inference";

export { intakeConversationSteps } from "../../packages/conversation-schema/src";

export type IntakeConversationSignalType =
  | "recruiter_email"
  | "job_link"
  | "job_text"
  | "transcript"
  | "note";

export type IntakeConversationAnswers = {
  signalType?: IntakeConversationSignalType;
  signalText?: string;
  signalUrl?: string;
  fullName?: string;
  accountName?: string;
  accountType?: "enterprise" | "individual";
  email?: string;
  companyName?: string;
  roleTitle?: string;
  pathway?: "w2" | "1099";
};

export function buildConversationSeedState(
  accountDraft: AccountDraft,
  userDraft: UserDraft,
  opportunityDraft: OpportunityDraft,
) {
  const seeded = createConversationState();
  let state = seeded;

  const seeds: Array<[string, unknown]> = [
    ["fullName", userDraft.full_name],
    ["accountName", accountDraft.account_name],
    ["accountType", accountDraft.account_type],
    ["email", userDraft.email],
    ["companyName", opportunityDraft.company_name],
    ["roleTitle", opportunityDraft.role_title],
    ["pathway", opportunityDraft.pathway],
  ];

  for (const [stepId, value] of seeds) {
    if (typeof value === "string" && value.trim()) {
      state = applyResponse(intakeConversationSteps, state, stepId, value);
    }
  }

  return state;
}

export function deriveConversationState(
  accountDraft: AccountDraft,
  userDraft: UserDraft,
  opportunityDraft: OpportunityDraft,
  responses: Record<string, unknown>,
) {
  const signalText = String(responses.signalText ?? "");
  const signalUrl = String(responses.signalUrl ?? "");
  const combinedText = `${signalText}\n${signalUrl}`.trim();
  const companies = extractCompanies(combinedText);
  const emails = extractEmails(combinedText);

  const fullName = String(responses.fullName ?? userDraft.full_name).trim();
  const rawAccountName =
    typeof responses.accountName === "string" && responses.accountName.trim()
      ? responses.accountName
      : typeof accountDraft.account_name === "string" && accountDraft.account_name.trim()
        ? accountDraft.account_name
        : fullName
          ? `${fullName} workspace`
          : "";
  const accountName = String(
    rawAccountName,
  ).trim();
  const accountType =
    (responses.accountType as AccountDraft["account_type"] | undefined) ??
    accountDraft.account_type;
  const email = String(responses.email ?? emails[0] ?? userDraft.email).trim();
  const companyName = String(
    responses.companyName ??
      companies[0] ??
      inferCompanyFromUrl(signalUrl) ??
      opportunityDraft.company_name,
  ).trim();
  const roleTitle = String(
    responses.roleTitle ?? extractRoleTitle(signalText) ?? opportunityDraft.role_title,
  ).trim();
  const pathway = (responses.pathway as "w2" | "1099" | undefined) ?? opportunityDraft.pathway;

  return {
    accountDraft: {
      ...accountDraft,
      account_name: accountName,
      account_type: accountType,
    },
    userDraft: {
      ...userDraft,
      full_name: fullName,
      email,
    },
    opportunityDraft: {
      ...opportunityDraft,
      company_name: companyName,
      role_title: roleTitle,
      pathway,
      opportunity_source: String(responses.signalType ?? opportunityDraft.opportunity_source).replace(/_/g, " "),
      job_posting_url: signalUrl || opportunityDraft.job_posting_url,
    },
  };
}

export const intakeConversationEngine = {
  createConversationState,
  applyResponse,
  getAnswers,
  getCurrentStep,
  getVisibleSteps,
  getProgress,
  getSnapshot,
  validateStep,
};
