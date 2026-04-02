import {
  ActorType,
  AICheckpoint,
  ConfidenceLevel,
  CorrespondenceItem,
  DecisionMemo,
  Escalation,
  EventType,
  Opportunity,
  OpportunityStage,
  StageEvent,
  WorkflowTask,
} from "../../types";
import { createId, nowIso } from "../utils";
import { stageMeta } from "../constants";

export function createCheckpoint(
  opportunity: Opportunity,
  stepName: string,
  triggerReason: string,
  confidenceLevel: ConfidenceLevel,
  decision: AICheckpoint["decision"],
  evidenceSummary: string,
  truthfulnessRisk: AICheckpoint["truthfulness_risk"],
  policyRisk: AICheckpoint["policy_risk"],
): AICheckpoint {
  return {
    checkpoint_id: createId("checkpoint"),
    opportunity_id: opportunity.opportunity_id,
    stage: opportunity.current_stage,
    step_name: stepName,
    trigger_reason: triggerReason,
    decision,
    confidence_level: confidenceLevel,
    evidence_summary: evidenceSummary,
    policy_risk: policyRisk,
    truthfulness_risk: truthfulnessRisk,
    human_review_required:
      decision === "escalate_for_review" ||
      decision === "block" ||
      opportunity.current_stage === "positioning" ||
      opportunity.current_stage === "outreach_ready" ||
      opportunity.current_stage === "offer_review",
    assigned_reviewer_role: stageMeta[opportunity.current_stage].reviewerRole,
    created_at: nowIso(),
  };
}

export function createTask(
  opportunityId: string,
  taskType: string,
  ownerRole: string,
  blocking: boolean,
): WorkflowTask {
  return {
    task_id: createId("task"),
    opportunity_id: opportunityId,
    task_type: taskType,
    owner_role: ownerRole,
    owner_id: "",
    due_at: "",
    status: "open",
    blocking,
    created_at: nowIso(),
  };
}

export function createStageEvent(
  opportunityId: string,
  stage: OpportunityStage,
  eventType: EventType,
  actorType: ActorType,
  actorId: string,
  notes: string,
): StageEvent {
  return {
    event_id: createId("event"),
    opportunity_id: opportunityId,
    stage,
    event_type: eventType,
    actor_type: actorType,
    actor_id: actorId,
    event_timestamp: nowIso(),
    notes,
  };
}

export function createMemo(
  opportunityId: string,
  memoType: DecisionMemo["memo_type"],
  summary: string,
  confidence: ConfidenceLevel,
  humanApproved: boolean,
): DecisionMemo {
  return {
    memo_id: createId("memo"),
    opportunity_id: opportunityId,
    memo_type: memoType,
    status: humanApproved ? "approved" : "review",
    summary,
    confidence_level: confidence,
    human_approved: humanApproved,
    created_at: nowIso(),
  };
}

export function createEscalation(
  opportunityId: string,
  escalationType: Escalation["escalation_type"],
  ownerRole: string,
  severity: Escalation["severity"],
  resolutionNotes: string,
): Escalation {
  return {
    escalation_id: createId("escalation"),
    opportunity_id: opportunityId,
    escalation_type: escalationType,
    severity,
    owner_role: ownerRole,
    status: "open",
    resolution_notes: resolutionNotes,
    created_at: nowIso(),
  };
}

export function createCorrespondence(
  opportunityId: string,
  channel: CorrespondenceItem["channel"],
  subject: string,
  body: string,
  extractedSignals?: CorrespondenceItem["extracted_signals"],
): CorrespondenceItem {
  return {
    correspondence_id: createId("cor"),
    opportunity_id: opportunityId,
    channel,
    subject,
    body,
    status: "draft",
    scheduled_for: "",
    owner_role: "CRM / Correspondence Operations Lead",
    extracted_signals: extractedSignals,
    created_at: nowIso(),
  };
}
