import { AccountType, SponsorshipType } from "../../../types";

export interface AccountDraft {
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
}

export interface UserDraft {
  full_name: string;
  email: string;
  phone: string;
  timezone: string;
  region: string;
  current_role: string;
  target_role_family: string;
  target_compensation: string;
  accessibility_needs: string;
  sponsorship_type: SponsorshipType;
}

export interface OpportunityDraft {
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
}

export interface IntakeFlowProps {
  accountDraft: AccountDraft;
  onAccountDraftChange: (draft: AccountDraft) => void;
  onAccountSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  
  userDraft: UserDraft;
  onUserDraftChange: (draft: UserDraft) => void;
  onUserSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  
  opportunityDraft: OpportunityDraft;
  onOpportunityDraftChange: (draft: OpportunityDraft) => void;
  onOpportunitySubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  onComplete: () => void;
  onCancel: () => void;
}
