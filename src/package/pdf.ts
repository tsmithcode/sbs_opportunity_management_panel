import {
  AppState,
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  Opportunity,
  SourceArtifact,
} from "../types";
import { stageMeta } from "../workflow";
import { renderSessionSummaryMarkdown } from "./markdown";

async function buildPdf(
  title: string,
  sections: Array<{ heading: string; body: string }>,
): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54;
  const marginTop = 56;
  const marginBottom = 56;
  const maxWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, marginX, y);
  y += 28;

  sections.forEach((section) => {
    ensureSpace(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.heading, marginX, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(section.body || " ", maxWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(16);
      doc.text(line, marginX, y);
      y += 14;
    });
    y += 10;
  });

  return new Uint8Array(doc.output("arraybuffer"));
}

export async function buildOpportunityPdf(
  opportunity: Opportunity,
  artifacts: SourceArtifact[],
): Promise<Uint8Array> {
  return buildPdf(`${opportunity.company_name} - ${opportunity.role_title}`, [
    {
      heading: "Opportunity Overview",
      body: [
        `Stage: ${stageMeta[opportunity.current_stage].label}`,
        `Status: ${opportunity.status}`,
        `Source: ${opportunity.opportunity_source || "Not provided"}`,
        `Employment type: ${opportunity.employment_type || "Not provided"}`,
        `Location type: ${opportunity.location_type || "Not provided"}`,
        `Updated at: ${opportunity.updated_at}`,
      ].join("\n"),
    },
    {
      heading: "Artifact Summary",
      body: artifacts.length
        ? artifacts
            .map(
              (artifact) =>
                `${artifact.artifact_type}: ${artifact.source_label} (${artifact.review_status}, ${artifact.parse_status})`,
            )
            .join("\n")
        : "No artifacts captured yet.",
    },
  ]);
}

export async function buildCandidateStoryPdf(story: CandidateStory): Promise<Uint8Array> {
  return buildPdf(story.title, [
    { heading: "Summary", body: story.summary },
    { heading: "Story", body: story.markdown.replace(/^# .+\n?/m, "").trim() },
    {
      heading: "Metadata",
      body: [
        `Status: ${story.status}`,
        `Updated at: ${story.updated_at}`,
        `Source artifacts: ${story.source_artifact_ids.length}`,
        `Source correspondence: ${story.source_correspondence_ids.length}`,
      ].join("\n"),
    },
  ]);
}

export async function buildMemoPdf(memo: DecisionMemo): Promise<Uint8Array> {
  return buildPdf(`${memo.memo_type} memo`, [
    {
      heading: "Memo Metadata",
      body: [
        `Status: ${memo.status}`,
        `Confidence: ${memo.confidence_level}`,
        `Human approved: ${memo.human_approved ? "Yes" : "No"}`,
        `Created at: ${memo.created_at}`,
      ].join("\n"),
    },
    { heading: "Summary", body: memo.summary },
  ]);
}

export async function buildCorrespondencePdf(item: CorrespondenceItem): Promise<Uint8Array> {
  return buildPdf(item.subject || "Untitled correspondence", [
    {
      heading: "Correspondence Metadata",
      body: [
        `Channel: ${item.channel}`,
        `Status: ${item.status}`,
        `Owner role: ${item.owner_role}`,
        `Created at: ${item.created_at}`,
      ].join("\n"),
    },
    { heading: "Body", body: item.body || "No body recorded." },
  ]);
}

export async function buildPremiumDiligencePacketPdf(
  state: AppState,
  opportunity: Opportunity,
): Promise<Uint8Array> {
  const story = state.candidateStories.find((s) => s.opportunity_id === opportunity.opportunity_id);
  const artifacts = state.artifacts.filter((a) => a.opportunity_id === opportunity.opportunity_id);
  const correspondence = state.correspondence.filter(
    (c) => c.opportunity_id === opportunity.opportunity_id,
  );
  const posture = state.commercialPostures.find(
    (p) => p.opportunity_id === opportunity.opportunity_id,
  );
  const support = state.sensitiveSupportProfiles.find(
    (p) => p.opportunity_id === opportunity.opportunity_id,
  );

  const sections: Array<{ heading: string; body: string }> = [
    {
      heading: "Executive Summary",
      body: [
        `Company: ${opportunity.company_name}`,
        `Role: ${opportunity.role_title}`,
        `Status: ${stageMeta[opportunity.current_stage].label}`,
        `Integrity Check: ${state.lastSavedAt ? "Saved" : "Pending human review"}`,
        `Export Security: Local-only sovereign deployment guarantee active.`,
      ].join("\n"),
    },
  ];

  if (story) {
    sections.push({
      heading: "Evidence-Backed Narrative",
      body: story.summary + "\n\n" + story.markdown.replace(/^# .+\n?/m, "").trim(),
    });
  }

  if (artifacts.length) {
    sections.push({
      heading: "Artifact Evidence Base",
      body: artifacts
        .map(
          (a) =>
            `- [${a.artifact_type.toUpperCase()}] ${a.source_label}: ${a.evidence_note || a.content_summary}`,
        )
        .join("\n"),
    });
  }

  if (correspondence.length) {
    sections.push({
      heading: "Operational Correspondence",
      body: correspondence
        .map((c) => `- [${c.channel.toUpperCase()}] ${c.subject}: ${c.status}`)
        .join("\n"),
    });
  }

  if (opportunity.pathway === "1099" && posture) {
    sections.push({
      heading: "Commercial Posture",
      body: [
        `Target Rate: ${posture.target_rate}`,
        `Engagement: ${posture.engagement_type}`,
        `SOW Readiness: ${posture.sow_status.replace("_", " ")}`,
        `Availability: ${posture.availability}`,
      ].join("\n"),
    });
  } else if (support && support.enabled) {
    sections.push({
      heading: "Support Boundary Guidance",
      body: `Guidance enabled for categories: ${support.categories.join(", ")}. This profile ensures high-stakes moves maintain psychological and operational safety boundaries.`,
    });
  }

  sections.push({
    heading: "Governance & Authority",
    body: "This document is a governed export from the Monyawn platform. All claims are backed by local-first evidence drops and validated against the canonical workflow schema.",
  });

  return buildPdf(`Diligence Packet: ${opportunity.company_name}`, sections);
}

export async function buildSessionSummaryPdf(state: AppState): Promise<Uint8Array> {
  return buildPdf("Monyawn session summary", [
    {
      heading: "Summary",
      body: renderSessionSummaryMarkdown(state)
        .replace(/^# .+\n?/m, "")
        .trim(),
    },
  ]);
}
