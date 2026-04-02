import {
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  Opportunity,
  SourceArtifact,
  User,
} from "../types";
import { createId, nowIso } from "../workflow";
import { EMPTY_SIGNALS, mergeSignalSets } from "./signals";

function bulletOrFallback(values: string[], fallback: string): string {
  return values.length ? values.join(", ") : fallback;
}

export function generateCandidateStory(input: {
  user?: User;
  opportunity: Opportunity;
  profile?: CandidateProfile;
  artifacts: SourceArtifact[];
  correspondence: CorrespondenceItem[];
}): Omit<CandidateStory, "story_id" | "updated_at"> {
  const aggregatedSignals = mergeSignalSets([
    ...input.artifacts.map((artifact) => artifact.extracted_signals ?? EMPTY_SIGNALS),
    ...input.correspondence.map((item) => item.extracted_signals ?? EMPTY_SIGNALS),
  ]);

  const title = `${input.user?.full_name || "Candidate"} story for ${input.opportunity.company_name}`;
  const summary = `${input.opportunity.role_title} narrative built from lifecycle evidence, structured signals, and profile context.`;
  const who = input.profile?.experience_level || input.user?.current_role || "a professional in transition";
  const what = input.profile?.skills_summary || "translating prior experience into a clearer next-step story";
  const why =
    input.opportunity.opportunity_source
      ? `This opportunity matters because it connects through ${input.opportunity.opportunity_source} and aligns to the target role of ${input.opportunity.role_title}.`
      : `This opportunity matters because it is a concrete path toward ${input.opportunity.role_title}.`;
  const where = bulletOrFallback(
    aggregatedSignals.locations.length ? aggregatedSignals.locations : [input.opportunity.location_type],
    "the settings where this opportunity is expected to operate",
  );
  const when = bulletOrFallback(
    [...aggregatedSignals.dates, ...aggregatedSignals.times],
    "upcoming milestones are still being clarified",
  );
  const how = input.profile?.domain_strengths || "through evidence-backed communication, practical delivery, and steady follow-through";
  const gaps = input.profile?.declared_gaps || "No major gaps have been declared yet.";
  const proofPoints = bulletOrFallback(
    aggregatedSignals.companies.length
      ? aggregatedSignals.companies.map((company) => `Experience or signal linked to ${company}`)
      : input.artifacts.slice(0, 3).map((artifact) => artifact.source_label),
    "More proof points should be added through artifacts, correspondence, and debrief notes.",
  );
  const interviewCues = bulletOrFallback(
    aggregatedSignals.interviews,
    "No interview-specific signals captured yet.",
  );

  const markdown = `# ${title}

## Story Summary
${summary}

## Who
I am ${who}. My current narrative shows that I bring ${what}.

## What
I am pursuing the ${input.opportunity.role_title} opportunity at ${input.opportunity.company_name} with a focus on clear, supportable evidence rather than generic claims.

## Why
${why}

## Where
I create value in ${where}.

## When
The current timeline signals include ${when}.

## How
I communicate and execute by leaning on ${how}.

## Proof Points
${proofPoints}

## Gaps To Address
${gaps}

## Interview And Outreach Cues
${interviewCues}

## Structured Signals
- Names: ${bulletOrFallback(aggregatedSignals.names, "None captured")}
- Emails: ${bulletOrFallback(aggregatedSignals.emails, "None captured")}
- Phones: ${bulletOrFallback(aggregatedSignals.phones, "None captured")}
- Companies: ${bulletOrFallback(aggregatedSignals.companies, "None captured")}
- Locations: ${bulletOrFallback(aggregatedSignals.locations, "None captured")}
- Contingencies: ${bulletOrFallback(aggregatedSignals.contingencies, "None captured")}
`;

  return {
    opportunity_id: input.opportunity.opportunity_id,
    title,
    summary,
    markdown,
    status: "review",
    source_artifact_ids: input.artifacts.map((artifact) => artifact.artifact_id),
    source_correspondence_ids: input.correspondence.map((item) => item.correspondence_id),
  };
}

export async function generateStoryWithOpenAI(input: {
  apiKey: string;
  model: string;
  user?: User;
  opportunity: Opportunity;
  profile?: CandidateProfile;
  artifacts: SourceArtifact[];
  correspondence: CorrespondenceItem[];
}): Promise<Omit<CandidateStory, "story_id" | "updated_at">> {
  const systemPrompt = `You are the Monyawn AI Guardian Angel 🥱. Your goal is to help candidates land high-stakes roles ($100k-$300k+) by turning their raw experience into a confident, easy-to-read narrative.
The brand name "Monyawn" (Money + Yawn) means making what seemed hard feel easy.
Be direct, professional, yet slightly unbothered (🥱). 
Focus on evidence-backed proof points.`;

  const userPrompt = `Generate a candidate story for:
User: ${JSON.stringify(input.user || {})}
Opportunity: ${JSON.stringify(input.opportunity)}
Profile: ${JSON.stringify(input.profile || {})}
Artifacts: ${input.artifacts.map(a => a.source_text).join("\n---\n")}
Correspondence: ${input.correspondence.map(c => c.body).join("\n---\n")}

Format the output as Markdown with sections: Who, What, Why, Where, When, How, Proof Points, Gaps.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${input.apiKey}`
    },
    body: JSON.stringify({
      model: input.model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return {
    opportunity_id: input.opportunity.opportunity_id,
    title: `${input.user?.full_name || "Candidate"} story for ${input.opportunity.company_name} (AI Generated 🥱)`,
    summary: `Premium AI-generated narrative build from ${input.artifacts.length} artifacts and ${input.correspondence.length} messages. 🥱`,
    markdown: content,
    status: "review",
    source_artifact_ids: input.artifacts.map((artifact) => artifact.artifact_id),
    source_correspondence_ids: input.correspondence.map((item) => item.correspondence_id),
  };
}

export function createCandidateStoryRecord(
  story: Omit<CandidateStory, "story_id" | "updated_at">,
): CandidateStory {
  return {
    story_id: createId("story"),
    updated_at: nowIso(),
    ...story,
  };
}
