import { ChangeEvent } from "react";
import { useMonyawn } from "../context/MonyawnContext";
import { validateAppStateIntegrity } from "../integrity";
import { nowIso } from "../workflow";
import { SCHEMA_VERSION } from "../schema";
import { createSeedState } from "../seed";

export function useDataTransformOps() {
  const { state, patchState, setNotice } = useMonyawn();

  const handleExport = async () => {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({ tone: "info", message: `Export blocked: ${report.errors[0]}` });
      return;
    }

    const { buildExportZip, createExportFilename } = await import("../package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildExportZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createExportFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    
    patchState(current => ({ ...current, lastExportedAt: new Date().toISOString() }));
    setNotice({
      tone: "success",
      message: report.warnings.length > 0
        ? `ZIP handoff package generated with ${report.warnings.length} integrity warning${report.warnings.length === 1 ? "" : "s"}.`
        : "ZIP handoff package generated.",
    });
  };

  const handleBuyerPacketExport = async () => {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({ tone: "info", message: `Buyer packet blocked: ${report.errors[0]}` });
      return;
    }

    const { buildBuyerPacketZip, createBuyerPacketFilename } = await import("../package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildBuyerPacketZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createBuyerPacketFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    setNotice({ tone: "success", message: "Premium enterprise buyer packet generated." });
  };

  const handleReleaseReadinessPacketExport = async () => {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({ tone: "info", message: `Release readiness packet blocked: ${report.errors[0]}` });
      return;
    }

    const { buildReleaseReadinessZip, createReadinessPacketFilename } = await import("../package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildReleaseReadinessZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createReadinessPacketFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    setNotice({ tone: "success", message: "Release readiness packet ZIP generated." });
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { importStateFromFile } = await import("../package");
    const result = await importStateFromFile(file);
    if (result.ok && result.state) {
      const fallback = createSeedState();
      const importedState = {
        ...fallback,
        ...result.state,
        schemaVersion: result.state.schemaVersion || SCHEMA_VERSION,
        reportingSnapshots: result.state.reportingSnapshots?.length ? result.state.reportingSnapshots : fallback.reportingSnapshots,
        candidateStories: result.state.candidateStories ?? fallback.candidateStories,
        sensitiveSupportProfiles: result.state.sensitiveSupportProfiles ?? fallback.sensitiveSupportProfiles,
        releaseArtifactReviews: result.state.releaseArtifactReviews ?? fallback.releaseArtifactReviews,
        lastExportedAt: result.state.lastExportedAt ?? "",
      };
      
      const importIntegrity = validateAppStateIntegrity(importedState);
      patchState(() => importedState, "Platform import loaded.");
      setNotice({
        tone: "success",
        message: result.warning ?? (importIntegrity.errors.length ? "Import loaded with errors." : "Platform import loaded."),
      });
    } else {
      setNotice({ tone: "info", message: (result as any).error || "Import failed" });
    }
    event.target.value = "";
  };

  const handleReleaseArtifactImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { importReleaseArtifactForReview } = await import("../package");
    const result = await importReleaseArtifactForReview(file);
    if (result.ok && result.artifact) {
      patchState(current => ({
        ...current,
        releaseArtifactReviews: [
          {
            review_id: `release_review_${Date.now()}`,
            account_id: current.selectedAccountId,
            opportunity_id: current.selectedOpportunityId,
            title: result.artifact!.title,
            summary: result.artifact!.summary,
            source_name: result.artifact!.sourceName,
            entries: result.artifact!.entries,
            content: result.artifact!.content,
            pinned: false,
            imported_at: nowIso(),
          },
          ...current.releaseArtifactReviews,
        ],
      }), "Release artifact imported.");
      setNotice({ tone: "success", message: "Release/readiness artifact imported for review." });
    } else {
      setNotice({ tone: "info", message: (result as any).error || "Import failed" });
    }
    event.target.value = "";
  };

  const resetSeedState = () => {
    patchState(() => createSeedState(), "Reset to reference state.");
    setNotice({ tone: "success", message: "Reset to the seeded Monyawn reference state." });
  };

  const handlePremiumDiligencePacketExport = async () => {
    if (!state.selectedOpportunityId) {
      setNotice({ tone: "info", message: "Select an opportunity first." });
      return;
    }
    const opportunity = state.opportunities.find(o => o.opportunity_id === state.selectedOpportunityId);
    if (!opportunity) return;

    const { buildPremiumDiligencePacketPdf } = await import("../package/pdf");
    const pdfData = await buildPremiumDiligencePacketPdf(state, opportunity);
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Diligence_Packet_${opportunity.company_name.replace(/\s+/g, "_")}.pdf`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setNotice({ tone: "success", message: "Premium Diligence Packet PDF generated." });
  };

  const handleSharePlay = async () => {
    if (!state.selectedOpportunityId) {
      setNotice({ tone: "info", message: "Select an opportunity first." });
      return;
    }
    const opportunity = state.opportunities.find(o => o.opportunity_id === state.selectedOpportunityId);
    if (!opportunity) return;

    const shareText = `Monyawn Play: ${opportunity.role_title} at ${opportunity.company_name}\n\nEvidence-backed status: ${state.candidateStories.find(s => s.opportunity_id === opportunity.opportunity_id) ? "Story locked" : "Intake in progress"}\n\nManaged via Monyawn 🥱`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Monyawn Play: ${opportunity.company_name}`,
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText + "\n" + window.location.origin);
      setNotice({ tone: "success", message: "Professional summary copied to clipboard." });
    }
  };

  return {
    handleExport,
    handleBuyerPacketExport,
    handlePremiumDiligencePacketExport,
    handleReleaseReadinessPacketExport,
    handleSharePlay,
    handleImport,
    handleReleaseArtifactImport,
    resetSeedState
  };
}
