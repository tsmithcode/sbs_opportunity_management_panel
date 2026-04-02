import { AppState } from "../../types";
import { stageMeta } from "../../workflow";

export function renderBuyerPacketMarkdown(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  const user = state.users.find((item) => item.user_id === state.selectedUserId);
  const opportunity = state.opportunities.find(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const controlProfile = state.enterpriseControlProfiles.find(
    (item) => item.account_id === state.selectedAccountId,
  );
  const entitlements = state.roleEntitlements.filter(
    (item) => item.account_id === state.selectedAccountId,
  );
  const story = state.candidateStories.find(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const openEscalations = state.escalations.filter(
    (item) =>
      item.opportunity_id === state.selectedOpportunityId &&
      item.status !== "resolved" &&
      item.status !== "closed",
  );

  return `# Monyawn Premium Enterprise Buyer Packet

## Current Product Posture
- Product posture: local-first, export-first, human-reviewable workflow platform
- Account: ${account?.account_name ?? "Not selected"}
- Account type: ${account?.account_type ?? "Unknown"}
- Primary region: ${account?.primary_region ?? "Unknown"}
- Support tier: ${account?.support_tier ?? "Unknown"}

## Selected Buyer Context
- Acting user: ${user?.full_name ?? "Not selected"}
- Opportunity: ${opportunity ? `${opportunity.company_name} - ${opportunity.role_title}` : "Not selected"}
- Opportunity stage: ${opportunity ? stageMeta[opportunity.current_stage].label : "Unknown"}

## Governance Snapshot
- Buyer readiness: ${controlProfile?.buyer_readiness_stage ?? "Not configured"}
- Entitlements mode: ${controlProfile?.entitlements_mode ?? "Not configured"}
- External release approval required: ${controlProfile?.external_release_requires_approval ? "Yes" : "No"}
- Export confirmation required: ${controlProfile?.export_confirmation_required ? "Yes" : "No"}
- Local-only posture locked: ${controlProfile?.local_only_posture_locked ? "Yes" : "No"}
- Sensitive support export allowed by policy: ${controlProfile?.allow_sensitive_support_export ? "Yes" : "No"}
- Deployment posture: ${controlProfile?.deployment_posture ?? "Not documented"}

## Readiness Signals
- Candidate story: ${story ? "Present" : "Missing"}
- Open escalations: ${openEscalations.length}
- Opportunities in account: ${state.opportunities.filter((item) => item.account_id === state.selectedAccountId).length}
- Diligence-enabled roles: ${entitlements.filter((item) => item.diligence_packet_access).length}

## Role Entitlements
${entitlements.length
    ? entitlements
        .map(
          (item) =>
            `- ${item.role_name}: workspace=${item.workspace_access ? "yes" : "no"}, staff=${item.staff_queue_access ? "yes" : "no"}, admin=${item.admin_console_access ? "yes" : "no"}, export=${item.export_package_access ? "yes" : "no"}, diligence=${item.diligence_packet_access ? "yes" : "no"}`,
        )
        .join("\n")
    : "- No entitlements configured."}

## Buyer Review Notes
${controlProfile?.notes || "No control notes recorded."}

## Truth Boundary
- This packet reflects the current local product state only.
- It does not imply hosted deployment, sovereign hosting, or certifications that are not separately documented.
- Human-readable outputs should be cross-checked with the trust center and diligence response materials before external use.
`;
}

export function renderBuyerReadme(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  return `# Premium Enterprise Buyer Packet

This packet was generated locally from the current Monyawn workspace for ${account?.account_name ?? "the selected account"}.

## Included Files
- buyer-packet.md
- opportunity-summary.md
- candidate-story.md
- governance-summary.md

## Use Guidance
- This packet is buyer-facing and human-readable.
- It is not the same as the durable restore ZIP used for workspace recovery.
- Review claims against the trust center before sending externally.
`;
}
