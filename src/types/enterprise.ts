export type EnterpriseControlProfile = {
  control_profile_id: string;
  account_id: string;
  entitlements_mode: "guided_default" | "staff_review" | "admin_controlled";
  external_release_requires_approval: boolean;
  export_confirmation_required: boolean;
  allow_sensitive_support_export: boolean;
  local_only_posture_locked: boolean;
  deployment_posture: string;
  buyer_readiness_stage: "internal_only" | "guided_pilot" | "buyer_reviewable";
  notes: string;
  updated_at: string;
};

export type RoleEntitlement = {
  entitlement_id: string;
  account_id: string;
  role_name: string;
  workspace_access: boolean;
  staff_queue_access: boolean;
  admin_console_access: boolean;
  export_package_access: boolean;
  diligence_packet_access: boolean;
  notes: string;
  updated_at: string;
};
