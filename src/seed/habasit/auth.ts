import { createAccount, createUser } from "../../workflow";
import { daysAgoIso } from "../utils";

export function buildHabasitAccountsAndUsers() {
  const habasitAccount = createAccount({
    account_name: "Habasit America - Suwanee 30 Day Sample",
    account_type: "enterprise",
    primary_region: "Suwanee, Georgia, United States",
    support_tier: "CEO Town Hall Product Hardening",
  });

  const habasitUsers = [
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Ava Coleman",
      email: "ava.coleman@example.com",
      phone: "470-555-0101",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Application Engineer",
      target_role_family: "Industrial Applications Engineering",
      target_compensation: "$118,000 - $132,000",
      accessibility_needs: "Desktop-first proof capture",
      sponsorship_type: "organization_sponsored",
    }),
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Darius Reed",
      email: "darius.reed@example.com",
      phone: "470-555-0102",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Manufacturing Technician",
      target_role_family: "Fabrication and operations support",
      target_compensation: "$62,000 - $74,000",
      accessibility_needs: "Clear next-step instructions and confidence reinforcement",
      sponsorship_type: "managed_service",
    }),
    createUser({
      account_id: habasitAccount.account_id,
      full_name: "Melissa Grant",
      email: "melissa.grant@example.com",
      phone: "470-555-0103",
      timezone: "America/New_York",
      region: "Georgia, United States",
      current_role: "Operations Analyst",
      target_role_family: "Customer operations and continuous improvement",
      target_compensation: "$88,000 - $102,000",
      accessibility_needs: "Low-noise task sequencing",
      sponsorship_type: "organization_sponsored",
    }),
  ];
  habasitUsers.forEach((user, index) => {
    user.created_at = daysAgoIso(30 - index * 3, 8, 30);
    user.updated_at = daysAgoIso(1 + index, 9, 15);
  });

  return { habasitAccount, habasitUsers };
}
