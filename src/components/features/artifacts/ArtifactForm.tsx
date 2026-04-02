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
    <form className="flex flex-col gap-6 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow" onSubmit={handleArtifactSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Evidence intake</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink mb-2">Document intake and management</h3>
        <p className="text-sm text-brand-muted leading-relaxed">Capture resumes, job descriptions, notes, and generated outputs with lifecycle-aware metadata.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Artifact type</span>
          <select
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
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
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Source label</span>
          <input
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
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
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Evidence note</span>
        <input
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
          value={artifactDraft.evidence_note}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              evidence_note: event.target.value,
            }))
          }
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Content summary</span>
        <textarea
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={5}
          value={artifactDraft.content_summary}
          onChange={(event) =>
            setArtifactDraft((current) => ({
              ...current,
              content_summary: event.target.value,
            }))
          }
        />
      </label>
      <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2 self-start" type="submit">
        Add artifact
      </button>
      {!opportunityArtifacts.length && (
        <div className="p-4 rounded-[1.5rem] bg-brand-review/30 border border-brand-review/50 text-sm text-brand-ink">
          <p>No artifacts yet. Start with the resume or the job description to give the opportunity a real evidence base.</p>
        </div>
      )}
    </form>
  );
};
