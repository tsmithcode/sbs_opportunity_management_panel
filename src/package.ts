import type {
  AppState,
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  ExportPackageManifest,
  Opportunity,
  ReleaseArtifactReviewRecord,
  SensitiveSupportProfile,
  SourceArtifact,
} from "./types";
import { PACKAGE_VERSION, SCHEMA_VERSION } from "./schema";
import { releaseStatus } from "./releaseStatus";
import { nowIso, stageMeta } from "./workflow";

type ImportSuccess = {
  ok: true;
  state: AppState;
  warning?: string;
};

type ImportFailure = {
  ok: false;
  error: string;
};

type ImportResult = ImportSuccess | ImportFailure;

export type ReleaseArtifactReview = {
  title: string;
  summary: string;
  sourceName: string;
  entries: string[];
  content: string;
};

type ReleaseArtifactImportResult =
  | {
      ok: true;
      artifact: ReleaseArtifactReview;
    }
  | {
      ok: false;
      error: string;
    };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function formatTimestampForFile(value: string): string {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

function createScopedFilename(
  generatedAt: string,
  scope: string,
  name: string,
  extension: "md" | "pdf" | "zip",
): string {
  return `${slugify(scope)}-${slugify(name)}-${formatTimestampForFile(generatedAt)}.${extension}`;
}

function renderOpportunityMarkdown(
  opportunity: Opportunity,
  artifacts: SourceArtifact[],
): string {
  return `# ${opportunity.company_name} - ${opportunity.role_title}

- Opportunity ID: \`${opportunity.opportunity_id}\`
- Stage: ${stageMeta[opportunity.current_stage].label}
- Status: ${opportunity.status}
- Source: ${opportunity.opportunity_source || "Not provided"}
- Employment type: ${opportunity.employment_type || "Not provided"}
- Location type: ${opportunity.location_type || "Not provided"}
- Updated at: ${opportunity.updated_at}

## Artifact Summary
${artifacts.length ? artifacts.map((artifact) => `- ${artifact.artifact_type}: ${artifact.source_label} (${artifact.review_status}, ${artifact.parse_status})`).join("\n") : "- No artifacts captured yet."}
`;
}

function renderCandidateStoryMarkdown(story: CandidateStory): string {
  return `${story.markdown}

---
- Story ID: \`${story.story_id}\`
- Status: ${story.status}
- Updated at: ${story.updated_at}
`;
}

function renderSensitiveSupportMarkdown(profile: SensitiveSupportProfile): string {
  return `# Sensitive Support Profile

- Opportunity ID: \`${profile.opportunity_id}\`
- Enabled: ${profile.enabled ? "Yes" : "No"}
- Included in export: ${profile.include_in_export ? "Yes" : "No"}
- Updated at: ${profile.updated_at}

## Categories
${profile.categories.length ? profile.categories.map((item) => `- ${item}`).join("\n") : "- None selected"}

## Notes
${profile.notes || "No notes recorded."}

## Encouragement Plan
${profile.encouragement_plan || "No encouragement plan recorded."}
`;
}

function renderCorrespondenceMarkdown(item: CorrespondenceItem): string {
  return `# ${item.subject || "Untitled correspondence"}

- Correspondence ID: \`${item.correspondence_id}\`
- Opportunity ID: \`${item.opportunity_id}\`
- Channel: ${item.channel}
- Status: ${item.status}
- Owner role: ${item.owner_role}
- Created at: ${item.created_at}

## Body
${item.body || "No body recorded."}

## Extracted Signals
- Names: ${item.extracted_signals?.names.join(", ") || "None"}
- Emails: ${item.extracted_signals?.emails.join(", ") || "None"}
- Dates: ${item.extracted_signals?.dates.join(", ") || "None"}
- Times: ${item.extracted_signals?.times.join(", ") || "None"}
- Interviews: ${item.extracted_signals?.interviews.join(" | ") || "None"}
`;
}

function renderMemoMarkdown(memo: DecisionMemo): string {
  return `# ${memo.memo_type} memo

- Memo ID: \`${memo.memo_id}\`
- Opportunity ID: \`${memo.opportunity_id}\`
- Status: ${memo.status}
- Confidence: ${memo.confidence_level}
- Human approved: ${memo.human_approved ? "Yes" : "No"}
- Created at: ${memo.created_at}

## Summary
${memo.summary}
`;
}

function renderGlossaryMarkdown(): string {
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

function renderReadme(manifest: ExportPackageManifest): string {
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

function renderSessionSummaryMarkdown(state: AppState): string {
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

function renderReleaseArtifactReviewMarkdown(item: ReleaseArtifactReviewRecord): string {
  return `# ${item.title}

- Review ID: \`${item.review_id}\`
- Account ID: \`${item.account_id}\`
- Opportunity ID: \`${item.opportunity_id}\`
- Source name: ${item.source_name}
- Imported at: ${item.imported_at}

## Summary
${item.summary}

## Entries
${item.entries.length ? item.entries.map((entry) => `- ${entry}`).join("\n") : "- No entry list recorded."}

## Content Preview
${item.content}
`;
}

async function buildPdf(
  title: string,
  sections: Array<{ heading: string; body: string }>,
): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54;
  const marginTop = 56;
  const marginBottom = 56;
  const maxWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, marginX, y);
  y += 28;

  sections.forEach((section) => {
    ensureSpace(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.heading, marginX, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(section.body || " ", maxWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(16);
      doc.text(line, marginX, y);
      y += 14;
    });
    y += 10;
  });

  return new Uint8Array(doc.output("arraybuffer"));
}

async function buildOpportunityPdf(
  opportunity: Opportunity,
  artifacts: SourceArtifact[],
): Promise<Uint8Array> {
  return buildPdf(`${opportunity.company_name} - ${opportunity.role_title}`, [
    {
      heading: "Opportunity Overview",
      body: [
        `Stage: ${stageMeta[opportunity.current_stage].label}`,
        `Status: ${opportunity.status}`,
        `Source: ${opportunity.opportunity_source || "Not provided"}`,
        `Employment type: ${opportunity.employment_type || "Not provided"}`,
        `Location type: ${opportunity.location_type || "Not provided"}`,
        `Updated at: ${opportunity.updated_at}`,
      ].join("\n"),
    },
    {
      heading: "Artifact Summary",
      body: artifacts.length
        ? artifacts
            .map(
              (artifact) =>
                `${artifact.artifact_type}: ${artifact.source_label} (${artifact.review_status}, ${artifact.parse_status})`,
            )
            .join("\n")
        : "No artifacts captured yet.",
    },
  ]);
}

async function buildCandidateStoryPdf(story: CandidateStory): Promise<Uint8Array> {
  return buildPdf(story.title, [
    { heading: "Summary", body: story.summary },
    { heading: "Story", body: story.markdown.replace(/^# .+\n?/m, "").trim() },
    {
      heading: "Metadata",
      body: [
        `Status: ${story.status}`,
        `Updated at: ${story.updated_at}`,
        `Source artifacts: ${story.source_artifact_ids.length}`,
        `Source correspondence: ${story.source_correspondence_ids.length}`,
      ].join("\n"),
    },
  ]);
}

async function buildMemoPdf(memo: DecisionMemo): Promise<Uint8Array> {
  return buildPdf(`${memo.memo_type} memo`, [
    {
      heading: "Memo Metadata",
      body: [
        `Status: ${memo.status}`,
        `Confidence: ${memo.confidence_level}`,
        `Human approved: ${memo.human_approved ? "Yes" : "No"}`,
        `Created at: ${memo.created_at}`,
      ].join("\n"),
    },
    { heading: "Summary", body: memo.summary },
  ]);
}

async function buildCorrespondencePdf(
  item: CorrespondenceItem,
): Promise<Uint8Array> {
  return buildPdf(item.subject || "Untitled correspondence", [
    {
      heading: "Correspondence Metadata",
      body: [
        `Channel: ${item.channel}`,
        `Status: ${item.status}`,
        `Owner role: ${item.owner_role}`,
        `Created at: ${item.created_at}`,
      ].join("\n"),
    },
    { heading: "Body", body: item.body || "No body recorded." },
  ]);
}

async function buildSessionSummaryPdf(state: AppState): Promise<Uint8Array> {
  return buildPdf("Monyawn session summary", [
    { heading: "Summary", body: renderSessionSummaryMarkdown(state).replace(/^# .+\n?/m, "").trim() },
  ]);
}

function buildManifest(state: AppState): ExportPackageManifest {
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

function renderBuyerPacketMarkdown(state: AppState): string {
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

function renderBuyerReadme(state: AppState): string {
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

function renderReleaseSummaryMarkdown(): string {
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

function renderReleaseSummaryJson() {
  return JSON.stringify(
    {
      generatedAt: nowIso(),
      ...releaseStatus,
    },
    null,
    2,
  );
}

function renderReadinessPacketMarkdown(state: AppState): string {
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

export async function buildReleaseReadinessZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  zip.file(
    "README.md",
    `# Release Readiness Packet

This packet was generated locally from the current Monyawn workspace.

## Included Files
- release-summary.md
- release-summary.json
- buyer-readiness-packet.md

## Use Guidance
- This packet is human-readable and exportable.
- It does not replace the durable handoff ZIP used for full workspace recovery.
- It is intended for release review, buyer-readiness review, and internal operational handoff.
`,
  );
  zip.file("release-summary.md", renderReleaseSummaryMarkdown());
  zip.file("release-summary.json", `${renderReleaseSummaryJson()}\n`);
  zip.file("buyer-readiness-packet.md", renderReadinessPacketMarkdown(state));

  return zip.generateAsync({ type: "blob" });
}

export async function buildExportZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const manifest = buildManifest(state);
  const exportableSensitiveSupport = state.sensitiveSupportProfiles.filter(
    (profile) => profile.enabled && profile.include_in_export,
  );
  const enrichedState: AppState = {
    ...state,
    sensitiveSupportProfiles: exportableSensitiveSupport,
    schemaVersion: state.schemaVersion || SCHEMA_VERSION,
    lastExportedAt: manifest.generated_at,
  };

  zip.file("session.json", JSON.stringify(enrichedState, null, 2));
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("README.md", renderReadme(manifest));
  zip.file("dictionaries/workflow-glossary.md", renderGlossaryMarkdown());

  const lifecycleFolder = zip.folder("lifecycle");
  const pdfFolder = zip.folder("pdf");
  for (const opportunity of state.opportunities) {
    const artifacts = state.artifacts.filter(
      (artifact) => artifact.opportunity_id === opportunity.opportunity_id,
    );
    const filename = createScopedFilename(
      manifest.generated_at,
      opportunity.company_name,
      `${opportunity.role_title}-lifecycle`,
      "md",
    );
    lifecycleFolder?.file(filename, renderOpportunityMarkdown(opportunity, artifacts));
    pdfFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        opportunity.company_name,
        `${opportunity.role_title}-lifecycle`,
        "pdf",
      ),
      await buildOpportunityPdf(opportunity, artifacts),
    );
  }

  const storyFolder = zip.folder("candidate-story");
  for (const story of state.candidateStories) {
    const filename = createScopedFilename(
      manifest.generated_at,
      story.opportunity_id,
      story.title || "candidate-story",
      "md",
    );
    storyFolder?.file(filename, renderCandidateStoryMarkdown(story));
    pdfFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        story.opportunity_id,
        story.title || "candidate-story",
        "pdf",
      ),
      await buildCandidateStoryPdf(story),
    );
  }

  const memoFolder = zip.folder("memos");
  for (const memo of state.memos) {
    memoFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        memo.opportunity_id,
        `${memo.memo_type}-memo`,
        "md",
      ),
      renderMemoMarkdown(memo),
    );
    pdfFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        memo.opportunity_id,
        `${memo.memo_type}-memo`,
        "pdf",
      ),
      await buildMemoPdf(memo),
    );
  }

  const correspondenceFolder = zip.folder("correspondence");
  for (const item of state.correspondence) {
    correspondenceFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        item.opportunity_id,
        item.subject || "correspondence",
        "md",
      ),
      renderCorrespondenceMarkdown(item),
    );
    pdfFolder?.file(
      createScopedFilename(
        manifest.generated_at,
        item.opportunity_id,
        item.subject || "correspondence",
        "pdf",
      ),
      await buildCorrespondencePdf(item),
    );
  }

  if (exportableSensitiveSupport.length) {
    const supportFolder = zip.folder("support");
    exportableSensitiveSupport.forEach((profile) => {
      supportFolder?.file(
        `${slugify(profile.opportunity_id)}-support.md`,
        renderSensitiveSupportMarkdown(profile),
      );
    });
  }

  const reportFolder = zip.folder("reports");
  reportFolder?.file("session-summary.md", renderSessionSummaryMarkdown(state));
  if (state.releaseArtifactReviews.length) {
    const reviewFolder = zip.folder("release-review");
    reviewFolder?.file(
      "release-artifact-reviews.json",
      JSON.stringify(state.releaseArtifactReviews, null, 2),
    );
    state.releaseArtifactReviews.forEach((item) => {
      reviewFolder?.file(
        createScopedFilename(
          manifest.generated_at,
          item.opportunity_id || "workspace",
          item.title || "release-review",
          "md",
        ),
        renderReleaseArtifactReviewMarkdown(item),
      );
    });
  }
  pdfFolder?.file(
    createScopedFilename(manifest.generated_at, "session", "summary", "pdf"),
    await buildSessionSummaryPdf(state),
  );

  return zip.generateAsync({ type: "blob" });
}

