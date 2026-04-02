import { AppState } from "../../types";
import { SCHEMA_VERSION } from "../../schema";
import {
  buildManifest,
  renderCandidateStoryMarkdown,
  renderCorrespondenceMarkdown,
  renderGlossaryMarkdown,
  renderMemoMarkdown,
  renderOpportunityMarkdown,
  renderReadme,
  renderReleaseArtifactReviewMarkdown,
  renderSensitiveSupportMarkdown,
  renderSessionSummaryMarkdown,
} from "../markdown";
import {
  buildCandidateStoryPdf,
  buildCorrespondencePdf,
  buildMemoPdf,
  buildOpportunityPdf,
  buildSessionSummaryPdf,
} from "../pdf";
import { createScopedFilename, slugify } from "../utils";

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
