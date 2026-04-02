import React, { FormEvent } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { nowIso } from "../../../workflow";

export const ProfileForm: React.FC = () => {
  const { selectedProfile, patchState } = useMonyawn();

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProfile) return;

    const formData = new FormData(event.currentTarget);

    patchState(
      (current) => ({
        ...current,
        candidateProfiles: current.candidateProfiles.map((profile) =>
          profile.profile_id === selectedProfile.profile_id
            ? {
                ...profile,
                skills_summary: String(formData.get("skills_summary") ?? ""),
                experience_level: String(formData.get("experience_level") ?? ""),
                domain_strengths: String(formData.get("domain_strengths") ?? ""),
                declared_gaps: String(formData.get("declared_gaps") ?? ""),
                user_corrected: true,
                updated_at: nowIso(),
              }
            : profile,
        ),
      }),
      "Candidate profile updated."
    );
  };

  return (
    <form className="flex flex-col gap-6 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow" onSubmit={handleProfileSubmit}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Profile review</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink mb-2">Candidate profile confirmation</h3>
        <p className="text-sm text-brand-muted leading-relaxed">Turn extracted data into a reviewable, correctable profile that drives checkpoints and fit analysis.</p>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Skills summary</span>
        <textarea 
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={4} 
          defaultValue={selectedProfile?.skills_summary} 
          name="skills_summary" 
        />
      </label>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Experience level</span>
          <input 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
            defaultValue={selectedProfile?.experience_level} 
            name="experience_level" 
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Domain strengths</span>
          <textarea 
            className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
            rows={4} 
            defaultValue={selectedProfile?.domain_strengths} 
            name="domain_strengths" 
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Declared gaps</span>
        <textarea 
          className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          rows={4} 
          defaultValue={selectedProfile?.declared_gaps} 
          name="declared_gaps" 
        />
      </label>
      <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2 self-start" type="submit">
        Save profile
      </button>
    </form>
  );
};
