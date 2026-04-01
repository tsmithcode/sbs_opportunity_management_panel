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
    <form className="stage-block" onSubmit={handleProfileSubmit}>
      <h3>2. Candidate profile confirmation 🥱</h3>
      <p>Turn extracted data into a reviewable, correctable profile that drives checkpoints and fit analysis.</p>
      <label className="field">
        <span>Skills summary</span>
        <textarea rows={3} defaultValue={selectedProfile?.skills_summary} name="skills_summary" />
      </label>
      <label className="field">
        <span>Experience level</span>
        <input defaultValue={selectedProfile?.experience_level} name="experience_level" />
      </label>
      <label className="field">
        <span>Domain strengths</span>
        <textarea rows={3} defaultValue={selectedProfile?.domain_strengths} name="domain_strengths" />
      </label>
      <label className="field">
        <span>Declared gaps</span>
        <textarea rows={3} defaultValue={selectedProfile?.declared_gaps} name="declared_gaps" />
      </label>
      <button className="primary-action" type="submit">
        Save profile
      </button>
    </form>
  );
};
