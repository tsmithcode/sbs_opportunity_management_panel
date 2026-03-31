import React from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { PrivacyGuard } from "../../panels/PrivacyGuard/PrivacyGuard";
import { LeverageIndicator } from "../../panels/LeverageIndicator/LeverageIndicator";
import { getMonyawnKicker } from "../../../utils/helpers";

export function WorkspacePage() {
  const { 
    state, 
    patchState, 
    resetSeedState, 
    selectedOpportunity, 
    completionScore,
    notice
  } = useMonyawn();

  const handleExport = () => {
    // I'll need to extract handleExport logic too
  };

  return (
    <main id="main-content" className="workspace">
      <section className="hero hero-wide" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker">{getMonyawnKicker()}</p>
          <h1 id="hero-title">
            Operational cockpit for high-stakes career moves. 🥱
          </h1>
          <p className="hero-text">
            Turn your job search into a governed, evidence-backed workflow. Monyawn helps you develop your story, manage artifacts, and maintain full control of your data.
          </p>
          
          <PrivacyGuard />
          <LeverageIndicator 
            score={completionScore} 
            label={selectedOpportunity?.current_stage || "Next step"} 
            isComplete={completionScore === 100}
          />

          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => {}}>
              Export ZIP handoff package 🥱
            </button>
            <button className="secondary-action" type="button" onClick={resetSeedState}>
              Reset to seeded state
            </button>
          </div>
          
          {notice && (
            <div className={`notice notice-${notice.tone}`} role="status">
              {notice.message}
            </div>
          )}
        </div>
      </section>

      {/* Grid sections will be injected here as sub-components */}
      <div className="workspace-grid-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 2rem 4rem' }}>
        {/* We will build these next */}
      </div>
    </main>
  );
}
