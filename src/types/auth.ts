import { AccountType, SponsorshipType } from "./common";

export type Account = {
  account_id: string;
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
  created_at: string;
};

export type User = {
  user_id: string;
  account_id: string;
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
  created_at: string;
  updated_at: string;
};
