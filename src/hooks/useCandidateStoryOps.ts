import { useMonyawn } from "../context/MonyawnContext";
import { 
  generateStoryWithOpenAI, 
  generateCandidateStory, 
  createCandidateStoryRecord 
} from "../intelligence";
import { createCheckpoint } from "../workflow";
import { CandidateStory } from "../types";

export function useCandidateStoryOps() {
  const { 
    state, 
    patchState, 
    setNotice,
    selectedUser,
    selectedOpportunity,
    selectedProfile,
    opportunityArtifacts,
    opportunityCorrespondence
  } = useMonyawn();

  const handleGenerateCandidateStory = async () => {
    if (!selectedOpportunity || !selectedUser || !selectedProfile) {
      setNotice({ tone: "info", message: "Missing required profile data for story generation." });
      return;
    }

    setNotice({ tone: "info", message: "Generating candidate story narrative... 🥱" });

    try {
      let storyDraft: Omit<CandidateStory, "story_id" | "updated_at">;

      if (state.aiSettings.provider === "openai" && state.aiSettings.openai_api_key) {
        storyDraft = await generateStoryWithOpenAI({
          apiKey: state.aiSettings.openai_api_key,
          model: state.aiSettings.model || "gpt-4o-mini",
          user: selectedUser,
          opportunity: selectedOpportunity,
          profile: selectedProfile,
          artifacts: opportunityArtifacts,
          correspondence: opportunityCorrespondence,
        });
      } else {
        storyDraft = generateCandidateStory({
          user: selectedUser,
          opportunity: selectedOpportunity,
          profile: selectedProfile,
          artifacts: opportunityArtifacts,
          correspondence: opportunityCorrespondence,
        });
      }

      const nextStory = createCandidateStoryRecord(storyDraft);
      const checkpoint = createCheckpoint(
        selectedOpportunity,
        "Candidate story generated",
        "Narrative ready for review",
        "high",
        "proceed",
        "The AI-generated candidate story is now attached to the opportunity record.",
        "medium",
        "low"
      );

      patchState(
        (current) => ({
          ...current,
          candidateStories: [nextStory, ...current.candidateStories],
          checkpoints: [checkpoint, ...current.checkpoints],
        }),
        "Candidate story narrative generated and attached to the opportunity."
      );
      
      return nextStory;
    } catch (error: any) {
      setNotice({ tone: "info", message: `Generation failed: ${error.message}` });
    }
  };

  return {
    handleGenerateCandidateStory,
  };
}
