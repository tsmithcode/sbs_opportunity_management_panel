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
    <form className="flex flex-col gap-6 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow" onSubmit={handleSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Message control</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink mb-2">Correspondence operations</h3>
        <p className="text-sm text-brand-muted leading-relaxed">Generate reviewable outreach or internal notes without bypassing approval state or auditability.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Channel</span>
          <select
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
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
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Subject</span>
          <input
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
            value={correspondenceDraft.subject}
            onChange={(event) =>
              setCorrespondenceDraft((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Body</span>
        <textarea
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={6}
          value={correspondenceDraft.body}
          onChange={(event) =>
            setCorrespondenceDraft((current) => ({
              ...current,
              body: event.target.value,
            }))
          }
        />
      </label>
      <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2 self-start" type="submit">
        Create correspondence draft
      </button>
      {!opportunityCorrespondence.length && (
        <div className="p-4 rounded-[1.5rem] bg-brand-review/30 border border-brand-review/50 text-sm text-brand-ink">
          <p>No messages yet. Capture recruiter notes or your next outreach draft here so the workflow stays reviewable.</p>
        </div>
      )}
    </form>
  );
};
