import { useMonyawn } from "../context/MonyawnContext";
import { createEscalation, createTask } from "../workflow";
import { EscalationDraft } from "../context/MonyawnContext.types";

export function useEscalationOps() {
  const { patchState, selectedOpportunity, setNotice } = useMonyawn();

  const handleEscalationSubmit = (draft: EscalationDraft) => {
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before escalating." });
      return;
    }

    const escalation = createEscalation(
      selectedOpportunity.opportunity_id,
      draft.escalation_type,
      draft.owner_role,
      draft.severity,
      draft.resolution_notes,
    );
    
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Resolve ${draft.escalation_type} escalation`,
      draft.owner_role,
      true,
    );

    patchState(
      (current) => ({
        ...current,
        escalations: [escalation, ...current.escalations],
        tasks: [task, ...current.tasks],
      }),
      "Escalation routed to the assigned functional owner.",
    );
    
    return escalation;
  };

  const resolveEscalation = (escalationId: string) => {
    patchState(
      (current) => ({
        ...current,
        escalations: current.escalations.map((e) =>
          e.escalation_id === escalationId ? { ...e, status: "resolved", updated_at: new Date().toISOString() } : e
        ),
      }),
      "Escalation resolved.",
    );
  };

  return {
    handleEscalationSubmit,
    resolveEscalation,
  };
}
