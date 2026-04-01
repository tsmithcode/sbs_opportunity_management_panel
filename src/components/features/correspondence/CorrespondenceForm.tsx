import React, { useState, FormEvent } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { useCorrespondenceOps } from "../../../hooks/useCorrespondenceOps";
import { CorrespondenceDraft, defaultCorrespondenceDraft } from "../../../context/MonyawnContext.types";

export const CorrespondenceForm: React.FC = () => {
  const { opportunityCorrespondence } = useMonyawn();
  const { handleCorrespondenceSubmit: opsHandleCorrespondenceSubmit } = useCorrespondenceOps();
  const [correspondenceDraft, setCorrespondenceDraft] = useState<CorrespondenceDraft>(defaultCorrespondenceDraft);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    opsHandleCorrespondenceSubmit(correspondenceDraft);
    setCorrespondenceDraft(defaultCorrespondenceDraft);
  };

  return (
    <form className="stage-block" onSubmit={handleSubmit}>
      <h3>3. Correspondence operations 🥱</h3>
      <p>Generate reviewable outreach or internal notes without bypassing approval state or auditability.</p>
      <label className="field">
        <span>Channel</span>
        <select
          value={correspondenceDraft.channel}
          onChange={(event) =>
            setCorrespondenceDraft((current) => ({
              ...current,
              channel: event.target.value as CorrespondenceDraft["channel"],
            }))
          }
        >
          <option value="email">Email</option>
          <option value="linkedin">LinkedIn</option>
          <option value="note">Internal note</option>
        </select>
      </label>
      <label className="field">
        <span>Subject</span>
        <input
          value={correspondenceDraft.subject}
          onChange={(event) =>
            setCorrespondenceDraft((current) => ({
              ...current,
              subject: event.target.value,
            }))
          }
        />
      </label>
      <label className="field">
        <span>Body</span>
        <textarea
          rows={4}
          value={correspondenceDraft.body}
          onChange={(event) =>
            setCorrespondenceDraft((current) => ({
              ...current,
              body: event.target.value,
            }))
          }
        />
      </label>
      <button className="primary-action" type="submit">
        Create correspondence draft 🥱
      </button>
      {!opportunityCorrespondence.length && (
        <div className="warning-callout">
          <p>No messages yet. Capture recruiter notes or outreach drafts here. 🥱</p>
        </div>
      )}
    </form>
  );
};
