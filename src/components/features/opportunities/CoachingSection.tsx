import React from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { getCoachingTitle, getCoachingForStage } from "../../../coaching";

export const CoachingSection: React.FC = () => {
  const { selectedOpportunity } = useMonyawn();
  const coaching = getCoachingForStage(selectedOpportunity?.current_stage ?? "intake_started");

  return (
    <div className="stage-block coaching-block">
      <h3>Optional stage coaching</h3>
      <p>
        This support stays inside the current workflow step, stays hidden
        until opened, and can be skipped completely.
      </p>
      <div className="coaching-stack">
        <details className="coaching-panel">
          <summary>{getCoachingTitle(selectedOpportunity?.current_stage ?? "intake_started")}</summary>
          <p>{coaching.intro}</p>
          <ul className="plain-list">
            {coaching.businessLessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </details>

        <details className="coaching-panel">
          <summary>Glossary for this stage</summary>
          <div className="stack-list">
            {coaching.glossary.map((entry) => (
              <article key={entry.term} className="mini-card">
                <p className="panel-label">{entry.term}</p>
                <p>{entry.definition}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="coaching-panel">
          <summary>Business lifecycle context</summary>
          <div className="stack-list">
            {coaching.lifecycle.map((entry) => (
              <article key={entry.label} className="mini-card">
                <p className="panel-label">{entry.label}</p>
                <p>{entry.detail}</p>
              </article>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
