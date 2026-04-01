import { useMemo } from "react";
import { useMonyawn } from "../context/MonyawnContext";
import { ProfileDraft } from "../context/MonyawnContext.types";
import { createCheckpoint, nowIso } from "../workflow";

export function useProfileOperations() {
  const { state, patchState, selectedOpportunity, selectedProfile, setNotice } = useMonyawn();

  const currentProfileDraft = useMemo((): ProfileDraft => ({
    skills_summary: selectedProfile?.skills_summary ?? "",
    experience_level: selectedProfile?.experience_level ?? "",
    domain_strengths: selectedProfile?.domain_strengths ?? "",
    declared_gaps: selectedProfile?.declared_gaps ?? "",
    user_corrected: selectedProfile?.user_corrected ?? false,
  }), [selectedProfile]);

  const handleProfileSubmit = (e: React.FormEvent, draft: ProfileDraft) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    const nextProfile = {
      profile_id: selectedProfile?.profile_id || `profile_${Date.now()}`,
      opportunity_id: selectedOpportunity.opportunity_id,
      user_id: state.selectedUserId,
      ...draft,
      user_corrected: true,
      updated_at: nowIso(),
    };

    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Candidate profile confirmation",
      "User manually corrected or confirmed the extracted profile signals.",
      "high",
      "proceed",
      "Profile reflects manual user input and truthfulness confirmation.",
      "low",
      "low",
    );

    patchState(
      (current) => ({
        ...current,
        candidateProfiles: [
          nextProfile,
          ...current.candidateProfiles.filter((p) => p.opportunity_id !== selectedOpportunity.opportunity_id),
        ],
        checkpoints: [checkpoint, ...current.checkpoints],
      }),
      "Candidate profile updated and confirmed. 🥱",
    );
    
    setNotice({ tone: "success", message: "Profile baseline confirmed. 🥱" });
  };

  return {
    currentProfileDraft,
    handleProfileSubmit,
  };
}
