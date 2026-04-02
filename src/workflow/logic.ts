import {
  Account,
  Opportunity,
  OpportunityStage,
  User,
} from "../types";
import { stageOrder } from "./constants";

export function getNextStage(stage: OpportunityStage): OpportunityStage {
  const index = stageOrder.indexOf(stage);
  if (index === -1 || index >= stageOrder.length - 2) {
    return stage;
  }
  return stageOrder[index + 1];
}

export function isClosedStage(stage: OpportunityStage): boolean {
  return stage === "closed_won" || stage === "closed_lost";
}

export function getGovernanceOverlays(
  account: Account | undefined,
  user: User | undefined,
  opportunity: Opportunity | undefined,
): string[] {
  const overlays = [
    "Human review enforced for high-stakes outputs",
    "Evidence and confidence shown before recommendation",
  ];

  if (!account || !user || !opportunity) {
    return overlays;
  }

  if (account.account_type === "government") {
    overlays.push("Government account: route legal, accessibility, and procurement questions to staffed reviewers.");
  }

  if (account.account_type === "enterprise") {
    overlays.push("Enterprise account: keep implementation logging, export paths, and reviewer assignment visible.");
  }

  if (user.sponsorship_type === "managed_service") {
    overlays.push("Managed-service overlay: staff queues and review ownership are part of the product promise.");
  }

  if (user.region.toLowerCase().includes("eu")) {
    overlays.push("Region-sensitive privacy review is required before making stronger cross-border data claims.");
  }

  if (opportunity.current_stage === "outreach_ready" || opportunity.current_stage === "offer_review") {
    overlays.push("External use blocked until explicit approval is recorded.");
  }

  return overlays;
}
