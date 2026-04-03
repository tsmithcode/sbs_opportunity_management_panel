import { z } from "zod";

// Shape of a successful OpenAI chat completion response
const openAiResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      }),
    )
    .min(1),
});

/**
 * Validates and extracts the text content from an OpenAI chat completion response.
 * Throws a ZodError (caught by callers) on unexpected shape.
 */
export function validateOpenAiResponse(data: unknown): string {
  const parsed = openAiResponseSchema.parse(data);
  return parsed.choices[0].message.content;
}

// Minimal check that an AI-generated story has usable content
export const candidateStoryContentSchema = z.string().min(50, {
  message: "AI-generated story is too short to be valid.",
});
