import React from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { getCoachingTitle, getCoachingForStage } from "../../../coaching";

export const CoachingSection: React.FC = () => {
  const { selectedOpportunity } = useMonyawn();
  const coaching = getCoachingForStage(selectedOpportunity?.current_stage ?? "intake_started");

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-9 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Optional support</p>
        <h3 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink">Optional stage coaching</h3>
      </div>
      <p className="text-sm text-brand-muted leading-relaxed">
        This support stays inside the current workflow step, stays hidden
        until opened, and can be skipped completely.
      </p>
      <div className="space-y-4">
        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">{getCoachingTitle(selectedOpportunity?.current_stage ?? "intake_started")}</summary>
          <p className="text-sm text-brand-muted leading-relaxed mt-4">{coaching.intro}</p>
          <ul className="mt-4 space-y-2">
            {coaching.businessLessons.map((lesson) => (
              <li key={lesson} className="text-sm text-brand-ink leading-relaxed">{lesson}</li>
            ))}
          </ul>
        </details>

        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Glossary for this stage</summary>
          <div className="grid gap-3 mt-4">
            {coaching.glossary.map((entry) => (
              <article key={entry.term} className="p-4 rounded-[1.25rem] border border-black/5 bg-white/70">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent mb-2">{entry.term}</p>
                <p className="text-sm text-brand-muted leading-relaxed">{entry.definition}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="rounded-[1.5rem] border border-black/10 bg-brand-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Business lifecycle context</summary>
          <div className="grid gap-3 mt-4">
            {coaching.lifecycle.map((entry) => (
              <article key={entry.label} className="p-4 rounded-[1.25rem] border border-black/5 bg-white/70">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent mb-2">{entry.label}</p>
                <p className="text-sm text-brand-muted leading-relaxed">{entry.detail}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
