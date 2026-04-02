import { AppState } from "../../types";
import { buildCandidateStoryPdf } from "../pdf";
import {
  renderBuyerPacketMarkdown,
  renderBuyerReadme,
  renderCandidateStoryMarkdown,
  renderOpportunityMarkdown,
} from "../markdown";

export async function buildBuyerPacketZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const opportunity = state.opportunities.find(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const artifacts = state.artifacts.filter(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const story = state.candidateStories.find(
    (item) => item.opportunity_id === state.selectedOpportunityId,
  );
  const controlProfile = state.enterpriseControlProfiles.find(
    (item) => item.account_id === state.selectedAccountId,
  );

  zip.file("README.md", renderBuyerReadme(state));
  zip.file("buyer-packet.md", renderBuyerPacketMarkdown(state));

  if (opportunity) {
    zip.file(
      "opportunity-summary.md",
      renderOpportunityMarkdown(opportunity, artifacts),
    );
  }

  if (story) {
    zip.file("candidate-story.md", renderCandidateStoryMarkdown(story));
    zip.file("candidate-story.pdf", await buildCandidateStoryPdf(story));
  }

  if (controlProfile) {
    zip.file(
      "governance-summary.md",
      `# Governance Summary

- Buyer readiness stage: ${controlProfile.buyer_readiness_stage}
- Entitlements mode: ${controlProfile.entitlements_mode}
- External release approval required: ${controlProfile.external_release_requires_approval ? "Yes" : "No"}
- Export confirmation required: ${controlProfile.export_confirmation_required ? "Yes" : "No"}
- Local-only posture locked: ${controlProfile.local_only_posture_locked ? "Yes" : "No"}
- Deployment posture: ${controlProfile.deployment_posture}

## Notes
${controlProfile.notes || "No notes recorded."}
`,
    );
  }

  return zip.generateAsync({ type: "blob" });
}
