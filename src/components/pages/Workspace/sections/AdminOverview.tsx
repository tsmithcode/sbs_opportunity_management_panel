import React from "react";
import { useMonyawn } from "../../../../context/MonyawnContext";
import { useAdminOps } from "../../../../hooks/useAdminOps";
import { useDataTransformOps } from "../../../../hooks/useDataTransformOps";
import { apiSurface } from "../../../../workflow";
import { AiSettingsPanel } from "../../../panels/AiSettingsPanel/AiSettingsPanel";

export const AdminOverview: React.FC = () => {
  const { state, patchState, integrityReport, lastIntegrityRunAt } = useMonyawn();
  const { handleIntegrityCheck } = useAdminOps();
  const { handleBuyerPacketExport } = useDataTransformOps();

  const reportingSnapshot = state.reportingSnapshots[0] || {
    intake_completion_rate: 0,
    fit_review_completion_rate: 0,
    approval_rate: 0,
    escalation_rate: 0,
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/40 border border-black/5 shadow-brand-shadow">
          <div>
            <h3 className="text-xl font-bold text-brand-ink mb-1">What’s in the export</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "session.json",
                "manifest.json",
                "lifecycle markdown",
                "candidate story markdown/pdf",
                "correspondence markdown/pdf",
                "memo markdown/pdf",
                "session summary pdf",
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-2 py-0.5 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold border border-brand-accent/10"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="text-sm text-brand-muted mt-4">
              JSON restores the full state. Markdown/PDF are for sharing and review.
            </p>
          </div>
          <div className="flex gap-4 mt-auto">
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={handleIntegrityCheck}
            >
              Run health check
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={handleBuyerPacketExport}
            >
              Generate share ZIP
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
          <div>
            <h3 className="text-xl font-bold text-brand-ink mb-1">Data surface</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {apiSurface.map((resource) => (
                <span
                  key={resource}
                  className="px-2 py-0.5 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold border border-brand-accent/10"
                >
                  {resource}
                </span>
              ))}
            </div>
            <p className="text-sm text-brand-muted mt-4">
              These are the records we track and export in the local ZIP.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
          <div>
            <h3 className="text-xl font-bold text-brand-ink mb-1">Health summary</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  Errors
                </span>
                <p className="text-2xl font-bold text-red-600">{integrityReport.errors.length}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  Warnings
                </span>
                <p className="text-2xl font-bold text-brand-review">
                  {integrityReport.warnings.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 max-h-32 overflow-y-auto pr-2">
              {integrityReport.errors.length ? (
                integrityReport.errors.map((item) => (
                  <article
                    key={item}
                    className="p-3 rounded-lg bg-red-50 border border-red-100 text-[10px] text-red-600"
                  >
                    <p className="font-bold uppercase tracking-tighter mb-1">Error</p>
                    <p>{item}</p>
                  </article>
                ))
              ) : (
                <article className="p-3 rounded-lg bg-black/5 text-[10px] text-brand-muted">
                  <p className="font-bold uppercase tracking-tighter mb-1">Errors</p>
                  <p>No structural errors found.</p>
                </article>
              )}
              {integrityReport.warnings.slice(0, 3).map((item) => (
                <article
                  key={item}
                  className="p-3 rounded-lg bg-brand-review/10 border border-brand-review/20 text-[10px] text-brand-ink"
                >
                  <p className="font-bold uppercase tracking-tighter mb-1 text-brand-review">
                    Warning
                  </p>
                  <p>{item}</p>
                </article>
              ))}
            </div>
            <p className="text-[10px] text-brand-muted mt-4 italic">
              {lastIntegrityRunAt
                ? `Last integrity run: ${new Date(lastIntegrityRunAt).toLocaleString()}.`
                : "Checks run automatically during import/export."}
            </p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 p-8 rounded-3xl bg-brand-surface-soft border border-black/5 shadow-brand-shadow">
          <h3 className="text-xl font-bold text-brand-ink mb-6">Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Setup done
              </span>
              <p className="text-3xl font-bold text-brand-accent">
                {Math.round(reportingSnapshot.intake_completion_rate * 100)}%
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Fit check done
              </span>
              <p className="text-3xl font-bold text-brand-accent">
                {Math.round(reportingSnapshot.fit_review_completion_rate * 100)}%
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Approval rate
              </span>
              <p className="text-3xl font-bold text-brand-accent">
                {Math.round(reportingSnapshot.approval_rate * 100)}%
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Escalations
              </span>
              <p className="text-3xl font-bold text-brand-accent">
                {Math.round(reportingSnapshot.escalation_rate * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <AiSettingsPanel
          settings={state.aiSettings}
          onSettingsChange={(settings) =>
            patchState((s) => ({ ...s, aiSettings: settings }), "AI settings updated.")
          }
        />
      </div>
    </div>
  );
};
