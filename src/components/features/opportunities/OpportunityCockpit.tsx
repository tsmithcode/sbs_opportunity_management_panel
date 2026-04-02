import React from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
import { useCandidateStoryOps } from "../../../hooks/useCandidateStoryOps";
import { stageMeta } from "../../../workflow";

export const OpportunityCockpit: React.FC = () => {
  const { 
    selectedOpportunity, 
    selectedCandidateStory, 
    opportunityArtifacts, 
    opportunityCorrespondence, 
    opportunityTasks,
    selectedSensitiveSupport,
    selectedCommercialPosture,
    integrityReport,
    lastIntegrityRunAt
  } = useMonyawn();

  const { handleGenerateCandidateStory } = useCandidateStoryOps();

  if (!selectedOpportunity) return null;

  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,0.78fr))] gap-4 lg:gap-5"
      aria-label="Opportunity cockpit"
      data-testid="desktop-opportunity-cockpit"
    >
      <article className="bg-white/60 border border-black/5 rounded-[1.75rem] p-5 lg:p-6 shadow-brand-shadow flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Operational summary</p>
            <h4 className="text-xl font-semibold text-brand-ink leading-tight tracking-[-0.03em] mt-2">
              {selectedCandidateStory ? "Story and evidence are in motion" : "Evidence still needs shaping"}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold tracking-[0.14em] border border-brand-accent/10">
            {stageMeta[selectedOpportunity.current_stage].label}
          </span>
        </div>
        <p className="text-sm text-brand-muted leading-relaxed">
          {selectedCandidateStory ? "Story and evidence are in motion" : "Evidence still needs shaping"}
        </p>
        <p className="text-sm text-brand-muted leading-relaxed">
          {selectedCandidateStory
            ? `${selectedCandidateStory.source_artifact_ids.length} artifacts and ${selectedCandidateStory.source_correspondence_ids.length} correspondence records are already backing the narrative for this opportunity.`
            : "Generate a structured story once the artifacts and profile corrections are in place so the pursuit reads like an operating flow rather than a document pile."}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Artifacts</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityArtifacts.length}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Messages</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityCorrespondence.length}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Tasks</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityTasks.length}</p>
          </div>
        </div>
        <button 
          className="bg-brand-accent text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95 self-start mt-1"
          onClick={handleGenerateCandidateStory}
        >
          Generate story
        </button>
      </article>
      
      {selectedOpportunity.pathway === "1099" ? (
        <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Commercial posture</p>
          <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">
            {selectedCommercialPosture?.target_rate
              ? `${selectedCommercialPosture.engagement_type} - ${selectedCommercialPosture.target_rate}`
              : "Commercial terms not set"}
          </h4>
          <p className="text-sm text-brand-muted leading-relaxed">
            {selectedCommercialPosture?.sow_status
              ? `SOW Status: ${selectedCommercialPosture.sow_status.replace("_", " ")}`
              : "Draft a Statement of Work and define availability to strengthen readiness."}
          </p>
          <p className="text-xs text-brand-muted mt-auto">{selectedCommercialPosture?.availability || "Availability is not captured yet."}</p>
        </article>
      ) : (
        <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Sensitive support boundary</p>
          <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">
            {selectedSensitiveSupport?.enabled
              ? `${selectedSensitiveSupport.categories.length} path${selectedSensitiveSupport.categories.length === 1 ? "" : "s"} enabled`
              : "Support path disabled"}
          </h4>
          <p className="text-sm text-brand-muted leading-relaxed">
            {selectedSensitiveSupport?.enabled
              ? selectedSensitiveSupport.include_in_export
                ? "This opportunity currently allows support-path data into the next export."
                : "Sensitive-support guidance is active but remains local-only unless you turn export inclusion on."
              : "No sensitive support data is being tracked for this opportunity."}
          </p>
          <p className="text-xs text-brand-muted mt-auto">{selectedSensitiveSupport?.categories.join(", ") || "No categories selected."}</p>
        </article>
      )}

      <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Integrity status</p>
        <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">
          {integrityReport.errors.length
            ? `${integrityReport.errors.length} error${integrityReport.errors.length === 1 ? "" : "s"}`
            : integrityReport.warnings.length
              ? `${integrityReport.warnings.length} warning${integrityReport.warnings.length === 1 ? "" : "s"}`
              : "Clean"}
        </h4>
        <p className="text-sm text-brand-muted leading-relaxed">
          {lastIntegrityRunAt
            ? `Last checked ${new Date(lastIntegrityRunAt).toLocaleString()}.`
            : "Run an integrity check before major imports or exports."}
        </p>
      </article>
      <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Current stage owner</p>
        <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">{stageMeta[selectedOpportunity.current_stage].reviewerRole}</h4>
        <p className="text-sm text-brand-muted leading-relaxed">
          {stageMeta[selectedOpportunity.current_stage].description}
        </p>
      </article>
    </div>
  );
};