export async function importStateFromFile(file: File): Promise<ImportResult> {
  try {
    if (file.name.endsWith(".json")) {
      const rawText = await file.text();
      const parsedState = JSON.parse(rawText) as AppState;
      return { ok: true, state: parsedState, warning: "Imported from legacy JSON export." };
    }

    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const sessionFile = zip.file("session.json");
    const manifestFile = zip.file("manifest.json");

    if (!sessionFile || !manifestFile) {
      return {
        ok: false,
        error: "Import failed. ZIP package must contain session.json and manifest.json.",
      };
    }

    const [sessionText, manifestText] = await Promise.all([
      sessionFile.async("string"),
      manifestFile.async("string"),
    ]);

    const parsedState = JSON.parse(sessionText) as AppState;
    const manifest = JSON.parse(manifestText) as ExportPackageManifest;

    const warning =
      manifest.schema_version !== parsedState.schemaVersion
        ? "Imported package schema and session schema differ. Session was loaded using session.json."
        : undefined;

    return { ok: true, state: parsedState, warning };
  } catch {
    return {
      ok: false,
      error: "Import failed. Please provide a valid Monyawn ZIP or legacy JSON export.",
    };
  }
}

export async function importReleaseArtifactForReview(
  file: File,
): Promise<ReleaseArtifactImportResult> {
  try {
    if (file.name.endsWith(".json")) {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      return {
        ok: true,
        artifact: {
          title: "Release summary JSON",
          summary: "Structured verification summary imported for in-app review.",
          sourceName: file.name,
          entries: Object.keys(parsed),
          content: JSON.stringify(parsed, null, 2),
        },
      };
    }

    if (file.name.endsWith(".md")) {
      const rawText = await file.text();
      const lines = rawText.split("\n").filter(Boolean);
      return {
        ok: true,
        artifact: {
          title: lines[0]?.replace(/^#\s+/, "") || "Markdown artifact",
          summary: "Markdown artifact imported for human review in admin mode.",
          sourceName: file.name,
          entries: lines
            .filter((line) => line.startsWith("## ") || line.startsWith("- "))
            .slice(0, 12),
          content: rawText,
        },
      };
    }

    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const readme = zip.file("README.md");
    const releaseSummary = zip.file("release-summary.md");
    const releaseSummaryJson = zip.file("release-summary.json");
    const readinessPacket = zip.file("buyer-readiness-packet.md");

    if (!readme || !releaseSummary || !releaseSummaryJson || !readinessPacket) {
      return {
        ok: false,
        error:
          "Review import failed. ZIP package must contain README.md, release-summary.md, release-summary.json, and buyer-readiness-packet.md.",
      };
    }

    const [readmeText, summaryText, summaryJsonText, readinessText] = await Promise.all([
      readme.async("string"),
      releaseSummary.async("string"),
      releaseSummaryJson.async("string"),
      readinessPacket.async("string"),
    ]);

    const parsedSummary = JSON.parse(summaryJsonText) as Record<string, unknown>;

    return {
      ok: true,
      artifact: {
        title: "Release readiness packet ZIP",
        summary: "Release summary and buyer-facing readiness materials imported for in-app review.",
        sourceName: file.name,
        entries: [
          "README.md",
          "release-summary.md",
          "release-summary.json",
          "buyer-readiness-packet.md",
          ...Object.keys(parsedSummary).slice(0, 6).map((key) => `summary key: ${key}`),
        ],
        content: [readmeText, "", summaryText, "", readinessText].join("\n"),
      },
    };
  } catch {
    return {
      ok: false,
      error:
        "Review import failed. Provide a release readiness ZIP, release summary JSON, or release/readiness Markdown file.",
    };
  }
}

export async function buildBlogAssetZip(input: {
  opportunity: Opportunity;
  outcome: AppState["outcomes"][number];
  story?: CandidateStory;
}): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const generatedAt = nowIso();

  const title = input.outcome.resolution === "awarded" 
    ? `Monyawn Success Case Study 🥱: ${input.opportunity.role_title} at ${input.opportunity.company_name}`
    : `Monyawn Market Insights 🥱: Pursuing ${input.opportunity.role_title} at ${input.opportunity.company_name}`;

  const markdownContent = `# ${title}\n\nDate: ${generatedAt}\nResolution: ${input.outcome.resolution.toUpperCase()}\n\n## Overview\n${input.story?.summary || "No narrative summary provided."}\n\n## The Narrative\n${input.story?.markdown || "No detailed narrative provided."}\n\n## Lessons Learned\n${input.outcome.lessons_learned}\n\n## Market Intelligence\n${input.outcome.market_intelligence}\n`;

  const jsonlContent = JSON.stringify({
    timestamp: generatedAt,
    opportunity_id: input.opportunity.opportunity_id,
    company: input.opportunity.company_name,
    role: input.opportunity.role_title,
    resolution: input.outcome.resolution,
    content_potential: input.outcome.content_potential,
    lessons_learned: input.outcome.lessons_learned,
    market_intelligence: input.outcome.market_intelligence,
  }) + "\n";

  zip.file("article.md", markdownContent);
  zip.file("metadata.jsonl", jsonlContent);

  return zip.generateAsync({ type: "blob" });
}

