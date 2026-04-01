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
      "Commercial posture updated",
      "User defined target rate and SOW status.",
      "medium",
      "proceed",
      "Commercial terms are actively managed.",
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
    }), "Commercial posture updated.");
  };

  if (!selectedOpportunity || selectedOpportunity.pathway !== "1099") return null;

  return (
    <form className="stage-block" onSubmit={handleSubmit}>
      <h3>1099 Commercial Posture 🥱</h3>
      <p>Define your consulting terms, rate expectations, and SOW readiness.</p>
      
      <label className="field">
        <span>Target Rate / Budget</span>
        <input 
          value={draft.target_rate} 
          onChange={e => setDraft(d => ({ ...d, target_rate: e.target.value }))}
          placeholder="e.g. $150/hr or $25k fixed"
        />
      </label>
      
      <label className="field">
        <span>Engagement Type</span>
        <select 
          value={draft.engagement_type} 
          onChange={e => setDraft(d => ({ ...d, engagement_type: e.target.value as any }))}
        >
          <option value="time_and_materials">Time and Materials</option>
          <option value="fixed_bid">Fixed Bid / Project</option>
          <option value="retainer">Retainer</option>
        </select>
      </label>
      
      <label className="field">
        <span>SOW Status</span>
        <select 
          value={draft.sow_status} 
          onChange={e => setDraft(d => ({ ...d, sow_status: e.target.value as any }))}
        >
          <option value="not_started">Not Started</option>
          <option value="drafting">Drafting</option>
          <option value="proposed">Proposed / Sent</option>
          <option value="negotiating">Negotiating</option>
          <option value="signed">Signed / Active</option>
        </select>
      </label>

      <label className="field">
        <span>Availability</span>
        <input 
          value={draft.availability} 
          onChange={e => setDraft(d => ({ ...d, availability: e.target.value }))}
          placeholder="e.g. 20 hrs/week starting next month"
        />
      </label>

      <label className="field">
        <span>Internal Notes & Scope Risks</span>
        <textarea 
          rows={3} 
          value={draft.notes} 
          onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
          placeholder="Track risks, scope creep concerns, or required prep here."
        />
      </label>

      <button className="primary-action" type="submit">
        Save Posture 🥱
      </button>
    </form>
  );
};
