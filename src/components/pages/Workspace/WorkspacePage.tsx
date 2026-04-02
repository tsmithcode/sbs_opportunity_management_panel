import { useState } from "react";
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
import { AdminOverview } from "./sections/AdminOverview";
import { ReleaseControls } from "./sections/ReleaseControls";
import { EnterpriseControls } from "./sections/EnterpriseControls";
import { GovernanceAudit } from "./sections/GovernanceAudit";
import { useDataTransformOps } from "../../../hooks/useDataTransformOps";
import { useOpportunityOps } from "../../../hooks/useOpportunityOps";
import { isClosedStage } from "../../../workflow";
import { createSeedState } from "../../../seed";
import { stageMeta } from "../../../workflow/constants";

type WorkspaceStep = "artifacts" | "profile" | "correspondence" | "posture" | "coaching";

type StepGuide = {
  title: string;
  description: string;
  successSignal: string;
  checklist: string[];
};

const baseStepGuides: Record<Exclude<WorkspaceStep, "posture">, StepGuide> = {
  artifacts: {
    title: "Build the evidence base",
    description: "Start with the strongest proof first so every later decision has something concrete to work from.",
    successSignal: "At least one core document is recorded and clearly labeled.",
    checklist: [
      "Add the resume or job description before anything else.",
      "Name the artifact so you can recognize it later without opening it.",
      "Use the evidence note to explain why this record matters.",
    ],
  },
  profile: {
    title: "Correct the candidate record",
    description: "Turn rough extraction into an accurate operating profile the rest of the workflow can trust.",
    successSignal: "Skills, experience, strengths, and gaps read like a fair summary of you.",
    checklist: [
      "Keep the skills summary specific to this opportunity.",
      "State seniority in plain language rather than inflated titles.",
      "List gaps honestly so positioning work can compensate for them later.",
    ],
  },
  correspondence: {
    title: "Prepare controlled outreach",
    description: "Draft messages and notes with enough context that they can be reviewed before they leave the workspace.",
    successSignal: "A draft exists for the next conversation you expect to have.",
    checklist: [
      "Choose the right channel first so tone matches the situation.",
      "Use the subject to make the purpose obvious at a glance.",
      "Capture internal notes here too if they affect timing or follow-up.",
    ],
  },
  coaching: {
    title: "Absorb guidance without blocking momentum",
    description: "Coaching should sharpen the next move, not create another mandatory data-entry task.",
    successSignal: "You can explain the next step and the business context behind it.",
    checklist: [
      "Open only the guidance that helps the current stage.",
      "Use glossary and lifecycle context to reduce ambiguity.",
      "Move back into execution once the next action is clear.",
    ],
  },
};

