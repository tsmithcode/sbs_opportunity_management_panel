import React from "react";
import { useMonyawn } from "../../../../context/MonyawnContext";
import { useAdminOps } from "../../../../hooks/useAdminOps";

export const GovernanceAudit: React.FC = () => {
  const { 
    state, 
    opportunityCorrespondence, 
    selectedSensitiveSupport, 
    selectedCandidateStory,
    opportunityTasks,
    opportunityCheckpoints
  } = useMonyawn();
  const { setCorrespondenceStatus } = useAdminOps();

  const blockingTaskCount = opportunityTasks.filter(t => t.blocking && t.status !== "completed").length;
  const currentReviewRequiredCount = opportunityCheckpoints.filter(c => c.human_review_required).length;
  const opportunityEscalations = state.selectedOpportunityId
    ? state.escalations.filter((item) => item.opportunity_id === state.selectedOpportunityId)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
        <h3 className="text-xl font-bold text-brand-ink">Exportable correspondence and audit data</h3>
        <div className="flex flex-col gap-4">
          {opportunityCorrespondence.map((item) => (
            <article key={item.correspondence_id} className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-brand-muted">{item.channel}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${item.status === 'sent' ? 'bg-brand-highlight/30 text-brand-accent' : 'bg-black/5 text-brand-muted'}`}>{item.status}</span>
              </div>
              <h5 className="font-bold text-brand-ink mb-1 truncate">{item.subject || "Untitled correspondence"}</h5>
              <p className="text-xs text-brand-muted line-clamp-2 mb-4">{item.body}</p>
              <div className="flex gap-2">
                <button className="text-[10px] font-bold text-brand-accent hover:underline" onClick={() => setCorrespondenceStatus(item.correspondence_id, "scheduled")}>
                  Mark scheduled
                </button>
              </div>
            </article>
          ))}
          {!opportunityCorrespondence.length && (
            <p className="text-sm text-brand-muted italic text-center p-8 rounded-2xl bg-black/5 border border-dashed border-black/10">No correspondence records for this opportunity. 🥱</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
        <h3 className="text-xl font-bold text-brand-ink">Current opportunity governance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Review controls</span>
            <p className="text-xs text-brand-ink mt-2">
              Human-review-required checkpoints: <strong>{currentReviewRequiredCount}</strong>. Open escalations: <strong>{opportunityEscalations.length}</strong>. Blocking tasks: <strong>{blockingTaskCount}</strong>.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Support boundary</span>
            <p className="text-xs text-brand-ink mt-2">
              {selectedSensitiveSupport?.enabled
                ? selectedSensitiveSupport.include_in_export
                  ? "Sensitive support is enabled and explicitly marked for export."
                  : "Sensitive support is enabled but remains local-only and excluded from export."
                : "No sensitive support profile is active for this opportunity."}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Narrative readiness</span>
            <p className="text-xs text-brand-ink mt-2">
              {selectedCandidateStory
                ? `Candidate story ready with ${selectedCandidateStory.source_artifact_ids.length} linked artifacts.`
                : "Candidate story has not been generated yet."}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Governance outcome</span>
            <ul className="text-[10px] text-brand-muted list-disc pl-4 mt-2 space-y-1">
              <li>CEO direction: enterprise-grade opportunity platform.</li>
              <li>President vote: Platform Ops First.</li>
              <li>Operating model: human-in-the-loop with premium governance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
