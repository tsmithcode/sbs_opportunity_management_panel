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
      "Support notes updated."
    );
  };

  return (
    <form className="flex flex-col gap-6 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow" onSubmit={handleSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Private zone</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink mb-2">Real‑life notes (optional)</h3>
        <p className="text-sm text-brand-muted leading-relaxed">
          Optional and local-only. Export stays off unless you flip it on.
        </p>
      </div>
      
      <label className="flex items-center gap-3 p-4 rounded-[1.5rem] border border-black/5 bg-brand-surface-strong/50 hover:bg-brand-surface-strong transition-all cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-black/20 text-brand-accent focus:ring-brand-accent transition-all cursor-pointer"
          checked={draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, enabled: event.target.checked }))}
        />
        <span className="text-sm font-medium text-brand-ink">Turn on private support notes for this play</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(Object.keys(supportTemplates) as SensitiveSupportType[]).map((key) => (
          <label key={key} className={`flex items-center gap-3 p-3 rounded-[1.25rem] border transition-all cursor-pointer ${draft.enabled ? 'border-black/5 bg-brand-surface-strong/50 hover:bg-brand-surface-strong' : 'border-transparent bg-black/5 opacity-50 cursor-not-allowed'}`}>
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-black/20 text-brand-accent focus:ring-brand-accent transition-all cursor-pointer disabled:cursor-not-allowed"
              checked={draft.categories.includes(key)}
              disabled={!draft.enabled}
              onChange={(event) => toggleCategory(key, event.target.checked)}
            />
            <span className="text-xs font-medium text-brand-ink">{supportTemplates[key].label}</span>
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Private notes</span>
        <textarea
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={5}
          value={draft.notes}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, notes: event.target.value }))}
          placeholder="Only write what helps you plan. Totally optional."
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Your next‑step plan</span>
        <textarea
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={5}
          value={draft.encouragement_plan}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, encouragement_plan: event.target.value }))}
          placeholder="Write the next move you want for yourself."
        />
      </label>

      <label className={`flex items-center gap-3 p-4 rounded-[1.5rem] border transition-all cursor-pointer ${draft.enabled ? 'border-black/5 bg-brand-surface-strong/50 hover:bg-brand-surface-strong' : 'border-transparent bg-black/5 opacity-50 cursor-not-allowed'}`}>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-black/20 text-brand-accent focus:ring-brand-accent transition-all cursor-pointer disabled:cursor-not-allowed"
          checked={draft.include_in_export}
          disabled={!draft.enabled}
          onChange={(event) => setDraft(c => ({ ...c, include_in_export: event.target.checked }))}
        />
        <span className="text-sm font-medium text-brand-ink">Include these notes in the next export</span>
      </label>

      <button 
        className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2 self-start disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
        type="submit" 
        disabled={!draft.enabled}
      >
        Save private notes
      </button>
    </form>
  );
};
