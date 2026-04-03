# Monyawn Backend Foundation: Supabase Evolution

## Objective
Implement a robust, scalable backend using **Supabase (PostgreSQL)** to support the transition from Local-Only to Hybrid-Cloud. This foundation enables cross-device sync, multi-user collaboration (Crew Mode), and enterprise-grade auditing while preserving Monyawn's local-first privacy promise.

## 1. Architectural Strategy: The "Invisible" Sync
Monyawn follows an **Optimistic Local-First** pattern:
1. **Local Authority:** The browser remains the primary authority for state.
2. **Supabase Shadow:** When authenticated, changes are pushed to Supabase tables.
3. **Delta Sync:** Only modified entities are synced to minimize payload size and latency.
4. **Sovereign Opt-out:** Sensitive entities (like `sensitive_support_profiles`) can be marked as "Local-Only" to bypass the cloud shadow.

## 2. Supabase Schema Design (Phase 1)

### Core Tables
All tables use `uuid` primary keys (migrating from current prefixed strings where necessary for DB integrity).

| Table | Current Type Reference | Description |
|---|---|---|
| `accounts` | `Account` | Enterprise or individual workspace containers. |
| `users` | `User` | Extended user profile linked to `auth.users`. |
| `opportunities` | `Opportunity` | The central "Plays" being tracked. |
| `artifacts` | `SourceArtifact` | Resumes, JDs, and proof items. |
| `candidate_profiles` | `CandidateProfile` | Structured representation of user experience. |
| `candidate_stories` | `CandidateStory` | AI-generated evidence-backed narratives. |
| `correspondence` | `CorrespondenceItem` | Tracked emails, notes, and messages. |
| `events` | `StageEvent` | Audit log of stage transitions and major moves. |
| `checkpoints` | `AICheckpoint` | AI-driven gating decisions and risk logs. |
| `tasks` | `WorkflowTask` | Blocking and non-blocking lifecycle tasks. |
| `escalations` | `Escalation` | High-severity alerts requiring human review. |
| `memos` | `DecisionMemo` | Summarized alignment and pursuit decisions. |
| `outcomes` | `OutcomeMetadata` | Post-mortem data for closed plays. |

### Governance & Access Tables
| Table | Current Type Reference | Description |
|---|---|---|
| `enterprise_control_profiles` | `EnterpriseControlProfile` | Global governance settings for an account. |
| `role_entitlements` | `RoleEntitlement` | RBAC mapping for workspace/admin access. |

## 3. Implementation Roadmap

### Phase 1: Identity & Persistence (P0) - CURRENT
- [ ] Initialize Supabase Client (`src/lib/supabase.ts`).
- [ ] Define SQL migrations for all core tables.
- [ ] Implement `SupabasePersistenceAdapter` to mirror local state.
- [ ] Add "Anonymous -> Claimed" auth flow.

### Phase 2: Max-Leverage API (P1)
- [ ] Implement Edge Functions for `CandidateStory` generation (securing OpenAI keys).
- [ ] Move "Integrity Check" logic to the server for enterprise auditing.

### Phase 3: Team Collaboration (P1)
- [ ] Real-time sync for "Crew Mode" using Supabase Realtime.
- [ ] Shared artifact review workflow.

## 4. Expert Panel Gating
- **CTO (Expert 27):** Approved the move to UUIDs. Schema must enforce foreign key integrity between `accounts`, `users`, and `opportunities`.
- **Privacy Architect:** Validated the "Local-Only" flag for sensitive profiles. Zero-knowledge encryption for these fields is the target for Phase 2.
- **CEO:** The backend should be invisible. Users see "Sync Active 🟢" but the UX remains unbothered (🥱).

*Monyawn: Finna get to the monyawn.* 🥱
