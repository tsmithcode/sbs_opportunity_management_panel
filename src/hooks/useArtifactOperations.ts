import { useState } from "react";
import { useMonyawn } from "../context/MonyawnContext";
import { ArtifactDraft, defaultArtifactDraft } from "../context/MonyawnContext.types";
import { createArtifact, createTask } from "../workflow";

export function useArtifactOperations() {
  const { patchState, selectedOpportunity, setNotice } = useMonyawn();
  const [artifactDraft, setArtifactDraft] = useState<ArtifactDraft>(defaultArtifactDraft);

  const handleArtifactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity first." });
      return;
    }

    const nextArtifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      ...artifactDraft,
    });
    
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Review ${artifactDraft.artifact_type}: ${artifactDraft.source_label}`,
      "Data Steward",
      true,
    );

    patchState(
      (current) => ({
        ...current,
        artifacts: [nextArtifact, ...current.artifacts],
        tasks: [task, ...current.tasks],
      }),
      `Artifact '${artifactDraft.source_label}' added. 🥱`,
    );
    
    setArtifactDraft(defaultArtifactDraft);
    setNotice({ tone: "success", message: "Artifact recorded in lifecycle. 🥱" });
  };

  return {
    artifactDraft,
    setArtifactDraft,
    handleArtifactSubmit,
  };
}
