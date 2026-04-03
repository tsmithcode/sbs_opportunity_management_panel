import { useMonyawn } from "../context/MonyawnContext";
import {
  createOpportunity,
  createCheckpoint,
  createTask,
  createStageEvent,
  createMemo,
  getNextStage,
  nowIso,
  isClosedStage,
  stageMeta,
} from "../workflow";
import { OpportunityStatus } from "../types";
import { createSeedState } from "../seed";
import { OpportunityDraft } from "../context/MonyawnContext.types";

export function useOpportunityOps() {
  const { state, patchState, selectedOpportunity, setNotice } = useMonyawn();

  const handleOpportunitySubmit = (draft: OpportunityDraft) => {
    if (!state.selectedAccountId || !state.selectedUserId) {
      setNotice({
        tone: "info",
        message: "Set the active account and user before starting an opportunity.",
      });
      return;
    }

    const opportunity = createOpportunity({
      account_id: state.selectedAccountId,
      user_id: state.selectedUserId,
      use_case_id: "monyawn",
      ...draft,
    });

    const profile = {
      ...createSeedState().candidateProfiles[0],
      profile_id: `profile_${opportunity.opportunity_id}`,
      user_id: state.selectedUserId,
      opportunity_id: opportunity.opportunity_id,
      skills_summary: "",
      experience_level: "",
      domain_strengths: "",
      declared_gaps: "",
      user_corrected: false,
      updated_at: nowIso(),
    };

    const checkpoint = createCheckpoint(
      opportunity,
      "Opportunity created",
      "Start end-to-end onboarding",
      "medium",
      "pause_for_input",
      "User, account, and opportunity are present. Resume and job description are still required.",
      "none",
      "low",
    );

    const task = createTask(
      opportunity.opportunity_id,
      "Collect intake artifacts and confirm candidate profile",
      "Customer Success Lead",
      true,
    );

    const stageEvent = createStageEvent(
      opportunity.opportunity_id,
      opportunity.current_stage,
      "created",
      "user",
      state.selectedUserId,
      "Opportunity created from guided intake.",
    );

    patchState(
      (current) => ({
        ...current,
        opportunities: [opportunity, ...current.opportunities],
        candidateProfiles: [profile, ...current.candidateProfiles],
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
        events: [stageEvent, ...current.events],
        selectedOpportunityId: opportunity.opportunity_id,
      }),
      "Opportunity created and routed into intake.",
    );

    return opportunity;
  };

  const handleAdvanceStage = () => {
    if (!selectedOpportunity) return;

    const nextStage = getNextStage(selectedOpportunity.current_stage);
    if (nextStage === selectedOpportunity.current_stage) {
      setNotice({ tone: "info", message: "This opportunity is already at a terminal stage." });
      return;
    }

    const nextStatus: OpportunityStatus =
      nextStage === "closed_won"
        ? "closed_won"
        : nextStage === "closed_lost"
          ? "closed_lost"
          : "active";

    const updatedOpportunity = {
      ...selectedOpportunity,
      current_stage: nextStage,
      updated_at: nowIso(),
      status: nextStatus,
    };

    const checkpoint = createCheckpoint(
      updatedOpportunity,
      stageMeta[nextStage].label,
      `Pre-stage advance check for ${stageMeta[nextStage].label}`,
      "high", // All stage advances are high-stakes for AI checkpoints
      nextStage === "outreach_ready" ||
        nextStage === "offer_review" ||
        nextStage === "intake_complete" ||
        nextStage === "positioning"
        ? "escalate_for_review"
        : "proceed",
      `AI evaluation before advancing to ${stageMeta[nextStage].label}.`,
      "medium", // Default truthfulness risk
      "low", // Default policy risk
    );

    const isBlocking =
      checkpoint.decision === "block" || checkpoint.decision === "escalate_for_review";
    const requiresHumanReview = checkpoint.human_review_required;

    if (isBlocking) {
      setNotice({
        tone: "info",
        message: `Stage advance blocked: ${checkpoint.evidence_summary}. Decision: ${checkpoint.decision}.`,
      });
      return;
    }

    if (requiresHumanReview) {
      setNotice({
        tone: "info",
        message: `Human review required before proceeding to ${stageMeta[nextStage].label}. Assigned to: ${checkpoint.assigned_reviewer_role || "N/A"}.`,
      });
      // Optionally, a modal could be rendered here to confirm human review
      // For now, we proceed but alert the user.
    }

    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Complete ${stageMeta[nextStage].label.toLowerCase()} review`,
      stageMeta[nextStage].reviewerRole,
      !isClosedStage(nextStage),
    );

    const stageEvent = createStageEvent(
      selectedOpportunity.opportunity_id,
      nextStage,
      "advanced",
      "user",
      state.selectedUserId!,
      `Advanced from ${stageMeta[selectedOpportunity.current_stage].label} to ${stageMeta[nextStage].label}.`,
    );

    const memo = createMemo(
      selectedOpportunity.opportunity_id,
      nextStage === "offer_review"
        ? "offer"
        : nextStage === "fit_review"
          ? "fit"
          : nextStage === "positioning"
            ? "positioning"
            : nextStage === "interview_active"
              ? "interview"
              : "final",
      stageMeta[nextStage].description,
      checkpoint.confidence_level,
      false,
    );

    patchState(
      (current) => ({
        ...current,
        opportunities: current.opportunities.map((opportunity) =>
          opportunity.opportunity_id === updatedOpportunity.opportunity_id
            ? updatedOpportunity
            : opportunity,
        ),
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
        memos: [memo, ...current.memos],
        events: [stageEvent, ...current.events],
      }),
      `Opportunity advanced into ${stageMeta[nextStage].label}.`,
    );
  };

  const handleCloseLost = () => {
    if (!selectedOpportunity) return;

    if (isClosedStage(selectedOpportunity.current_stage)) {
      setNotice({ tone: "info", message: "This opportunity is already at a terminal stage." });
      return;
    }

    const updatedOpportunity = {
      ...selectedOpportunity,
      current_stage: "closed_lost" as const,
      updated_at: nowIso(),
      status: "closed_lost" as OpportunityStatus,
    };

    const checkpoint = createCheckpoint(
      updatedOpportunity,
      stageMeta.closed_lost.label,
      `Close from ${stageMeta[selectedOpportunity.current_stage].label}`,
      "medium",
      "proceed_with_warning",
      "Opportunity was intentionally closed as lost from the active workflow.",
      "low",
      "low",
    );

    const memo = createMemo(
      selectedOpportunity.opportunity_id,
      "final",
      "Opportunity was closed as lost after guided review and lifecycle capture.",
      checkpoint.confidence_level,
      false,
    );

    const stageEvent = createStageEvent(
      selectedOpportunity.opportunity_id,
      "closed_lost",
      "completed",
      "user",
      state.selectedUserId!,
      `Closed as lost from ${stageMeta[selectedOpportunity.current_stage].label}.`,
    );

    patchState(
      (current) => ({
        ...current,
        opportunities: current.opportunities.map((opportunity) =>
          opportunity.opportunity_id === updatedOpportunity.opportunity_id
            ? updatedOpportunity
            : opportunity,
        ),
        checkpoints: [checkpoint, ...current.checkpoints],
        memos: [memo, ...current.memos],
        events: [stageEvent, ...current.events],
      }),
      "Opportunity closed as lost with audit history preserved.",
    );
  };

  return {
    handleOpportunitySubmit,
    handleAdvanceStage,
    handleCloseLost,
  };
}
