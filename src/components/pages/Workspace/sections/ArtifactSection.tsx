import React from "react";
import { useMonyawn } from "../../../../context/MonyawnContext";
import { useArtifactOperations } from "../../../../hooks/useArtifactOperations";

export function ArtifactSection() {
  const { opportunityArtifacts } = useMonyawn();
  const { artifactDraft, setArtifactDraft, handleArtifactSubmit } = useArtifactOperations();

  return (
    <form className="stage-block" onSubmit={handleArtifactSubmit}>
      <h3>1. Document intake and management 🥱</h3>
      <p>Capture resumes, job descriptions, notes, and generated outputs with lifecycle-aware metadata.</p>
      
      <div className="field-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <label className="field">
          <span>Artifact type</span>
          <select
            value={artifactDraft.artifact_type}
            onChange={(e) => setArtifactDraft({ ...artifactDraft, artifact_type: e.target.value as any })}
          >
            <option value="resume">Resume</option>
            <option value="job_description">Job Description</option>
            <option value="cover_letter">Cover Letter</option>
            <option value="portfolio">Portfolio / Work Sample</option>
            <option value="recruiter_notes">Recruiter Notes</option>
            <option value="internal_note">Internal Note</option>
            <option value="generated_output">Generated Output</option>
          </select>
        </label>
        
        <label className="field">
          <span>Source label</span>
          <input
            type="text"
            required
            placeholder="e.g. Thomas Smith Resume"
            value={artifactDraft.source_label}
            onChange={(e) => setArtifactDraft({ ...artifactDraft, source_label: e.target.value })}
          />
        </label>
      </div>

      <label className="field">
        <span>Content summary or extract</span>
        <textarea
          required
          rows={4}
          placeholder="Paste key text or summary here for intelligence extraction..."
          value={artifactDraft.content_summary}
          onChange={(e) => setArtifactDraft({ ...artifactDraft, content_summary: e.target.value })}
        />
      </label>

      <button className="primary-action" type="submit">
        Add artifact 🥱
      </button>

      {!opportunityArtifacts.length && (
        <div className="warning-callout" style={{ marginTop: '1rem' }}>
          <p>No artifacts yet. Start by uploading your resume to build your foundation. 🥱</p>
        </div>
      )}

      {opportunityArtifacts.length > 0 && (
        <div className="artifact-list" style={{ marginTop: '1rem' }}>
          <p className="panel-label">Active Lifecycle Artifacts ({opportunityArtifacts.length})</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {opportunityArtifacts.map(a => (
              <li key={a.artifact_id} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{a.source_label}</span>
                <span className="status-chip">{a.artifact_type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
