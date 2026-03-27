import type { SensitiveSupportType } from "./types";

export const supportTemplates: Record<
  SensitiveSupportType,
  { label: string; guidance: string; actions: string[] }
> = {
  layoff: {
    label: "Layoff support",
    guidance:
      "A layoff is not a character judgment. Frame the event clearly, keep the explanation brief, and pivot to current readiness.",
    actions: [
      "Prepare a one-sentence explanation that stays factual and calm.",
      "Document recent wins so the story stays grounded in contribution, not only circumstance.",
      "Use the workflow to track urgency, savings runway, and roles worth prioritizing first.",
    ],
  },
  fired: {
    label: "Termination recovery support",
    guidance:
      "If you were fired, honest framing and forward-looking accountability matter more than over-explaining.",
    actions: [
      "Prepare a concise explanation focused on what changed and what you learned.",
      "Avoid blame-heavy storytelling in early conversations.",
      "Use coaching to identify proof points that show reliability and recovery.",
    ],
  },
  quit_without_notice: {
    label: "Abrupt exit support",
    guidance:
      "An abrupt exit may raise trust questions, so the response should emphasize context, ownership, and what is different now.",
    actions: [
      "Write a short explanation that does not become defensive.",
      "Prepare alternate references or proof points if needed.",
      "Use outreach and interview coaching to answer the question once, then redirect to fit and execution.",
    ],
  },
  criminal_history: {
    label: "Criminal history support",
    guidance:
      "This path should prioritize dignity, legal caution, and practical preparation. Share only what is necessary and relevant to the process.",
    actions: [
      "Record only the minimum information you want in this local-only workspace.",
      "Prepare a disclosure approach only for stages where it may actually matter.",
      "Use the opportunity workflow to identify employers, roles, and timing with lower risk.",
    ],
  },
  reentry: {
    label: "Re-entry support",
    guidance:
      "Re-entry support should focus on wellness, momentum, and reducing administrative overwhelm while rebuilding confidence.",
    actions: [
      "Break the process into smaller tasks and use the workflow to avoid losing progress.",
      "Collect proof points from before, during, and after re-entry that show discipline and growth.",
      "Use coaching blocks selectively so the process stays supportive rather than exhausting.",
    ],
  },
  background_concern: {
    label: "Background concern support",
    guidance:
      "Not every background concern requires early disclosure. Focus on timing, role relevance, and factual preparation.",
    actions: [
      "List the concern privately and only if it helps your planning.",
      "Prepare a clean explanation plus a redirect to present capability.",
      "Track any employers or processes where additional review may be more likely.",
    ],
  },
};
