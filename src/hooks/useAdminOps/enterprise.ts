import { useMonyawn } from "../../context/MonyawnContext";
import { createAccount, createUser, createRoleEntitlement, nowIso } from "../../workflow";
import { AccountDraft, UserDraft } from "../../context/MonyawnContext.types";
import { AppState } from "../../types";

export function useEnterpriseAdminOps() {
  const { state, patchState, setNotice } = useMonyawn();

  const handleAccountSubmit = (draft: AccountDraft) => {
    const account = createAccount(draft);
    const controlProfile = {
      control_profile_id: `control_${account.account_id}`,
      account_id: account.account_id,
      entitlements_mode: "guided_default" as const,
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "internal_only" as const,
      notes: "New account created with default local-only enterprise controls.",
      updated_at: nowIso(),
    };
    
    const defaultEntitlements = [
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
        role_name: "Admin / Governance",
        workspace_access: true,
        staff_queue_access: true,
        admin_console_access: true,
        export_package_access: true,
        diligence_packet_access: true,
        notes: "Default governance owner for local-only review.",
      }),
    ];

    patchState(
      (current) => ({
        ...current,
        accounts: [account, ...current.accounts],
        enterpriseControlProfiles: [controlProfile, ...current.enterpriseControlProfiles],
        roleEntitlements: [...defaultEntitlements, ...current.roleEntitlements],
        selectedAccountId: account.account_id,
      }),
      "Account created.",
    );
    return account;
  };

  const handleUserSubmit = (draft: UserDraft) => {
    if (!state.selectedAccountId) {
      setNotice({ tone: "info", message: "Create or select an account first." });
      return;
    }

    const user = createUser({ account_id: state.selectedAccountId, ...draft });
    patchState(
      (current) => ({
        ...current,
        users: [user, ...current.users],
        selectedUserId: user.user_id,
      }),
      "User record created.",
    );
    return user;
  };

  const ensureEnterpriseControlProfile = (accountId: string) => {
    const existing = state.enterpriseControlProfiles.find(p => p.account_id === accountId);
    if (existing) return existing;

    return {
      control_profile_id: `control_${accountId}`,
      account_id: accountId,
      entitlements_mode: "guided_default" as const,
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "internal_only" as const,
      notes: "Auto-created profile.",
      updated_at: nowIso(),
    };
  };

  const updateEnterpriseControlField = <K extends keyof AppState["enterpriseControlProfiles"][0]>(
    field: K,
    value: AppState["enterpriseControlProfiles"][0][K]
  ) => {
    if (!state.selectedAccountId) return;
    patchState(current => {
      const profile = current.enterpriseControlProfiles.find(p => p.account_id === current.selectedAccountId) 
                      ?? ensureEnterpriseControlProfile(current.selectedAccountId);
      const remaining = current.enterpriseControlProfiles.filter(p => p.control_profile_id !== profile.control_profile_id);
      return {
        ...current,
        enterpriseControlProfiles: [{ ...profile, [field]: value, updated_at: nowIso() }, ...remaining],
      };
    }, "Enterprise control updated.");
  };

  const setRoleEntitlementFlag = (entitlementId: string, field: keyof AppState["roleEntitlements"][0], value: any) => {
    patchState(current => ({
      ...current,
      roleEntitlements: current.roleEntitlements.map(e => e.entitlement_id === entitlementId ? { ...e, [field]: value, updated_at: nowIso() } : e),
    }), "Entitlement updated.");
  };

  const addEntitlementTemplate = () => {
    if (!state.selectedAccountId) return;
    const template = createRoleEntitlement({
      account_id: state.selectedAccountId,
      role_name: "New Role Template",
      workspace_access: true,
      staff_queue_access: false,
      admin_console_access: false,
      export_package_access: false,
      diligence_packet_access: false,
      notes: "Custom role template.",
    });
    patchState(current => ({
      ...current,
      roleEntitlements: [template, ...current.roleEntitlements],
    }), "Entitlement template added.");
  };

  return {
    handleAccountSubmit,
    handleUserSubmit,
    updateEnterpriseControlField,
    setRoleEntitlementFlag,
    addEntitlementTemplate
  };
}
