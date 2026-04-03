/**
 * Monyawn Feature Flags
 *
 * Env-var driven. No external service required at this stage.
 * Set in .env (local) or Vercel/GitHub Actions environment variables (CI/prod).
 *
 * VITE_FLAG_OPENAI=true       — enables "Generate with AI" button and OpenAI calls
 * VITE_FLAG_SUPABASE_SYNC=false — disables cloud sync even when Supabase is configured
 * VITE_FLAG_CREW_MODE=true    — enables multi-user collaboration features
 */
export const FLAGS = {
  openai_enabled: import.meta.env.VITE_FLAG_OPENAI !== "false", // default on
  supabase_sync: import.meta.env.VITE_FLAG_SUPABASE_SYNC !== "false", // default on
  crew_mode: import.meta.env.VITE_FLAG_CREW_MODE === "true",
} as const;
