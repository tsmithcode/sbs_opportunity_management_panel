import { AppState } from "../types";
import { nowIso, createRoleEntitlement } from "../workflow";

export function buildDefaultEnterpriseAdminRecords(accounts: AppState["accounts"]) {
  const enterpriseControlProfiles = accounts.map((account) => ({
    control_profile_id: `control_${account.account_id}`,
    account_id: account.account_id,
    entitlements_mode: "guided_default" as const,
    external_release_requires_approval: true,
    export_confirmation_required: true,
    allow_sensitive_support_export: false,
    local_only_posture_locked: true,
    deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
    buyer_readiness_stage: "internal_only" as const,
    notes: "Auto-created local-only governance profile.",
    updated_at: nowIso(),
  }));

  const roleEntitlements = accounts.flatMap((account) => [
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Candidate / User",
      workspace_access: true,
      staff_queue_access: false,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Default guided access.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Staff Operations",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Default review and queue access.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Admin / Governance",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Default governance owner for local-only review.",
    }),
  ]);

  return { enterpriseControlProfiles, roleEntitlements };
}

export function mergeEnterpriseAdminRecords(
  accounts: AppState["accounts"],
  enterpriseControlProfiles: AppState["enterpriseControlProfiles"] | undefined,
  roleEntitlements: AppState["roleEntitlements"] | undefined,
) {
  const defaults = buildDefaultEnterpriseAdminRecords(accounts);
  const existingProfiles = enterpriseControlProfiles ?? [];
  const existingEntitlements = roleEntitlements ?? [];

  const mergedProfiles = [
    ...existingProfiles,
    ...defaults.enterpriseControlProfiles.filter(
      (defaultProfile) =>
        !existingProfiles.some((profile) => profile.account_id === defaultProfile.account_id),
    ),
  ];

  const mergedEntitlements = [
    ...existingEntitlements,
    ...defaults.roleEntitlements.filter(
      (defaultEntitlement) =>
        !existingEntitlements.some(
          (entitlement) =>
            entitlement.account_id === defaultEntitlement.account_id &&
            entitlement.role_name === defaultEntitlement.role_name,
        ),
    ),
  ];

  return {
    enterpriseControlProfiles: mergedProfiles,
    roleEntitlements: mergedEntitlements,
  };
}
