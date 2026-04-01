import React, { useState, FormEvent } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { ArtifactType } from "../../../types";
import { ArtifactDraft, defaultArtifactDraft } from "../../../context/MonyawnContext.types";
import { createArtifact, createCheckpoint, createTask } from "../../../workflow";

export const ArtifactForm: React.FC = () => {
  const { selectedOpportunity, patchState, opportunityArtifacts } = useMonyawn();
  const [artifactDraft, setArtifactDraft] = useState<ArtifactDraft>(defaultArtifactDraft);

  const handleArtifactSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedOpportunity) return;

    const artifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      ...artifactDraft,
    });
    
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Review ${artifactDraft.artifact_type}: ${artifactDraft.source_label}`,
      "Workflow Analyst",
      true,
    );
    
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Artifact added",
      artifactDraft.source_label,
      "low",
      "proceed",
      `New ${artifactDraft.artifact_type} added to the opportunity record.`,
      "low",
      "low",
    );

    patchState(
      (current) => ({
        ...current,
        artifacts: [artifact, ...current.artifacts],
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
      }),
      "Artifact recorded."
    );
    setArtifactDraft(defaultArtifactDraft);
  };

  return (
    <form className="stage-block" onSubmit={handleArtifactSubmit}>
      <h3>1. Document intake and management 🥱</h3>
      <p>Capture resumes, job descriptions, notes, and generated outputs with lifecycle-aware metadata.</p>
      <label className="field">
        <span>Artifact type</span>
        <select
          value={artifactDraft.artifact_type}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              artifact_type: event.target.value as ArtifactType,
            }))
          }
        >
          <option value="resume">Resume</option>
          <option value="job_description">Job description</option>
          <option value="message">Message</option>
          <option value="note">Note</option>
          <option value="offer">Offer</option>
          <option value="debrief">Debrief</option>
          <option value="generated_output">Generated output</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className="field">
        <span>Source label</span>
        <input
          value={artifactDraft.source_label}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              source_label: event.target.value,
            }))
          }
          required
        />
      </label>
      <label className="field">
        <span>Evidence note</span>
        <input
          value={artifactDraft.evidence_note}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              evidence_note: event.target.value,
            }))
          }
        />
      </label>
      <label className="field">
        <span>Content summary</span>
        <textarea
          rows={4}
          value={artifactDraft.content_summary}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              content_summary: event.target.value,
            }))
          }
        />
      </label>
      <button className="primary-action" type="submit">
        Add artifact 🥱
      </button>
      {!opportunityArtifacts.length && (
        <div className="warning-callout">
          <p>No artifacts yet. Start by uploading your resume to build your foundation. 🥱</p>
        </div>
      )}
    </form>
  );
};
