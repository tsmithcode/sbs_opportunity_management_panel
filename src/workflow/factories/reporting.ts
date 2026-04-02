import {
  AppState,
  EnterpriseControlProfile,
  ReportingSnapshot,
  RoleEntitlement,
  SensitiveSupportProfile,
} from "../../types";
import { createId, nowIso } from "../utils";
import { stageOrder } from "../constants";

export function createReportingSnapshot(state: AppState): ReportingSnapshot {
  const activeOpportunities = state.opportunities.filter(
    (opportunity) => opportunity.status === "active",
  );
  const eligibleOpportunities = state.opportunities.length || 1;
  const approvals = state.artifacts.filter(
    (artifact) => artifact.review_status === "approved",
  ).length;
  const reviewableArtifacts = state.artifacts.length || 1;
  const escalations = state.escalations.length;
  const trustBase = state.checkpoints.length || 1;
  const highConfidence = state.checkpoints.filter(
    (checkpoint) => checkpoint.confidence_level === "high",
  ).length;

  return {
    snapshot_id: createId("snapshot"),
    account_id: state.selectedAccountId,
    use_case_id: "monyawn",
    period_start: state.lastSavedAt,
    period_end: nowIso(),
    active_opportunities: activeOpportunities.length,
    intake_completion_rate:
      state.opportunities.filter((opportunity) =>
        stageOrder.indexOf(opportunity.current_stage) >=
        stageOrder.indexOf("intake_complete"),
      ).length / eligibleOpportunities,
    fit_review_completion_rate:
      state.opportunities.filter((opportunity) =>
        stageOrder.indexOf(opportunity.current_stage) >=
        stageOrder.indexOf("fit_review"),
      ).length / eligibleOpportunities,
    approval_rate: approvals / reviewableArtifacts,
    escalation_rate: escalations / eligibleOpportunities,
    user_trust_score: highConfidence / trustBase,
    created_at: nowIso(),
  };
}

export function createSensitiveSupportProfile(
  opportunityId: string,
): SensitiveSupportProfile {
  return {
    support_profile_id: createId("support"),
    opportunity_id: opportunityId,
    enabled: false,
    categories: [],
    notes: "",
    encouragement_plan: "",
    include_in_export: false,
    updated_at: nowIso(),
  };
}

export function createEnterpriseControlProfile(input: {
  account_id: string;
  entitlements_mode: EnterpriseControlProfile["entitlements_mode"];
  external_release_requires_approval: boolean;
  export_confirmation_required: boolean;
  allow_sensitive_support_export: boolean;
  local_only_posture_locked: boolean;
  deployment_posture: string;
  buyer_readiness_stage: EnterpriseControlProfile["buyer_readiness_stage"];
  notes: string;
}): EnterpriseControlProfile {
  return {
    control_profile_id: createId("control"),
    updated_at: nowIso(),
    ...input,
  };
}

export function createRoleEntitlement(input: {
  account_id: string;
  role_name: string;
  workspace_access: boolean;
  staff_queue_access: boolean;
  admin_console_access: boolean;
  export_package_access: boolean;
  diligence_packet_access: boolean;
  notes: string;
}): RoleEntitlement {
  return {
    entitlement_id: createId("entitlement"),
    updated_at: nowIso(),
    ...input,
  };
}
