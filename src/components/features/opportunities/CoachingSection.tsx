import React, { useState, useCallback } from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { getCoachingTitle, getCoachingForStage } from "../../../coaching";
import { FLAGS } from "../../../lib/flags";
import { generateStory } from "../../../intelligence/providers";
import { createCandidateStoryRecord } from "../../../intelligence/story";
import { CandidateStory } from "../../../types";

export const CoachingSection: React.FC = () => {
  const {
    state,
    selectedOpportunity,
    selectedProfile,
    opportunityArtifacts,
    opportunityCorrespondence,
    patchState,
    setNotice,
  } = useMonyawn();

  const coaching = getCoachingForStage(selectedOpportunity?.current_stage ?? "intake_started");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStory = useCallback(async () => {
    if (!selectedOpportunity) return;

    setIsLoading(true);
    setNotice(null);

    try {
      const newStoryData = await generateStory({
        user: state.users.find((u) => u.user_id === state.selectedUserId),
        opportunity: selectedOpportunity,
        profile: selectedProfile,
        artifacts: opportunityArtifacts,
        correspondence: opportunityCorrespondence,
        aiSettings: state.aiSettings,
      });
      const newStory: CandidateStory = createCandidateStoryRecord(newStoryData);

      patchState(
        (s) => ({
          ...s,
          candidateStories: [...s.candidateStories, newStory],
        }),
        "AI-generated story added.",
      );
      setNotice({ tone: "success", message: "AI generated a new candidate story!" });
    } catch (error) {
      console.error("AI story generation failed:", error);
      setNotice({
        tone: "info",
        message: `AI story generation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    state.users.find((u) => u.user_id === state.selectedUserId),
    selectedOpportunity,
    selectedProfile,
    opportunityArtifacts,
    opportunityCorrespondence,
    state.aiSettings,
    patchState,
    setNotice,
  ]);

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">
          Optional tips
        </p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink">
          Stage tips if you want them
        </h3>
      </div>
      <p className="text-sm text-brand-muted leading-relaxed">
        These tips stay hidden unless you open them. Skip anytime.
      </p>
      {FLAGS.openai_enabled && selectedOpportunity && (
        <button
          onClick={handleGenerateStory}
          disabled={isLoading}
          className="bg-brand-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate with AI"}
        </button>
      )}
      <div className="space-y-4">
        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">
            {getCoachingTitle(selectedOpportunity?.current_stage ?? "intake_started")}
          </summary>
          <p className="text-sm text-brand-muted leading-relaxed mt-4">{coaching.intro}</p>
          <ul className="mt-4 space-y-2">
            {coaching.businessLessons.map((lesson) => (
              <li key={lesson} className="text-sm text-brand-ink leading-relaxed">
                {lesson}
              </li>
            ))}
          </ul>
        </details>

        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">
            Street glossary
          </summary>
          <div className="grid gap-3 mt-4">
            {coaching.glossary.map((entry) => (
              <article
                key={entry.term}
                className="p-4 rounded-[1.25rem] border border-black/5 bg-white/70"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent mb-2">
                  {entry.term}
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">{entry.definition}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">
            Game context
          </summary>
          <div className="grid gap-3 mt-4">
            {coaching.lifecycle.map((entry) => (
              <article
                key={entry.label}
                className="p-4 rounded-[1.25rem] border border-black/5 bg-white/70"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent mb-2">
                  {entry.label}
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">{entry.detail}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
