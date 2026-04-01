import React from "react";
import { useMonyawn } from "../../../context/MonyawnContext";
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

  if (!selectedOpportunity) return null;

  return (
    <div
      className="cockpit-grid cockpit-grid-premium"
      aria-label="Opportunity cockpit"
      data-testid="desktop-opportunity-cockpit"
    >
      <article className="mini-card cockpit-feature">
        <p className="panel-label">Operational summary</p>
        <h4>
          {selectedCandidateStory ? "Story and evidence are in motion" : "Evidence still needs shaping"}
        </h4>
        <p>
          {selectedCandidateStory
            ? `${selectedCandidateStory.source_artifact_ids.length} artifacts and ${selectedCandidateStory.source_correspondence_ids.length} correspondence records are already backing the narrative for this opportunity.`
            : "Generate a who/what/why/where/when/how story after artifacts and profile corrections are in place so the opportunity reads like a guided operating flow rather than a loose document pile."}
        </p>
        <div className="chip-row">
          <span className="status-chip">artifacts: {opportunityArtifacts.length}</span>
          <span className="status-chip">correspondence: {opportunityCorrespondence.length}</span>
          <span className="status-chip">tasks: {opportunityTasks.length}</span>
        </div>
      </article>
      
      {selectedOpportunity.pathway === "1099" ? (
        <article className="mini-card cockpit-support">
          <p className="panel-label">Commercial Posture</p>
          <h4>
            {selectedCommercialPosture?.target_rate
              ? `${selectedCommercialPosture.engagement_type} - ${selectedCommercialPosture.target_rate}`
              : "Commercial terms not set"}
          </h4>
          <p>
            {selectedCommercialPosture?.sow_status
              ? `SOW Status: ${selectedCommercialPosture.sow_status.replace("_", " ")}`
              : "Draft a Statement of Work and define availability to strengthen readiness."}
          </p>
        </article>
      ) : (
        <article className="mini-card cockpit-support">
          <p className="panel-label">Sensitive support boundary</p>
          <h4>
            {selectedSensitiveSupport?.enabled
              ? `${selectedSensitiveSupport.categories.length} path${selectedSensitiveSupport.categories.length === 1 ? "" : "s"} enabled`
              : "Support path disabled"}
          </h4>
          <p>
            {selectedSensitiveSupport?.enabled
              ? selectedSensitiveSupport.include_in_export
                ? "This opportunity currently allows support-path data into the next export."
                : "Sensitive-support guidance is active but remains local-only unless you turn export inclusion on."
              : "No sensitive support data is being tracked for this opportunity."}
          </p>
        </article>
      )}

      <article className="mini-card cockpit-status">
        <p className="panel-label">Integrity status</p>
        <h4>
          {integrityReport.errors.length
            ? `${integrityReport.errors.length} error${integrityReport.errors.length === 1 ? "" : "s"}`
            : integrityReport.warnings.length
              ? `${integrityReport.warnings.length} warning${integrityReport.warnings.length === 1 ? "" : "s"}`
              : "Clean"}
        </h4>
        <p>
          {lastIntegrityRunAt
            ? `Last checked ${new Date(lastIntegrityRunAt).toLocaleString()}.`
            : "Run an integrity check before major imports or exports."}
        </p>
      </article>
      <article className="mini-card cockpit-status">
        <p className="panel-label">Current stage owner</p>
        <h4>{stageMeta[selectedOpportunity.current_stage].reviewerRole}</h4>
        <p>
          {stageMeta[selectedOpportunity.current_stage].description}
        </p>
      </article>
    </div>
  );
};
