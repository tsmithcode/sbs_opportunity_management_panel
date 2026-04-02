import React, { useState, FormEvent, useEffect } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { CommercialPostureProfile } from "../../../types";
import { createCheckpoint, nowIso } from "../../../workflow";

export const CommercialPostureForm: React.FC = () => {
  const { selectedOpportunity, selectedCommercialPosture, patchState } = useMonyawn();
  
  const [draft, setDraft] = useState<Partial<CommercialPostureProfile>>({
    target_rate: "",
    engagement_type: "fixed_bid",
    availability: "",
    sow_status: "not_started",
    notes: ""
  });

  useEffect(() => {
    if (selectedCommercialPosture) {
      setDraft({
        target_rate: selectedCommercialPosture.target_rate,
        engagement_type: selectedCommercialPosture.engagement_type,
        availability: selectedCommercialPosture.availability,
        sow_status: selectedCommercialPosture.sow_status,
        notes: selectedCommercialPosture.notes
      });
    }
  }, [selectedCommercialPosture]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedOpportunity) return;

    const nextPosture: CommercialPostureProfile = {
      posture_id: selectedCommercialPosture?.posture_id || `posture_${Date.now()}`,
      opportunity_id: selectedOpportunity.opportunity_id,
      target_rate: draft.target_rate || "",
      engagement_type: draft.engagement_type as "fixed_bid" | "time_and_materials" | "retainer",
      availability: draft.availability || "",
      sow_status: draft.sow_status as "drafting" | "proposed" | "negotiating" | "signed" | "not_started",
      notes: draft.notes || "",
      updated_at: nowIso(),
    };

    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Money terms updated",
      "User set rate and scope status.",
      "medium",
      "proceed",
      "Money terms are being tracked.",
      "low",
      "low",
    );

    patchState(current => ({
      ...current,
      commercialPostures: [
        nextPosture,
        ...current.commercialPostures.filter(p => p.opportunity_id !== selectedOpportunity.opportunity_id)
      ],
      checkpoints: [checkpoint, ...current.checkpoints]
    }), "Money terms updated.");
  };

  if (!selectedOpportunity || selectedOpportunity.pathway !== "1099") return null;

  return (
    <form className="flex flex-col gap-6 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow" onSubmit={handleSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Money talk</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink mb-2">Contract bag setup</h3>
        <p className="text-sm text-brand-muted leading-relaxed">Set your rate, availability, and scope status.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Target rate / budget</span>
          <input 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
            value={draft.target_rate} 
            onChange={e => setDraft(d => ({ ...d, target_rate: e.target.value }))}
            placeholder="e.g. $150/hr or $25k fixed"
          />
        </label>
        
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Availability</span>
          <input 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
            value={draft.availability} 
            onChange={e => setDraft(d => ({ ...d, availability: e.target.value }))}
            placeholder="e.g. 20 hrs/week starting next month"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Deal type</span>
          <select 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={draft.engagement_type} 
            onChange={e => setDraft(d => ({ ...d, engagement_type: e.target.value as any }))}
          >
            <option value="time_and_materials">Time + materials</option>
            <option value="fixed_bid">Fixed bid</option>
            <option value="retainer">Retainer</option>
          </select>
        </label>
        
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Scope status</span>
          <select 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={draft.sow_status} 
            onChange={e => setDraft(d => ({ ...d, sow_status: e.target.value as any }))}
          >
            <option value="not_started">Not started</option>
            <option value="drafting">Drafting</option>
            <option value="proposed">Proposed / sent</option>
            <option value="negotiating">Negotiating</option>
            <option value="signed">Signed / active</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Notes & scope risks</span>
        <textarea 
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={5} 
          value={draft.notes} 
          onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
          placeholder="Track risks, scope creep, or required prep."
        />
      </label>

      <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2 self-start" type="submit">
        Save money terms
      </button>
    </form>
  );
};