export function WorkspacePage() {
  const { 
    state, 
    selectedOpportunity, 
    selectedProfile,
    selectedCommercialPosture,
    selectedCandidateStory,
    selectedSensitiveSupport,
    opportunityArtifacts,
    opportunityTasks,
    opportunityCheckpoints,
    opportunityCorrespondence,
    completionScore,
    notice,
    setCurrentPage,
    patchState
  } = useMonyawn();

  const [activeStep, setActiveStep] = useState<WorkspaceStep>("artifacts");

  const { handleExport, handleImport, resetSeedState } = useDataTransformOps();
  const { handleAdvanceStage, handleCloseLost } = useOpportunityOps();

  if (!selectedOpportunity) {
    return (
      <main id="main-content" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-12 w-full min-h-screen">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16" aria-labelledby="hero-title">
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">No Active Opportunity</p>
            <h1 id="hero-title" className="text-4xl md:text-5xl font-extrabold text-brand-ink leading-[1.15]">
              Ready to start your next pursuit? 🥱
            </h1>
            <p className="text-lg text-brand-muted leading-relaxed max-w-2xl">
              You haven't selected an opportunity yet. You can start a new intake flow, restore from a previous ZIP export, or load the seeded demo data to explore the platform.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-brand-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95" type="button" onClick={() => { window.location.hash = "intake"; setCurrentPage("intake"); }}>
                Start new intake 🥱
              </button>
              <label className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95 cursor-pointer inline-flex items-center">
                Restore from ZIP
                <input type="file" accept=".zip" className="hidden" onChange={handleImport} />
              </label>
              <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => patchState(() => createSeedState(), "Demo data loaded.")}>
                Load demo data
              </button>
            </div>

            {notice && (
              <div className={`p-4 rounded-xl text-sm font-medium border mt-8 ${notice.tone === 'success' ? 'bg-brand-highlight/20 border-brand-accent/20 text-brand-accent' : 'bg-red-50 border-red-100 text-red-600'}`} role="status">
                {notice.message}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  const steps: { id: WorkspaceStep; label: string }[] = [
    { id: "artifacts", label: "1. Artifacts" },
    { id: "profile", label: "2. Profile" },
    { id: "correspondence", label: "3. Messages" },
    { id: "posture", label: selectedOpportunity.pathway === "1099" ? "4. Commercial" : "4. Support" },
    { id: "coaching", label: "5. Coaching" },
  ];

  const stepGuides: Record<WorkspaceStep, StepGuide> = {
    ...baseStepGuides,
    posture:
      selectedOpportunity.pathway === "1099"
        ? {
            title: "Define the deal before the rush",
            description: "Use the posture step to pin down commercial terms while the opportunity is still moving.",
            successSignal: "Rate, engagement shape, and SOW posture are explicit enough to negotiate from.",
            checklist: [
              "Set a target rate or project budget you can defend.",
              "Choose the engagement model that matches the work.",
              "Track scope and SOW risk before discussions intensify.",
            ],
          }
        : {
            title: "Capture optional support privately",
            description: "Keep any sensitive planning local-only and separate from the normal export path unless you choose otherwise.",
            successSignal: "Your support plan helps you move calmly without oversharing.",
            checklist: [
              "Only enable support guidance if it helps this opportunity.",
              "Record practical next steps instead of writing a diary entry.",
              "Leave export disabled unless the handoff truly needs this context.",
            ],
          },
  };

  const activeStepIndex = steps.findIndex((step) => step.id === activeStep);
  const activeGuide = stepGuides[activeStep];
  const activeStageMeta = stageMeta[selectedOpportunity.current_stage];
  const blockingTasks = opportunityTasks.filter((task) => task.blocking && task.status !== "completed").length;
  const recentItems =
    activeStep === "artifacts"
      ? opportunityArtifacts.slice(0, 3).map((artifact) => artifact.source_label)
      : activeStep === "profile"
        ? [
            selectedProfile?.skills_summary,
            selectedProfile?.domain_strengths,
            selectedProfile?.declared_gaps,
          ].filter(Boolean) as string[]
        : activeStep === "correspondence"
          ? opportunityCorrespondence.slice(0, 3).map((item) => item.subject || `${item.channel} draft`)
          : activeStep === "posture"
            ? selectedOpportunity.pathway === "1099"
              ? [
                  selectedCommercialPosture?.target_rate,
                  selectedCommercialPosture?.availability,
                  selectedCommercialPosture?.notes,
                ].filter(Boolean) as string[]
              : [
                  selectedSensitiveSupport?.encouragement_plan,
                  selectedSensitiveSupport?.notes,
                  selectedSensitiveSupport?.categories.join(", "),
                ].filter(Boolean) as string[]
            : selectedCandidateStory
              ? [selectedCandidateStory.title, selectedCandidateStory.summary, selectedCandidateStory.markdown]
                  .filter(Boolean)
                  .slice(0, 3)
              : [];
  const nextStep = steps[activeStepIndex + 1];
  const nextStepLabel = nextStep ? nextStep.label.replace(/^\d+\.\s*/, "") : "Review and advance the opportunity stage";
  const userWorkspaceContent = (
    <div className="space-y-8">
      <nav className="flex flex-wrap gap-2 border-b border-black/5 pb-4">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeStep === step.id
                ? "bg-brand-accent text-white shadow-sm"
                : "bg-brand-surface border border-black/5 text-brand-muted hover:bg-black/5"
            }`}
          >
            {step.label}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)] gap-8 items-start">
        <div className="space-y-6">
          {activeStep === "artifacts" && (
            <div className="space-y-6">
              <ArtifactForm />
              <div className="flex justify-end">
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("profile")}
                >
                  Next: Profile Confirmation 🥱
                </button>
              </div>
            </div>
          )}

          {activeStep === "profile" && (
            <div className="space-y-6">
              <ProfileForm />
              <div className="flex justify-between">
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("artifacts")}
                >
                  Back
                </button>
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("correspondence")}
                >
                  Next: Correspondence 🥱
                </button>
              </div>
            </div>
          )}

          {activeStep === "correspondence" && (
            <div className="space-y-6">
              <CorrespondenceForm />
              <div className="flex justify-between">
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("profile")}
                >
                  Back
                </button>
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("posture")}
                >
                  Next: {selectedOpportunity.pathway === "1099" ? "Commercial Posture" : "Sensitive Support"} 🥱
                </button>
              </div>
            </div>
          )}

          {activeStep === "posture" && (
            <div className="space-y-6">
              {selectedOpportunity.pathway === "1099" ? <CommercialPostureForm /> : <SensitiveSupportForm />}
              <div className="flex justify-between">
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("correspondence")}
                >
                  Back
                </button>
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("coaching")}
                >
                  Next: Optional Coaching 🥱
                </button>
              </div>
            </div>
          )}

          {activeStep === "coaching" && (
            <div className="space-y-6">
              <CoachingSection />
              <div className="flex justify-start">
                <button
                  className="bg-brand-surface border border-black/10 text-brand-ink px-8 py-3 rounded-xl font-bold hover:bg-black/5 transition-all active:scale-95 shadow-sm"
                  onClick={() => setActiveStep("posture")}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="p-6 rounded-3xl border border-brand-highlight/30 bg-gradient-to-br from-white via-brand-surface to-brand-highlight/10 shadow-brand-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Golden Path</p>
            <h3 className="text-2xl font-bold text-brand-ink mt-3">{activeGuide.title}</h3>
            <p className="text-sm text-brand-muted leading-relaxed mt-2">{activeGuide.description}</p>
            <div className="mt-5 p-4 rounded-2xl bg-brand-highlight/20 border border-brand-highlight/30">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">Success signal</p>
              <p className="text-sm text-brand-ink mt-2">{activeGuide.successSignal}</p>
            </div>
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">How to use this step</p>
              <ul className="mt-3 space-y-3">
                {activeGuide.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-brand-ink leading-relaxed">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-accent flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-white/60 border border-black/5 shadow-brand-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Opportunity status</p>
                <h3 className="text-xl font-bold text-brand-ink mt-2">{selectedOpportunity.company_name}</h3>
                <p className="text-sm text-brand-muted">{selectedOpportunity.role_title}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand-highlight/30 text-brand-accent text-xs font-bold border border-brand-highlight/40">
                {completionScore}% ready
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="p-3 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Stage</p>
                <p className="text-sm font-semibold text-brand-ink mt-2">{activeStageMeta.label}</p>
              </div>
              <div className="p-3 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Reviewer</p>
                <p className="text-sm font-semibold text-brand-ink mt-2">{activeStageMeta.reviewerRole}</p>
              </div>
              <div className="p-3 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Artifacts</p>
                <p className="text-sm font-semibold text-brand-ink mt-2">{opportunityArtifacts.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Messages</p>
                <p className="text-sm font-semibold text-brand-ink mt-2">{opportunityCorrespondence.length}</p>
              </div>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed mt-5">{activeStageMeta.description}</p>
          </section>

          <section className="p-6 rounded-3xl bg-white/60 border border-black/5 shadow-brand-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Step progress</p>
            <div className="mt-4 space-y-3">
              {steps.map((step, index) => {
                const status =
                  index < activeStepIndex ? "done" : index === activeStepIndex ? "current" : "upcoming";

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
                      status === "current"
                        ? "border-brand-accent/30 bg-brand-highlight/20"
                        : "border-black/5 bg-brand-surface"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">{step.label}</p>
                      <p className="text-xs text-brand-muted">
                        {status === "done" ? "Completed or reviewed" : status === "current" ? "Active now" : "Up next"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                        status === "current"
                          ? "text-brand-accent"
                          : status === "done"
                            ? "text-brand-ink"
                            : "text-brand-muted"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-white/60 border border-black/5 shadow-brand-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">What to watch</p>
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">Live counts</p>
                <p className="text-sm text-brand-ink mt-2">
                  {blockingTasks} blocking task{blockingTasks === 1 ? "" : "s"} and {opportunityCheckpoints.length} checkpoint{opportunityCheckpoints.length === 1 ? "" : "s"} are attached to this opportunity.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">Recent signal</p>
                {recentItems.length ? (
                  <ul className="mt-2 space-y-2">
                    {recentItems.slice(0, 3).map((item) => (
                      <li key={item} className="text-sm text-brand-ink leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-brand-muted mt-2">
                    This step does not have saved data yet. Use the form on the left to create the first record.
                  </p>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-brand-surface border border-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">Next move</p>
                <p className="text-sm text-brand-ink mt-2">
                  {nextStep
                    ? `Once this step is in good shape, move to ${nextStepLabel}.`
                    : "Once this review is complete, use the stage controls above to move the opportunity forward."}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );

  return (
    <main id="main-content" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-12 w-full min-h-screen">
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)] gap-8 xl:gap-10 items-start mb-12 lg:mb-14" aria-labelledby="hero-title">
        <div className="flex flex-col gap-6 w-full">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
            {state.currentMode === "user" ? `Step: ${activeStep.toUpperCase()} 🥱` : getMonyawnKicker()}
          </p>
          <h1 id="hero-title" className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.35rem] font-extrabold text-brand-ink leading-[0.98] tracking-[-0.04em]">
            Operational cockpit for high-stakes career moves.
          </h1>
          <p className="text-base lg:text-lg text-brand-muted leading-relaxed max-w-[68ch]">
            Turn your job search into a governed, evidence-backed workflow. Monyawn helps you develop your story, manage artifacts, and maintain full control of your data.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button className="bg-brand-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95" type="button" onClick={handleAdvanceStage}>
              Advance to next stage 🥱
            </button>
            <button 
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
              type="button" 
              onClick={handleCloseLost}
              disabled={!selectedOpportunity || isClosedStage(selectedOpportunity.current_stage)}
            >
              Close as lost
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={handleExport}>
              Export ZIP handoff package 🥱
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={resetSeedState}>
              Reset seeded state
            </button>
          </div>

          {notice && (
            <div className={`p-4 rounded-xl text-sm font-medium border mt-4 ${notice.tone === 'success' ? 'bg-brand-highlight/20 border-brand-accent/20 text-brand-accent' : 'bg-red-50 border-red-100 text-red-600'}`} role="status">
              {notice.message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:sticky xl:top-24">
          <PrivacyGuard />
          <LeverageIndicator 
            score={completionScore} 
            label={selectedOpportunity?.current_stage || "Next step"} 
            isComplete={completionScore === 100}
          />
        </div>
      </section>

      <div className="flex flex-col gap-12 pb-24">
        <OpportunityCockpit />

        {state.currentMode === "user" && userWorkspaceContent}

        {state.currentMode === "admin" && (
          <div className="flex flex-col gap-12">
            <AdminOverview />
            <ReleaseControls />
            <EnterpriseControls />
            <GovernanceAudit />
          </div>
        )}
      </div>
    </main>
  );
}