export function createBlogAssetFilename(company: string, role: string): string {
  const generatedAt = nowIso();
  return createScopedFilename(generatedAt, company, role, "zip").replace(".pdf", "").replace(".md", "");
}

export async function buildSeasonReportZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const generatedAt = nowIso();

  const reportFolder = zip.folder("season-report");
  const jsonlLines: string[] = [];

  for (const outcome of state.outcomes) {
    const opportunity = state.opportunities.find(o => o.opportunity_id === outcome.opportunity_id);
    const story = state.candidateStories.find(s => s.opportunity_id === outcome.opportunity_id);
    
    if (opportunity) {
      const title = outcome.resolution === "awarded" 
        ? `Monyawn Success Case Study 🥱: ${opportunity.role_title} at ${opportunity.company_name}`
        : `Monyawn Market Insights 🥱: Pursuing ${opportunity.role_title} at ${opportunity.company_name}`;

      const markdownContent = `# ${title}\n\nDate: ${outcome.updated_at}\nResolution: ${outcome.resolution.toUpperCase()}\n\n## Overview\n${story?.summary || "No narrative summary provided."}\n\n## The Narrative\n${story?.markdown || "No detailed narrative provided."}\n\n## Lessons Learned\n${outcome.lessons_learned}\n\n## Market Intelligence\n${outcome.market_intelligence}\n`;

      const jsonlEntry = JSON.stringify({
        timestamp: outcome.updated_at,
        opportunity_id: opportunity.opportunity_id,
        company: opportunity.company_name,
        role: opportunity.role_title,
        resolution: outcome.resolution,
        content_potential: outcome.content_potential,
        lessons_learned: outcome.lessons_learned,
        market_intelligence: outcome.market_intelligence,
      });
      
      jsonlLines.push(jsonlEntry);
      
      const fileScope = slugify(opportunity.company_name);
      const fileName = slugify(opportunity.role_title);
      reportFolder?.file(`${fileScope}-${fileName}.md`, markdownContent);
    }
  }

  zip.file("research-lake.jsonl", jsonlLines.join("\n") + "\n");
  zip.file("SUMMARY.md", `# Monyawn Season Report 🥱\n\nGenerated: ${generatedAt}\nTotal Outcomes: ${state.outcomes.length}\n\nThis report aggregates all cataloged outcomes into a research and marketing foundation.`);

  return zip.generateAsync({ type: "blob" });
}
