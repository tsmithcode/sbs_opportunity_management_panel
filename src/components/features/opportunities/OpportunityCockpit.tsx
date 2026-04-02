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
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Play summary</p>
            <h4 className="text-xl font-semibold text-brand-ink leading-tight tracking-[-0.03em] mt-2">
              {selectedCandidateStory ? "Story + proof are moving" : "Proof still needs shaping"}
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold tracking-[0.14em] border border-brand-accent/10">
            {stageMeta[selectedOpportunity.current_stage].label}
          </span>
        </div>
        <p className="text-sm text-brand-muted leading-relaxed">
          {selectedCandidateStory ? "Story + proof are moving" : "Proof still needs shaping"}
        </p>
        <p className="text-sm text-brand-muted leading-relaxed">
          {selectedCandidateStory
            ? `${selectedCandidateStory.source_artifact_ids.length} proof drops and ${selectedCandidateStory.source_correspondence_ids.length} messages already back this play.`
            : "Generate the story once proof + profile are clean so the play reads sharp, not messy."}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Proof</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityArtifacts.length}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">DMs</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityCorrespondence.length}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-brand-surface p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Moves</p>
            <p className="text-lg font-bold text-brand-ink mt-2">{opportunityTasks.length}</p>
          </div>
        </div>
        <button 
          className="bg-brand-accent text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95 self-start mt-1"
          onClick={handleGenerateCandidateStory}
        >
          Drop the story
        </button>
      </article>
      
      {selectedOpportunity.pathway === "1099" ? (
        <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Money talk</p>
          <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">
            {selectedCommercialPosture?.target_rate
              ? `${selectedCommercialPosture.engagement_type} - ${selectedCommercialPosture.target_rate}`
              : "Money terms not set"}
          </h4>
          <p className="text-sm text-brand-muted leading-relaxed">
            {selectedCommercialPosture?.sow_status
              ? `SOW Status: ${selectedCommercialPosture.sow_status.replace("_", " ")}`
              : "Draft the scope and set availability to tighten the deal."}
          </p>
          <p className="text-xs text-brand-muted mt-auto">{selectedCommercialPosture?.availability || "Availability not set yet."}</p>
        </article>
      ) : (
        <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Real life zone</p>
          <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">
            {selectedSensitiveSupport?.enabled
              ? `${selectedSensitiveSupport.categories.length} path${selectedSensitiveSupport.categories.length === 1 ? "" : "s"} enabled`
              : "Support off"}
          </h4>
          <p className="text-sm text-brand-muted leading-relaxed">
            {selectedSensitiveSupport?.enabled
              ? selectedSensitiveSupport.include_in_export
                ? "Support notes will go out in the next export."
                : "Support notes are local-only unless you flip export on."
              : "No support notes on this play."}
          </p>
          <p className="text-xs text-brand-muted mt-auto">{selectedSensitiveSupport?.categories.join(", ") || "No categories yet."}</p>
        </article>
      )}

      <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Health check</p>
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
            : "Run a check before big imports or exports."}
        </p>
      </article>
      <article className="bg-white/55 border border-black/5 rounded-[1.75rem] p-5 shadow-brand-shadow flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Stage lead</p>
        <h4 className="text-lg font-semibold text-brand-ink leading-tight tracking-[-0.03em]">{stageMeta[selectedOpportunity.current_stage].reviewerRole}</h4>
        <p className="text-sm text-brand-muted leading-relaxed">
          {stageMeta[selectedOpportunity.current_stage].description}
        </p>
      </article>
    </div>
  );
};
