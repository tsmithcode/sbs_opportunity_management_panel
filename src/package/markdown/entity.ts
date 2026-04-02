import {
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  Opportunity,
  ReleaseArtifactReviewRecord,
  SensitiveSupportProfile,
  SourceArtifact,
} from "../../types";
import { stageMeta } from "../../workflow";

export function renderOpportunityMarkdown(
  opportunity: Opportunity,
  artifacts: SourceArtifact[],
): string {
  return `# ${opportunity.company_name} - ${opportunity.role_title}

- Opportunity ID: \`${opportunity.opportunity_id}\`
- Stage: ${stageMeta[opportunity.current_stage].label}
- Status: ${opportunity.status}
- Source: ${opportunity.opportunity_source || "Not provided"}
- Employment type: ${opportunity.employment_type || "Not provided"}
- Location type: ${opportunity.location_type || "Not provided"}
- Updated at: ${opportunity.updated_at}

## Artifact Summary
${artifacts.length ? artifacts.map((artifact) => `- ${artifact.artifact_type}: ${artifact.source_label} (${artifact.review_status}, ${artifact.parse_status})`).join("\n") : "- No artifacts captured yet."}
`;
}

export function renderCandidateStoryMarkdown(story: CandidateStory): string {
  return `${story.markdown}

---
- Story ID: \`${story.story_id}\`
- Status: ${story.status}
- Updated at: ${story.updated_at}
`;
}

export function renderSensitiveSupportMarkdown(profile: SensitiveSupportProfile): string {
  return `# Sensitive Support Profile

- Opportunity ID: \`${profile.opportunity_id}\`
- Enabled: ${profile.enabled ? "Yes" : "No"}
- Included in export: ${profile.include_in_export ? "Yes" : "No"}
- Updated at: ${profile.updated_at}

## Categories
${profile.categories.length ? profile.categories.map((item) => `- ${item}`).join("\n") : "- None selected"}

## Notes
${profile.notes || "No notes recorded."}

## Encouragement Plan
${profile.encouragement_plan || "No encouragement plan recorded."}
`;
}

export function renderCorrespondenceMarkdown(item: CorrespondenceItem): string {
  return `# ${item.subject || "Untitled correspondence"}

- Correspondence ID: \`${item.correspondence_id}\`
- Opportunity ID: \`${item.opportunity_id}\`
- Channel: ${item.channel}
- Status: ${item.status}
- Owner role: ${item.owner_role}
- Created at: ${item.created_at}

## Body
${item.body || "No body recorded."}

## Extracted Signals
- Names: ${item.extracted_signals?.names.join(", ") || "None"}
- Emails: ${item.extracted_signals?.emails.join(", ") || "None"}
- Dates: ${item.extracted_signals?.dates.join(", ") || "None"}
- Times: ${item.extracted_signals?.times.join(", ") || "None"}
- Interviews: ${item.extracted_signals?.interviews.join(" | ") || "None"}
`;
}

export function renderMemoMarkdown(memo: DecisionMemo): string {
  return `# ${memo.memo_type} memo

- Memo ID: \`${memo.memo_id}\`
- Opportunity ID: \`${memo.opportunity_id}\`
- Status: ${memo.status}
- Confidence: ${memo.confidence_level}
- Human approved: ${memo.human_approved ? "Yes" : "No"}
- Created at: ${memo.created_at}

## Summary
${memo.summary}
`;
}

export function renderReleaseArtifactReviewMarkdown(item: ReleaseArtifactReviewRecord): string {
  return `# ${item.title}

- Review ID: \`${item.review_id}\`
- Account ID: \`${item.account_id}\`
- Opportunity ID: \`${item.opportunity_id}\`
- Source name: ${item.source_name}
- Imported at: ${item.imported_at}

## Summary
${item.summary}

## Entries
${item.entries.length ? item.entries.map((entry) => `- ${entry}`).join("\n") : "- No entry list recorded."}

## Content Preview
${item.content}
`;
}
