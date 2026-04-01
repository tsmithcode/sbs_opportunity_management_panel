import { useMonyawn } from "../context/MonyawnContext";
import { 
  createCorrespondence, 
  createArtifact, 
  createCheckpoint
} from "../workflow";
import { extractSignalsFromText } from "../intelligence";
import { CorrespondenceStatus } from "../types";
import { CorrespondenceDraft } from "../context/MonyawnContext.types";

export function useCorrespondenceOps() {
  const { patchState, selectedOpportunity, setNotice } = useMonyawn();

  const handleCorrespondenceSubmit = (draft: CorrespondenceDraft) => {
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before drafting correspondence." });
      return;
    }

    const correspondence = createCorrespondence(
      selectedOpportunity.opportunity_id,
      draft.channel,
      draft.subject,
      draft.body,
      extractSignalsFromText(
        `${draft.subject}\n${draft.body}`,
        selectedOpportunity.company_name,
      ),
    );
    
    const artifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      artifact_type: "message",
      source_label: correspondence.subject || "Untitled message draft",
      origin: "system_generated",
      review_status: "unreviewed",
      parse_status: "not_applicable",
      evidence_note: "Correspondence operations",
      content_summary: correspondence.body,
      extracted_signals: correspondence.extracted_signals,
    });
    
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Correspondence signal extraction",
      "Correspondence text was parsed for contact, timing, and interview signals.",
      correspondence.extracted_signals &&
        (correspondence.extracted_signals.emails.length ||
          correspondence.extracted_signals.dates.length ||
          correspondence.extracted_signals.times.length)
        ? "high"
        : "medium",
      "proceed_with_warning",
      `Captured ${correspondence.extracted_signals?.emails.length ?? 0} emails, ${correspondence.extracted_signals?.dates.length ?? 0} dates, and ${correspondence.extracted_signals?.times.length ?? 0} time references from correspondence.`,
      "low",
      "low",
    );

    patchState(
      (current) => ({
        ...current,
        correspondence: [correspondence, ...current.correspondence],
        artifacts: [artifact, ...current.artifacts],
        checkpoints: [checkpoint, ...current.checkpoints],
      }),
      "Correspondence draft created with structured signal extraction and attached to the document record.",
    );
    
    return correspondence;
  };

  const setCorrespondenceStatus = (correspondenceId: string, status: CorrespondenceStatus) => {
    patchState(
      (current) => ({
        ...current,
        correspondence: current.correspondence.map((c) =>
          c.correspondence_id === correspondenceId ? { ...c, status, updated_at: new Date().toISOString() } : c
        ),
      }),
      "Correspondence status updated.",
    );
  };

  return {
    handleCorrespondenceSubmit,
    setCorrespondenceStatus,
  };
}
