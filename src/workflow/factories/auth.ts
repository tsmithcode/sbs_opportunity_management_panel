import { Account, AccountType, SponsorshipType, User } from "../../types";
import { createId, nowIso } from "../utils";

export function createAccount(input: {
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
}): Account {
  return {
    account_id: createId("acct"),
    created_at: nowIso(),
    ...input,
  };
}

export function createUser(input: {
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
}): User {
  const timestamp = nowIso();
  return {
    user_id: createId("user"),
    created_at: timestamp,
    updated_at: timestamp,
    ...input,
  };
}
