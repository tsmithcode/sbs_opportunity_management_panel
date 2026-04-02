import { AppState } from "../../types";
import { releaseStatus } from "../../releaseStatus";
import { nowIso, stageMeta } from "../../workflow";

export function renderReleaseSummaryMarkdown(): string {
  return `# Release Summary

## Summary
${releaseStatus.summary}

## Local Checks
${releaseStatus.localChecks.map((item) => `- \`${item}\``).join("\n")}

## CI Checks
${releaseStatus.ciChecks.map((item) => `- ${item}`).join("\n")}

## Current Coverage
${releaseStatus.currentCoverage.map((item) => `- ${item}`).join("\n")}

## Current Limits
${releaseStatus.currentLimits.map((item) => `- ${item}`).join("\n")}

## Expert Owners
${releaseStatus.expertOwners.map((item) => `- \`${item}\``).join("\n")}
`;
}

export function renderReleaseSummaryJson() {
  return JSON.stringify(
    {
      generatedAt: nowIso(),
      ...releaseStatus,
    },
    null,
    2,
  );
}

export function renderReadinessPacketMarkdown(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  const opportunity = state.opportunities.find(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const controlProfile = state.enterpriseControlProfiles.find(
    (item) => item.account_id === state.selectedAccountId,
  );

  return `# Buyer-Facing Readiness Packet

Generated: \`${nowIso()}\`

## Current Workspace
- Account: ${account?.account_name ?? "Not selected"}
- Account type: ${account?.account_type ?? "Not selected"}
- Opportunity: ${opportunity ? `${opportunity.company_name} - ${opportunity.role_title}` : "Not selected"}
- Stage: ${opportunity ? stageMeta[opportunity.current_stage].label : "Not selected"}
- Buyer readiness stage: ${controlProfile?.buyer_readiness_stage ?? "Not configured"}
- Deployment posture: ${controlProfile?.deployment_posture ?? "Not configured"}

## Product Posture
- Local-only data custody in the current version
- Human-in-the-loop operating model
- Export-first recovery posture with ZIP handoff packages
- Candidate story, coaching, and buyer packet workflows are available in-product

## Release Confidence
- Last validated phase: ${releaseStatus.lastValidatedPhase}
- Local checks: ${releaseStatus.localChecks.length}
- CI checks: ${releaseStatus.ciChecks.length}
- Last export: ${state.lastExportedAt || "No export yet recorded"}

## Current Limits
${releaseStatus.currentLimits.map((item) => `- ${item}`).join("\n")}

## Expert Owners
${releaseStatus.expertOwners.map((item) => `- \`${item}\``).join("\n")}
`;
}
