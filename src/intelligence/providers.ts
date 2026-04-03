import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import * as Sentry from "@sentry/react";
import { generateCandidateStory } from "./story"; // This is the local deterministic version
import { FLAGS } from "../lib/flags";
import type {
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  SourceArtifact,
} from "../types";
import type { Opportunity, User } from "../types";
import { candidateStoryContentSchema } from "./validators";

type StoryInput = {
  user?: User;
  opportunity: Opportunity;
  profile?: CandidateProfile;
  artifacts: SourceArtifact[];
  correspondence: CorrespondenceItem[];
  aiSettings?: {
    provider: "local" | "openai" | "anthropic";
    openai_api_key?: string;
    anthropic_api_key?: string;
    api_base_url?: string;
    model?: string; // e.g., gpt-4o-mini, claude-3-opus-20240229
  };
};

/**
 * Generates a candidate story via the OpenAI SDK.
 *
 * NOTE: dangerouslyAllowBrowser is intentional — Monyawn is a local-first app
 * where the user supplies their own API key. No key ever touches our servers.
 * For managed deployments, route through a server-side proxy instead.
 */
async function generateStoryWithOpenAI(
  input: StoryInput,
): Promise<Omit<CandidateStory, "story_id" | "updated_at">> {
  if (!input.aiSettings?.openai_api_key) {
    throw new Error("OpenAI API key is missing.");
  }
  const client = new OpenAI({
    apiKey: input.aiSettings.openai_api_key,
    baseURL: input.aiSettings.api_base_url || undefined,
    dangerouslyAllowBrowser: true,
  });

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
      model: input.aiSettings.model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
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
    Sentry.captureException(err, { tags: { feature: "ai_story_generation_openai" } });
    throw err;
  }
}

/**
 * Generates a candidate story via the Anthropic SDK.
 *
 * NOTE: This function does not use dangerouslyAllowBrowser as Anthropic's SDK
 * does not directly support browser-side API key usage in the same way OpenAI's does.
 * For local-first, the API key is exposed. For managed deployments, route through a server-side proxy.
 */
async function generateStoryWithAnthropic(
  input: StoryInput,
): Promise<Omit<CandidateStory, "story_id" | "updated_at">> {
  if (!input.aiSettings?.anthropic_api_key) {
    throw new Error("Anthropic API key is missing.");
  }
  const client = new Anthropic({
    apiKey: input.aiSettings.anthropic_api_key,
    baseURL: input.aiSettings.api_base_url || undefined,
  });

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
    const completion = await client.messages.create({
      model: input.aiSettings.model || "claude-3-haiku-20240307",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.7,
    });

    const firstBlock = completion.content[0];
    const rawContent = firstBlock?.type === "text" ? firstBlock.text : "";
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
    Sentry.captureException(err, { tags: { feature: "ai_story_generation_anthropic" } });
    throw err;
  }
}

/**
 * Provider factory for candidate story generation.
 *
 * Routes to the correct backend based on aiSettings.provider and feature flags.
 * Always falls back to local deterministic generation if cloud provider is
 * unavailable or not configured — preserving the local-first promise.
 */
export async function generateStory(
  input: StoryInput,
): Promise<Omit<CandidateStory, "story_id" | "updated_at">> {
  const provider = input.aiSettings?.provider ?? "local";

  if (provider === "openai" && FLAGS.openai_enabled && input.aiSettings?.openai_api_key) {
    return generateStoryWithOpenAI(input);
  }

  if (
    provider === "anthropic" &&
    FLAGS.openai_enabled && // Using openai_enabled to gate all AI for simplicity here
    input.aiSettings?.anthropic_api_key
  ) {
    return generateStoryWithAnthropic(input);
  }

  // local deterministic fallback — no API key required
  return generateCandidateStory(input);
}
