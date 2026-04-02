import { AppState, ExportPackageManifest } from "../../types";
import { PACKAGE_VERSION } from "../../schema";
import { nowIso } from "../../workflow";
import { formatTimestampForFile, slugify } from "../utils";

export function renderGlossaryMarkdown(): string {
  return `# Workflow Glossary

- Intake started: Opportunity record exists, but evidence is still incomplete.
- Intake complete: Core artifacts and profile are present.
- Fit review: The platform is evaluating strengths, risks, and pursue logic.
- Positioning: Narrative, proof points, and role framing are under review.
- Outreach ready: Correspondence is being reviewed before external use.
- Interview active: Preparation or live interview support is in progress.
- Debrief captured: Interview outcomes have been recorded.
- Offer review: Compensation, level, and decision tradeoffs are being reviewed.
`;
}

export function renderReadme(manifest: ExportPackageManifest): string {
  return `# Monyawn Handoff Package

This export package was generated locally. Monyawn does not retain this session on company systems.

## Package Metadata
- Package version: ${manifest.package_version}
- Schema version: ${manifest.schema_version}
- Generated at: ${manifest.generated_at}
- Account ID: ${manifest.account_id}
- Selected user ID: ${manifest.selected_user_id}
- Selected opportunity ID: ${manifest.selected_opportunity_id}

## Contents
${manifest.included_paths.map((path) => `- ${path}`).join("\n")}

## Restore Guidance
- Import this ZIP back into Monyawn to restore the session from \`session.json\`.
- Human-readable Markdown files and printable PDFs are included for review and handoff.
- If local browser storage is cleared, this package is the durable recovery mechanism.
`;
}

export function renderSessionSummaryMarkdown(state: AppState): string {
  return `# Session Summary

- Opportunities: ${state.opportunities.length}
- Users: ${state.users.length}
- Artifacts: ${state.artifacts.length}
- Candidate stories: ${state.candidateStories.length}
- Release artifact reviews: ${state.releaseArtifactReviews.length}
- Open tasks: ${state.tasks.filter((task) => task.status !== "completed").length}
- Open escalations: ${state.escalations.filter((item) => item.status !== "resolved" && item.status !== "closed").length}
- Last saved at: ${state.lastSavedAt}
- Last exported at: ${state.lastExportedAt || "Not yet exported"}
`;
}

export function buildManifest(state: AppState): ExportPackageManifest {
  return {
    package_version: PACKAGE_VERSION,
    schema_version: state.schemaVersion,
    generated_at: nowIso(),
    account_id: state.selectedAccountId,
    selected_user_id: state.selectedUserId,
    selected_opportunity_id: state.selectedOpportunityId,
    use_case_ids: Array.from(new Set(state.opportunities.map((item) => item.use_case_id))),
    included_paths: [
      "session.json",
      "manifest.json",
      "README.md",
      "lifecycle/",
      "candidate-story/",
      "memos/",
      "correspondence/",
      "support/",
      "reports/",
      "pdf/",
      "dictionaries/",
    ],
    notes: [
      "Canonical restore source is session.json.",
      "Markdown files are human-readable derivatives generated from the current local session.",
    ],
  };
}

export function createExportFilename(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  const timestamp = formatTimestampForFile(nowIso());
  const accountName = slugify(account?.account_name ?? "monyawn");
  return `${accountName}-handoff-${timestamp}.zip`;
}

export function createBuyerPacketFilename(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  const timestamp = formatTimestampForFile(nowIso());
  const accountName = slugify(account?.account_name ?? "monyawn");
  return `${accountName}-buyer-packet-${timestamp}.zip`;
}

export function createReadinessPacketFilename(state: AppState): string {
  const account = state.accounts.find((item) => item.account_id === state.selectedAccountId);
  const timestamp = formatTimestampForFile(nowIso());
  const accountName = slugify(account?.account_name ?? "monyawn");
  return `${accountName}-release-readiness-packet-${timestamp}.zip`;
}
