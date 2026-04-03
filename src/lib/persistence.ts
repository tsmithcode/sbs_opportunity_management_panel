import * as Sentry from "@sentry/react";
import { supabase } from "./supabase";
import { FLAGS } from "./flags";
import { logger } from "./logger";
import { AppState } from "../types";

/**
 * Monyawn Persistence Strategy: Invisible but Invincible 🥱
 *
 * 1. Local-First: The app remains fully functional with zero backend.
 * 2. Feature-Flagged: Sync only runs when VITE_FLAG_SUPABASE_SYNC is not "false".
 * 3. Optimistic Sync: When Supabase is connected, we shadow local state.
 * 4. Atomic Updates: We sync all tables in parallel.
 * 5. Error-Safe: All sync errors are captured to Sentry and logged; never thrown to the UI.
 */

// PostgrestFilterBuilder is PromiseLike but not Promise. This wrapper satisfies Promise.all.
function exec<T>(q: PromiseLike<T>): Promise<T> {
  return Promise.resolve(q);
}

async function getAuthenticatedUser() {
  if (!supabase || !FLAGS.supabase_sync) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function syncStateToSupabase(state: AppState) {
  const user = await getAuthenticatedUser();
  if (!user || !supabase) return;

  logger.info("Supabase sync started");

  try {
    const syncOps: Promise<unknown>[] = [];

    // 1. Accounts
    if (state.accounts.length > 0) {
      syncOps.push(
        exec(
          supabase.from("accounts").upsert(
            state.accounts.map((a) => ({
              account_id: a.account_id,
              account_name: a.account_name,
              account_type: a.account_type,
              primary_region: a.primary_region,
              support_tier: a.support_tier,
              created_at: a.created_at,
            })),
          ),
        ),
      );
    }

    // 2. Opportunities
    if (state.opportunities.length > 0) {
      syncOps.push(
        exec(
          supabase.from("opportunities").upsert(
            state.opportunities.map((o) => ({
              opportunity_id: o.opportunity_id,
              account_id: o.account_id,
              user_id: o.user_id,
              use_case_id: o.use_case_id,
              pathway: o.pathway,
              company_name: o.company_name,
              role_title: o.role_title,
              opportunity_source: o.opportunity_source,
              job_posting_url: o.job_posting_url,
              employment_type: o.employment_type,
              location_type: o.location_type,
              current_stage: o.current_stage,
              status: o.status,
              created_at: o.created_at,
              updated_at: o.updated_at,
            })),
          ),
        ),
      );
    }

    // 3. Artifacts
    if (state.artifacts.length > 0) {
      syncOps.push(
        exec(
          supabase.from("artifacts").upsert(
            state.artifacts.map((a) => ({
              artifact_id: a.artifact_id,
              opportunity_id: a.opportunity_id,
              artifact_type: a.artifact_type,
              source_label: a.source_label,
              origin: a.origin,
              review_status: a.review_status,
              parse_status: a.parse_status,
              version_number: a.version_number,
              evidence_note: a.evidence_note,
              content_summary: a.content_summary,
              source_text: a.source_text,
              extracted_signals: a.extracted_signals ?? {},
              created_at: a.created_at,
            })),
          ),
        ),
      );
    }

    // 4. Candidate Stories
    if (state.candidateStories.length > 0) {
      syncOps.push(
        exec(
          supabase.from("candidate_stories").upsert(
            state.candidateStories.map((s) => ({
              story_id: s.story_id,
              opportunity_id: s.opportunity_id,
              title: s.title,
              summary: s.summary,
              markdown: s.markdown,
              status: s.status,
              source_artifact_ids: s.source_artifact_ids ?? [],
              source_correspondence_ids: s.source_correspondence_ids ?? [],
              updated_at: s.updated_at,
            })),
          ),
        ),
      );
    }

    // 5. Correspondence
    if (state.correspondence.length > 0) {
      syncOps.push(
        exec(
          supabase.from("correspondence").upsert(
            state.correspondence.map((c) => ({
              correspondence_id: c.correspondence_id,
              opportunity_id: c.opportunity_id,
              channel: c.channel,
              subject: c.subject,
              body: c.body,
              status: c.status,
              scheduled_for: c.scheduled_for || null,
              owner_role: c.owner_role,
              extracted_signals: c.extracted_signals ?? {},
              created_at: c.created_at,
            })),
          ),
        ),
      );
    }

    // 6. Events (Audit Log)
    if (state.events.length > 0) {
      syncOps.push(
        exec(
          supabase.from("events").upsert(
            state.events.map((e) => ({
              event_id: e.event_id,
              opportunity_id: e.opportunity_id,
              stage: e.stage,
              event_type: e.event_type,
              actor_type: e.actor_type,
              actor_id: e.actor_id,
              event_timestamp: e.event_timestamp,
              notes: e.notes,
            })),
          ),
        ),
      );
    }

    // 7. Tasks
    if (state.tasks.length > 0) {
      syncOps.push(
        exec(
          supabase.from("tasks").upsert(
            state.tasks.map((t) => ({
              task_id: t.task_id,
              opportunity_id: t.opportunity_id,
              task_type: t.task_type,
              owner_role: t.owner_role,
              owner_id: t.owner_id || null,
              due_at: t.due_at || null,
              status: t.status,
              blocking: t.blocking,
              created_at: t.created_at,
            })),
          ),
        ),
      );
    }

    await Promise.all(syncOps);
    logger.info("Supabase sync complete", { tables: syncOps.length });
  } catch (err) {
    logger.error("Supabase sync failed", { error: String(err) });
    Sentry.captureException(err, { tags: { feature: "supabase_sync" } });
    // Never re-throw — sync errors must not interrupt the user experience
  }
}

export async function loadStateFromSupabase(): Promise<Partial<AppState> | null> {
  const user = await getAuthenticatedUser();
  if (!user || !supabase) return null;

  try {
    const [
      { data: accounts },
      { data: opportunities },
      { data: artifacts },
      { data: candidateStories },
      { data: correspondence },
      { data: events },
      { data: tasks },
    ] = await Promise.all([
      supabase.from("accounts").select("*"),
      supabase.from("opportunities").select("*"),
      supabase.from("artifacts").select("*"),
      supabase.from("candidate_stories").select("*"),
      supabase.from("correspondence").select("*"),
      supabase.from("events").select("*"),
      supabase.from("tasks").select("*"),
    ]);

    logger.info("Supabase load complete");

    return {
      accounts: (accounts as AppState["accounts"]) ?? [],
      opportunities: (opportunities as AppState["opportunities"]) ?? [],
      artifacts: (artifacts as AppState["artifacts"]) ?? [],
      candidateStories: (candidateStories as AppState["candidateStories"]) ?? [],
      correspondence: (correspondence as AppState["correspondence"]) ?? [],
      events: (events as AppState["events"]) ?? [],
      tasks: (tasks as AppState["tasks"]) ?? [],
    };
  } catch (err) {
    logger.error("Supabase load failed", { error: String(err) });
    Sentry.captureException(err, { tags: { feature: "supabase_load" } });
    return null;
  }
}
