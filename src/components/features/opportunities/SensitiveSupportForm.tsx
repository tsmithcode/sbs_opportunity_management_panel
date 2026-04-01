import React, { useState, FormEvent } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { supportTemplates } from "../../../support";
import { SensitiveSupportType } from "../../../types";
import { createSensitiveSupportProfile, nowIso } from "../../../workflow";

export const SensitiveSupportForm: React.FC = () => {
  const { selectedOpportunity, selectedSensitiveSupport, patchState } = useMonyawn();
  
  const [draft, setDraft] = useState({
    enabled: selectedSensitiveSupport?.enabled ?? false,
    categories: selectedSensitiveSupport?.categories ?? [] as SensitiveSupportType[],
    notes: selectedSensitiveSupport?.notes ?? "",
    encouragement_plan: selectedSensitiveSupport?.encouragement_plan ?? "",
    include_in_export: selectedSensitiveSupport?.include_in_export ?? false,
  });

  const toggleCategory = (category: SensitiveSupportType, checked: boolean) => {
    setDraft(current => ({
      ...current,
      categories: checked 
        ? Array.from(new Set([...current.categories, category]))
        : current.categories.filter((c: any) => c !== category)
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedOpportunity) return;

    const existing = selectedSensitiveSupport ?? createSensitiveSupportProfile(selectedOpportunity.opportunity_id);
    const nextProfile = {
      ...existing,
      ...draft,
      updated_at: nowIso(),
    };

    patchState(
      (current) => ({
        ...current,
        sensitiveSupportProfiles: [
          nextProfile,
          ...current.sensitiveSupportProfiles.filter(p => p.opportunity_id !== selectedOpportunity.opportunity_id)
        ],
      }),
      "Sensitive support profile updated."
    );
  };

  return (
    <form className="stage-block col-span-2" onSubmit={handleSubmit}>
      <h3>Optional sensitive support path</h3>
      <p>
        This section is fully optional. It stays local to this device and
        is excluded from export unless you explicitly include it.
      </p>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, enabled: event.target.checked }))}
        />
        <span>Enable local-only support guidance for this opportunity</span>
      </label>
      <div className="support-grid">
        {(Object.keys(supportTemplates) as SensitiveSupportType[]).map((key) => (
          <label key={key} className="checkbox-field">
            <input
              type="checkbox"
              checked={draft.categories.includes(key)}
              disabled={!draft.enabled}
              onChange={(event) => toggleCategory(key, event.target.checked)}
            />
            <span>{supportTemplates[key].label}</span>
          </label>
        ))}
      </div>
      <label className="field">
        <span>Private notes</span>
        <textarea
          rows={4}
          value={draft.notes}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, notes: event.target.value }))}
          placeholder="Only capture what helps you plan. This is not required."
        />
      </label>
      <label className="field">
        <span>Encouragement and practical next-step plan</span>
        <textarea
          rows={4}
          value={draft.encouragement_plan}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, encouragement_plan: event.target.value }))}
          placeholder="Record a calm next-step plan for yourself."
        />
      </label>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={draft.include_in_export}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, include_in_export: event.target.checked }))}
        />
        <span>Include this support profile in the next handoff export</span>
      </label>
      <button className="primary-action" type="submit" disabled={!draft.enabled}>
        Save support profile
      </button>
    </form>
  );
};
