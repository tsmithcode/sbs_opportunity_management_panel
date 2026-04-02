import React, { useRef, useState } from "react";
import { useMonyawn } from "../../../../context/MonyawnContext";
import { useAdminOps } from "../../../../hooks/useAdminOps";
import { useReleaseReviewOps } from "../../../../hooks/useReleaseReviewOps";
import { releaseStatus } from "../../../../releaseStatus";

export const ReleaseControls: React.FC = () => {
  const { state } = useMonyawn();
  const {
    handleReleaseArtifactImport,
    handleReleaseSummaryMarkdownDownload,
    handleReleaseSummaryJsonDownload,
    handleReleaseReadinessPacketExport,
    handleReadinessPacketDownload,
  } = useAdminOps();
  const {
    removeReleaseArtifactReview,
    toggleReleaseArtifactReviewPin,
    clearReleaseArtifactReviewsForCurrentOpportunity,
  } = useReleaseReviewOps();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const filteredReviews = state.releaseArtifactReviews.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.source_name.toLowerCase().includes(query.toLowerCase()) ||
      r.summary.toLowerCase().includes(query.toLowerCase()) ||
      r.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-brand-ink">Launch status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 rounded-2xl bg-white/50 border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Last proof stage</span>
            <p className="text-lg font-bold text-brand-ink">{releaseStatus.lastValidatedPhase}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/50 border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Local checks</span>
            <p className="text-lg font-bold text-brand-ink">{releaseStatus.localChecks.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/50 border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">CI checks</span>
            <p className="text-lg font-bold text-brand-ink">{releaseStatus.ciChecks.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button className="bg-brand-accent text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-accent-strong transition-all active:scale-95" type="button" onClick={() => fileInputRef.current?.click()}>
          Import proof
        </button>
        <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={handleReleaseSummaryMarkdownDownload}>
          Download summary MD
        </button>
        <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={handleReleaseSummaryJsonDownload}>
          Download summary JSON
        </button>
        <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={handleReleaseReadinessPacketExport}>
          Generate share ZIP
        </button>
        <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={handleReadinessPacketDownload}>
          Download share MD
        </button>
      </div>

      <input
        ref={fileInputRef}
        data-testid="release-artifact-input"
        type="file"
        className="hidden"
        accept=".zip,.json,.md"
        onChange={handleReleaseArtifactImport}
      />

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-bold text-brand-ink">Proof history ({state.releaseArtifactReviews.length})</h4>
          <button 
            className="text-xs text-red-600 font-bold hover:underline" 
            onClick={() => clearReleaseArtifactReviewsForCurrentOpportunity(state.selectedAccountId, state.selectedOpportunityId)}
            disabled={state.releaseArtifactReviews.length === 0}
          >
            Clear history
          </button>
        </div>
        <input
          className="w-full px-4 py-2 rounded-xl border border-black/10 bg-white/50 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          placeholder="Search proof..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search proof"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((item) => (
            <article key={item.review_id} className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm relative group" data-testid={`release-review-item-${item.review_id}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-brand-muted">{item.source_name}</span>
                {item.pinned && <span className="px-1.5 py-0.5 rounded bg-brand-accent text-white text-[8px] font-bold uppercase">Pinned</span>}
              </div>
              <h5 className="font-bold text-brand-ink mb-1 truncate">{item.title}</h5>
              <p className="text-xs text-brand-muted line-clamp-2 mb-4">{item.summary}</p>
              <div className="flex gap-2 mt-auto">
                <button className="text-[10px] font-bold text-brand-accent hover:underline" onClick={() => toggleReleaseArtifactReviewPin(item.review_id)}>
                  {item.pinned ? "Unpin" : "Pin"}
                </button>
                <button className="text-[10px] font-bold text-red-600 hover:underline" onClick={() => removeReleaseArtifactReview(item.review_id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
          {!filteredReviews.length && (
            <div className="col-span-full p-8 rounded-2xl bg-black/5 text-center text-sm text-brand-muted border border-dashed border-black/10">
              No matching proof found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
