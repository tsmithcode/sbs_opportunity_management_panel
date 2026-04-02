import { useState } from "react";
import { useMonyawn } from "../context/MonyawnContext";
import { ArtifactDraft, defaultArtifactDraft } from "../context/MonyawnContext.types";
import { createArtifact, createTask } from "../workflow";
import { extractSignalsFromText } from "../intelligence/signals";

export function useArtifactOperations() {
  const { patchState, selectedOpportunity, selectedProfile, setNotice } = useMonyawn();
  const [artifactDraft, setArtifactDraft] = useState<ArtifactDraft>(defaultArtifactDraft);

  const handleArtifactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Pick a play first." });
      return;
    }

    const nextArtifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      ...artifactDraft,
    });
    
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Review ${artifactDraft.artifact_type}: ${artifactDraft.source_label}`,
      "Proof checker",
      true,
    );

    patchState(
      (current) => ({
        ...current,
        artifacts: [nextArtifact, ...current.artifacts],
        tasks: [task, ...current.tasks],
      }),
      `Proof '${artifactDraft.source_label}' added.`,
    );
    
    // Auto-extraction if there's text
    if (artifactDraft.source_text?.trim() && selectedProfile) {
      const signals = extractSignalsFromText(artifactDraft.source_text, selectedOpportunity.company_name);
      
      if (signals.companies.length || signals.names.length) {
        setNotice({ 
          tone: "success", 
          message: `Proof recorded. AI extracted ${signals.companies.length} entities and ${signals.emails.length} contacts.` 
        });
      }
    } else {
      setNotice({ tone: "success", message: "Proof recorded." });
    }

    setArtifactDraft(defaultArtifactDraft);
  };

  return {
    artifactDraft,
    setArtifactDraft,
    handleArtifactSubmit,
  };
}
