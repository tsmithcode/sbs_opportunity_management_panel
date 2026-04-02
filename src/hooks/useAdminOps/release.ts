import { useMonyawn } from "../../context/MonyawnContext";
import { createId, nowIso } from "../../workflow";
import { releaseStatus } from "../../releaseStatus";
import { downloadTextFile, formatTimestampForFile, slugify } from "../../utils/file";

export function useReleaseAdminOps() {
  const { state, patchState, setNotice, selectedAccount, selectedOpportunity } = useMonyawn();

  const handleReleaseSummaryMarkdownDownload = () => {
    const generatedAt = nowIso();
    const filename = `release-summary-${formatTimestampForFile(generatedAt)}.md`;
    const content = `# Release Summary

Generated: \`${generatedAt}\`

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
    downloadTextFile(filename, content, "text/markdown;charset=utf-8");
    setNotice({ tone: "success", message: "Release summary markdown downloaded." });
  };

  const handleReleaseSummaryJsonDownload = () => {
    const generatedAt = nowIso();
    const filename = `release-summary-${formatTimestampForFile(generatedAt)}.json`;
    const content = JSON.stringify({ generatedAt, ...releaseStatus }, null, 2);
    downloadTextFile(filename, content, "application/json;charset=utf-8");
    setNotice({ tone: "success", message: "Release summary JSON downloaded." });
  };

  const handleReadinessPacketDownload = async () => {
    const { renderReadinessPacketMarkdown } = await import("../../package");
    const generatedAt = nowIso();
    const accountName = selectedAccount?.account_name || "monyawn-account";
    const opportunityLabel = selectedOpportunity ? `${selectedOpportunity.company_name} ${selectedOpportunity.role_title}` : "workspace";
    const filename = `${slugify(accountName)}-${slugify(opportunityLabel)}-readiness-packet-${formatTimestampForFile(generatedAt)}.md`;
    
    const content = renderReadinessPacketMarkdown(state);
    
    downloadTextFile(filename, content, "text/markdown;charset=utf-8");
    setNotice({ tone: "success", message: "Buyer-facing readiness packet downloaded." });
  };

  const handleReleaseReadinessPacketExport = async () => {
    const { buildReleaseReadinessZip, createReadinessPacketFilename } = await import("../../package");
    const blob = await buildReleaseReadinessZip(state);
    const filename = createReadinessPacketFilename(state);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setNotice({ tone: "success", message: "Release readiness packet ZIP generated." });
  };

  const handleReleaseArtifactImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !state.selectedAccountId) return;

    const { importReleaseArtifactForReview } = await import("../../package");
    const result = await importReleaseArtifactForReview(file);

    if (result.ok) {
      patchState(current => ({
        ...current,
        releaseArtifactReviews: [
          {
            review_id: createId("review"),
            account_id: current.selectedAccountId,
            opportunity_id: current.selectedOpportunityId,
            imported_at: nowIso(),
            pinned: false,
            source_name: result.artifact.sourceName,
            ...result.artifact,
          },
          ...current.releaseArtifactReviews,
        ],
      }), "Release/readiness artifact imported for review.");
      setNotice({ tone: "success", message: "Release artifact imported for review." });
    } else {
      setNotice({ tone: "info", message: result.error });
    }
  };

  return {
    handleReleaseSummaryMarkdownDownload,
    handleReleaseSummaryJsonDownload,
    handleReadinessPacketDownload,
    handleReleaseReadinessPacketExport,
    handleReleaseArtifactImport,
  };
}
