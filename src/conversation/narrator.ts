import { ConversationSnapshotItem, ConversationStep } from "../../packages/conversation-core/src";

function trimSummary(summary: string) {
  return summary.replace(/\s+/g, " ").trim();
}

export function getConversationRecap(snapshot: ConversationSnapshotItem[]) {
  if (snapshot.length === 0) {
    return "Start with whatever proof you already have. We’ll shape it together as you go.";
  }

  const latest = snapshot[snapshot.length - 1];
  const cleanSummary = trimSummary(latest.summary);

  if (snapshot.length === 1) {
    return `Bet. I’m starting from ${cleanSummary || latest.label.toLowerCase()} and building the rest around that.`;
  }

  return `Here’s what I’m holding so far: ${cleanSummary || latest.label.toLowerCase()}. We’re keeping the trail tight and moving forward.`;
}

export function getConversationBridge(
  currentStep: ConversationStep | undefined,
  previousStep: ConversationStep | undefined,
  snapshot: ConversationSnapshotItem[],
) {
  if (!currentStep) {
    return "The setup is locked. One last look and you can drop straight into the workspace.";
  }

  if (!previousStep || snapshot.length === 0) {
    return currentStep.segue;
  }

  const previousSummary = trimSummary(snapshot[snapshot.length - 1]?.summary ?? "");
  if (!previousSummary) {
    return currentStep.segue;
  }

  return `Got it. ${previousSummary}. ${currentStep.segue}`;
}

export function getConversationCompletionSummary(snapshot: ConversationSnapshotItem[]) {
  if (snapshot.length === 0) {
    return "We still need the basics before there’s a real play to lock.";
  }

  const lastThree = snapshot.slice(-3).map((item) => trimSummary(item.summary || item.label));
  return `Here’s the quick recap: ${lastThree.join(" • ")}. The play is ready to lock if that still looks right.`;
}

export function getReplayNarration(count: number) {
  if (count <= 0) {
    return null;
  }

  if (count === 1) {
    return "One answer got reopened off that edit, so we can keep the story honest.";
  }

  return `${count} answers got reopened off that edit, so the story stays clean all the way down.`;
}
