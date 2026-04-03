import OpenAI from "openai";
import * as Sentry from "@sentry/react";
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
import { candidateStoryContentSchema } from "./validators";

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
  const who =
    input.profile?.experience_level || input.user?.current_role || "a professional in transition";
  const what =
    input.profile?.skills_summary || "translating prior experience into a clearer next-step story";
  const why = input.opportunity.opportunity_source
    ? `This opportunity matters because it connects through ${input.opportunity.opportunity_source} and aligns to the target role of ${input.opportunity.role_title}.`
    : `This opportunity matters because it is a concrete path toward ${input.opportunity.role_title}.`;
  const where = bulletOrFallback(
    aggregatedSignals.locations.length
      ? aggregatedSignals.locations
      : [input.opportunity.location_type],
    "the settings where this opportunity is expected to operate",
  );
  const when = bulletOrFallback(
    [...aggregatedSignals.dates, ...aggregatedSignals.times],
    "upcoming milestones are still being clarified",
  );
  const how =
    input.profile?.domain_strengths ||
    "through evidence-backed communication, practical delivery, and steady follow-through";
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

/**
 * Generates a candidate story via the OpenAI SDK.
 *
 * NOTE: dangerouslyAllowBrowser is intentional — Monyawn is a local-first app
 * where the user supplies their own API key. No key ever touches our servers.
 * For managed deployments, route through a server-side proxy instead.
 */
export async function generateStoryWithOpenAI(input: {
  apiKey: string;
  model: string;
  user?: User;
  opportunity: Opportunity;
  profile?: CandidateProfile;
  artifacts: SourceArtifact[];
  correspondence: CorrespondenceItem[];
}): Promise<Omit<CandidateStory, "story_id" | "updated_at">> {
  const client = new OpenAI({ apiKey: input.apiKey, dangerouslyAllowBrowser: true });

  const systemPrompt = `You are the Monyawn AI wingman. Your goal is to help candidates land high-stakes roles ($100k-$300k+) by turning raw experience into a confident, easy-to-read narrative.
The brand name "Monyawn" means "monyan" (money). Keep the tone bold, human, and real.
Focus on evidence-backed proof points.`;

  const userPrompt = `Generate a candidate story for:
User: ${JSON.stringify(input.user || {})}
Opportunity: ${JSON.stringify(input.opportunity)}
Profile: ${JSON.stringify(input.profile || {})}
Artifacts: ${input.artifacts.map((a) => a.source_text).join("\n---\n")}
Correspondence: ${input.correspondence.map((c) => c.body).join("\n---\n")}

Format the output as Markdown with sections: Who, What, Why, Where, When, How, Proof Points, Gaps.`;

  try {
    const completion = await client.chat.completions.create({
      model: input.model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    // Validate content meets minimum quality bar
    const content = candidateStoryContentSchema.parse(rawContent);

    return {
      opportunity_id: input.opportunity.opportunity_id,
      title: `${input.user?.full_name || "Candidate"} story for ${input.opportunity.company_name} (AI Generated)`,
      summary: `AI narrative built from ${input.artifacts.length} artifacts and ${input.correspondence.length} messages.`,
      markdown: content,
      status: "review",
      source_artifact_ids: input.artifacts.map((artifact) => artifact.artifact_id),
      source_correspondence_ids: input.correspondence.map((item) => item.correspondence_id),
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { feature: "ai_story_generation" } });
    throw err;
  }
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
