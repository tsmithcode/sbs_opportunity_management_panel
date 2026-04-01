import { useMonyawn } from "../../../context/MonyawnContext";
import { PrivacyGuard } from "../../panels/PrivacyGuard/PrivacyGuard";
import { LeverageIndicator } from "../../panels/LeverageIndicator/LeverageIndicator";
import { getMonyawnKicker } from "../../../utils/helpers";
import { OpportunityCockpit } from "../../features/opportunities/OpportunityCockpit";
import { ArtifactForm } from "../../features/artifacts/ArtifactForm";
import { ProfileForm } from "../../features/profile/ProfileForm";
import { CorrespondenceForm } from "../../features/correspondence/CorrespondenceForm";
import { CoachingSection } from "../../features/opportunities/CoachingSection";
import { SensitiveSupportForm } from "../../features/opportunities/SensitiveSupportForm";
import { CommercialPostureForm } from "../../features/opportunities/CommercialPostureForm";
import { useDataTransformOps } from "../../../hooks/useDataTransformOps";
import { useOpportunityOps } from "../../../hooks/useOpportunityOps";
import { isClosedStage } from "../../../workflow";
import { createSeedState } from "../../../seed";

export function WorkspacePage() {
  const { 
    state, 
    selectedOpportunity, 
    completionScore,
    notice,
    setCurrentPage,
    patchState
  } = useMonyawn();

  const { handleExport, handleImport, resetSeedState } = useDataTransformOps();
  const { handleAdvanceStage, handleCloseLost } = useOpportunityOps();

  if (!selectedOpportunity) {
    return (
      <main id="main-content" className="workspace">
        <section className="hero hero-wide" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">No Active Opportunity</p>
            <h1 id="hero-title">
              Ready to start your next pursuit? 🥱
            </h1>
            <p className="hero-text">
              You haven't selected an opportunity yet. You can start a new intake flow, restore from a previous ZIP export, or load the seeded demo data to explore the platform.
            </p>

            <div className="hero-actions" style={{ marginTop: '2rem' }}>
              <button className="primary-action" type="button" onClick={() => { window.location.hash = "intake"; setCurrentPage("intake"); }}>
                Start new intake 🥱
              </button>
              <label className="secondary-action" style={{ cursor: 'pointer' }}>
                Restore from ZIP
                <input type="file" accept=".zip" style={{ display: 'none' }} onChange={handleImport} />
              </label>
              <button className="secondary-action" type="button" onClick={() => patchState(() => createSeedState(), "Demo data loaded.")}>
                Load demo data
              </button>
            </div>

            {notice && (
              <div className={`notice notice-${notice.tone}`} role="status" style={{ marginTop: '2rem' }}>
                {notice.message}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

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
            <button className="primary-action" type="button" onClick={handleAdvanceStage}>
              Advance to next stage 🥱
            </button>
            <button 
              className="secondary-action" 
              type="button" 
              onClick={handleCloseLost}
              disabled={!selectedOpportunity || isClosedStage(selectedOpportunity.current_stage)}
            >
              Close as lost
            </button>
            <button className="secondary-action" type="button" onClick={handleExport}>
              Export ZIP handoff package 🥱
            </button>
            <button className="secondary-action" type="button" onClick={resetSeedState}>
              Reset seeded state
            </button>
          </div>
          
          {notice && (
            <div className={`notice notice-${notice.tone}`} role="status">
              {notice.message}
            </div>
          )}
        </div>
      </section>

      <div className="workspace-grid-container" style={{ padding: '0 2rem 4rem' }}>
        <OpportunityCockpit />

        {state.currentMode === "user" && (
          <>
            <section className="record-grid" style={{ marginTop: '2rem' }}>
              <ArtifactForm />
              <ProfileForm />
              <CorrespondenceForm />
            </section>

            <section className="record-grid" style={{ marginTop: '2rem' }}>
              <CoachingSection />
              {selectedOpportunity.pathway === "1099" ? (
                <CommercialPostureForm />
              ) : (
                <SensitiveSupportForm />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}