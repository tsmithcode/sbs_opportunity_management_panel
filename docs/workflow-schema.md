# Workflow Schema

## Purpose
This document defines the canonical operating schema for Monyawn workflows.

It is the shared reference for:
- product requirements
- AI agent behavior
- staff operating procedures
- use-case templates
- reporting and KPI definitions
- approval and escalation logic

This schema should be treated as the system-of-structure for the Monyawn platform. Use-case documents may extend it, but should not casually contradict it.

## Scope
This schema is platform-level. It is not limited to the SBS use case, though the SBS use case is the initial reference implementation.

## Design Principles
- one canonical field name per concept
- one primary stage per opportunity at any time
- every determination must be evidence-aware
- every high-stakes output must support human review
- every escalation must have an owner
- every reportable metric must map to a recorded event or state
- defaults should be strong, but implementation details may evolve when the team documents a better platform-wide preference

## Schema Flexibility Rules
- Canonical entity names should stay stable unless there is a strong platform reason to change them.
- Enum values in this document are the default platform vocabulary, but the team may add values where needed.
- Use cases may extend stages, artifacts, and review states if they preserve reporting compatibility and documented mappings.
- If the team adopts a better pattern than the current default, the schema should be updated rather than bypassed locally.
- When there is tension between strict consistency and product usability, the team should prefer governed consistency with a documented exception path.

## Known Unknowns
The following items are intentionally not locked yet and should remain configurable until implementation proves the best pattern:
- exact confidence scoring scale shown to end users
- whether some review states should be merged or split in the UI
- how much stage progression is automatic versus staff-confirmed
- whether organization-sponsored users have separate account and tenant semantics
- how deeply reporting snapshots are materialized versus computed on demand
- what level of per-region policy variation is needed at launch

## Multi-Opportunity Default
The platform should assume multiple opportunities per user or account as the default operating model.

The user experience may still focus on one selected opportunity at a time for clarity, but:
- data structures should support many opportunities concurrently
- seeded reference data may include multiple opportunities in different lifecycle stages
- reporting should aggregate across opportunities at the account and use-case level

## Core Entities

### 1. User
Represents a person using the system directly.

| Field | Type | Required | Notes |
|---|---|---|---|
| `user_id` | string | Yes | Unique identifier |
| `account_id` | string | Yes | Owning account or tenant |
| `full_name` | string | Yes | User legal or preferred name based on policy |
| `email` | string | Yes | Primary contact |
| `phone` | string | No | Optional contact |
| `timezone` | string | No | Used for scheduling and reminders |
| `region` | string | Yes | Geography, legal region, or work region |
| `current_role` | string | No | Current work context |
| `target_role_family` | string | No | Desired role path |
| `target_compensation` | string | No | User-stated target range |
| `accessibility_needs` | string | No | Support needs or accommodations |
| `sponsorship_type` | enum | Yes | `self_serve`, `organization_sponsored`, `managed_service` |
| `created_at` | datetime | Yes | Creation timestamp |
| `updated_at` | datetime | Yes | Last update timestamp |

### 2. Account
Represents the owning customer or organizational container.

| Field | Type | Required | Notes |
|---|---|---|---|
| `account_id` | string | Yes | Unique identifier |
| `account_name` | string | Yes | Customer, institution, or self-serve grouping |
| `account_type` | enum | Yes | `individual`, `enterprise`, `government`, `education`, `workforce_program` |
| `primary_region` | string | No | Primary legal or operational region |
| `support_tier` | string | No | Support and SLA mapping |
| `created_at` | datetime | Yes | Creation timestamp |

### 2A. EnterpriseControlProfile
Represents account-level governance and admin-control posture.

| Field | Type | Required | Notes |
|---|---|---|---|
| `control_profile_id` | string | Yes | Unique identifier |
| `account_id` | string | Yes | Parent account |
| `entitlements_mode` | enum | Yes | `guided_default`, `staff_review`, `admin_controlled` |
| `external_release_requires_approval` | boolean | Yes | Controls whether external-facing outputs require approval |
| `export_confirmation_required` | boolean | Yes | Requires explicit confirmation before local handoff export |
| `allow_sensitive_support_export` | boolean | Yes | Policy-level permission for sensitive support export |
| `local_only_posture_locked` | boolean | Yes | Keeps the account on the current local-only promise |
| `deployment_posture` | text | Yes | Human-readable deployment and custody boundary |
| `buyer_readiness_stage` | enum | Yes | `internal_only`, `guided_pilot`, `buyer_reviewable` |
| `notes` | text | No | Admin or governance notes |
| `updated_at` | datetime | Yes | Last update timestamp |

### 2B. RoleEntitlement
Represents role-based access to workspace and enterprise controls.

| Field | Type | Required | Notes |
|---|---|---|---|
| `entitlement_id` | string | Yes | Unique identifier |
| `account_id` | string | Yes | Parent account |
| `role_name` | string | Yes | Human-readable role label |
| `workspace_access` | boolean | Yes | Can use the guided workspace |
| `staff_queue_access` | boolean | Yes | Can use staff operations views |
| `admin_console_access` | boolean | Yes | Can use admin and governance controls |
| `export_package_access` | boolean | Yes | Can assemble export packages |
| `diligence_packet_access` | boolean | Yes | Can prepare buyer-facing diligence materials |
| `notes` | text | No | Usage boundary or expectation |
| `updated_at` | datetime | Yes | Last update timestamp |

### 3. Opportunity
Represents a guided opportunity workflow instance.

| Field | Type | Required | Notes |
|---|---|---|---|
| `opportunity_id` | string | Yes | Unique identifier |
| `account_id` | string | Yes | Parent account |
| `user_id` | string | Yes | Primary acting user |
| `use_case_id` | string | Yes | Example: `sbs` |
| `company_name` | string | Yes | Target organization |
| `role_title` | string | Yes | Opportunity title |
| `opportunity_source` | string | No | Referral, job board, recruiter, etc. |
| `job_posting_url` | string | No | Source URL |
| `employment_type` | string | No | Full-time, contract, etc. |
| `location_type` | string | No | Remote, hybrid, onsite |
| `current_stage` | enum | Yes | Canonical stage name |
| `status` | enum | Yes | `active`, `paused`, `closed_won`, `closed_lost`, `withdrawn` |
| `created_at` | datetime | Yes | Creation timestamp |
| `updated_at` | datetime | Yes | Last update timestamp |

### 4. SourceArtifact
Represents uploaded or generated supporting material.

| Field | Type | Required | Notes |
|---|---|---|---|
| `artifact_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `artifact_type` | enum | Yes | `resume`, `job_description`, `message`, `note`, `offer`, `debrief`, `generated_output`, `other` |
| `source_label` | string | Yes | Human-readable source name |
| `origin` | enum | Yes | `user_uploaded`, `system_generated`, `imported`, `organization_supplied` |
| `review_status` | enum | Yes | `unreviewed`, `user_reviewed`, `approved`, `rejected` |
| `parse_status` | enum | No | `pending`, `complete`, `failed`, `not_applicable` |
| `extracted_signals` | object | No | locally parsed names, emails, phones, dates, interview cues, and related entities |
| `created_at` | datetime | Yes | Creation timestamp |

### 5. CandidateProfile
Represents structured profile data derived from artifacts and user corrections.

| Field | Type | Required | Notes |
|---|---|---|---|
| `profile_id` | string | Yes | Unique identifier |
| `user_id` | string | Yes | Associated user |
| `opportunity_id` | string | Yes | Opportunity-scoped profile state |
| `skills_summary` | text | No | Structured skill or experience summary |
| `experience_level` | string | No | Internal representation only |
| `domain_strengths` | text | No | Opportunity-relevant strengths |
| `declared_gaps` | text | No | Known missing experience or uncertainty |
| `user_corrected` | boolean | Yes | Whether the user reviewed/corrected |
| `updated_at` | datetime | Yes | Last update timestamp |

### 5A. CandidateStory
Represents the editable know-thyself narrative generated from lifecycle evidence.

| Field | Type | Required | Notes |
|---|---|---|---|
| `story_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `title` | string | Yes | Human-readable story title |
| `summary` | text | Yes | Short narrative summary |
| `markdown` | text | Yes | Canonical editable story body |
| `status` | enum | Yes | `draft`, `review`, `approved`, `rejected`, `archived` |
| `source_artifact_ids` | string[] | No | Lifecycle artifacts used to build the story |
| `source_correspondence_ids` | string[] | No | Correspondence used to build the story |
| `updated_at` | datetime | Yes | Last story update timestamp |

### 6. StageEvent
Represents a stateful workflow event for reporting and auditability.

| Field | Type | Required | Notes |
|---|---|---|---|
| `event_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `stage` | enum | Yes | Stage at event time |
| `event_type` | enum | Yes | `created`, `updated`, `advanced`, `paused`, `approved`, `rejected`, `escalated`, `completed` |
| `actor_type` | enum | Yes | `user`, `staff`, `ai_agent`, `system` |
| `actor_id` | string | No | Optional actor reference |
| `event_timestamp` | datetime | Yes | Time of event |
| `notes` | text | No | Context |

### 7. AICheckpoint
Represents an AI evaluation or determination.

| Field | Type | Required | Notes |
|---|---|---|---|
| `checkpoint_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `stage` | enum | Yes | Current stage |
| `step_name` | string | Yes | Current screen or logical step |
| `trigger_reason` | string | Yes | Why evaluation occurred |
| `decision` | enum | Yes | `proceed`, `proceed_with_warning`, `pause_for_input`, `escalate_for_review`, `block` |
| `confidence_level` | enum | Yes | `low`, `medium`, `high` |
| `evidence_summary` | text | Yes | Summary of source support |
| `policy_risk` | enum | No | `none`, `low`, `medium`, `high` |
| `truthfulness_risk` | enum | No | `none`, `low`, `medium`, `high` |
| `human_review_required` | boolean | Yes | Required review flag |
| `assigned_reviewer_role` | string | No | Role-based authority target |
| `created_at` | datetime | Yes | Creation timestamp |

### 8. PanelOpinion
Represents one expert or agent opinion about the opportunity.

| Field | Type | Required | Notes |
|---|---|---|---|
| `opinion_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `source_role` | string | Yes | Human or AI role name |
| `opinion_type` | string | Yes | Fit, positioning, comp, interview, etc. |
| `recommendation` | text | Yes | Main recommendation |
| `confidence_level` | enum | Yes | `low`, `medium`, `high` |
| `evidence_refs` | text | No | Artifact or memo references |
| `created_at` | datetime | Yes | Creation timestamp |

### 9. WorkflowTask
Represents human or system action to be completed.

| Field | Type | Required | Notes |
|---|---|---|---|
| `task_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `task_type` | string | Yes | Review, follow-up, prep, upload, approval, etc. |
| `owner_role` | string | Yes | Role-based owner |
| `owner_id` | string | No | Optional staff or user identifier |
| `due_at` | datetime | No | Due date or reminder time |
| `status` | enum | Yes | `open`, `in_progress`, `blocked`, `completed`, `cancelled` |
| `blocking` | boolean | Yes | Whether task blocks stage progress |
| `created_at` | datetime | Yes | Creation timestamp |

### 10. Escalation
Represents a routed issue or decision that needs elevated handling.

| Field | Type | Required | Notes |
|---|---|---|---|
| `escalation_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `escalation_type` | enum | Yes | `product`, `accessibility`, `security`, `privacy`, `legal`, `policy`, `finance`, `support`, `delivery` |
| `severity` | enum | Yes | `low`, `medium`, `high`, `critical` |
| `owner_role` | string | Yes | Responsible role |
| `status` | enum | Yes | `open`, `under_review`, `resolved`, `closed` |
| `resolution_notes` | text | No | Resolution summary |
| `created_at` | datetime | Yes | Creation timestamp |

### 11. DecisionMemo
Represents a stage-level recommendation or conclusion.

| Field | Type | Required | Notes |
|---|---|---|---|
| `memo_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `memo_type` | enum | Yes | `fit`, `pursuit`, `positioning`, `interview`, `offer`, `final` |
| `status` | enum | Yes | `draft`, `review`, `approved`, `archived` |
| `summary` | text | Yes | Decision summary |
| `confidence_level` | enum | Yes | `low`, `medium`, `high` |
| `human_approved` | boolean | Yes | Approval flag |
| `created_at` | datetime | Yes | Creation timestamp |

### 12. ReportingSnapshot
Represents periodic performance and operations reporting.

| Field | Type | Required | Notes |
|---|---|---|---|
| `snapshot_id` | string | Yes | Unique identifier |
| `account_id` | string | No | Optional account scope |
| `use_case_id` | string | Yes | Use case scope |
| `period_start` | datetime | Yes | Reporting period start |
| `period_end` | datetime | Yes | Reporting period end |
| `active_opportunities` | integer | Yes | Count |
| `intake_completion_rate` | number | No | Ratio or percent |
| `fit_review_completion_rate` | number | No | Ratio or percent |
| `approval_rate` | number | No | Ratio or percent |
| `escalation_rate` | number | No | Ratio or percent |
| `user_trust_score` | number | No | If collected |
| `created_at` | datetime | Yes | Creation timestamp |

### 13. ExportPackageManifest
Represents the package metadata used for local handoff export and import validation.

| Field | Type | Required | Notes |
|---|---|---|---|
| `package_version` | string | Yes | Handoff package version |
| `schema_version` | string | Yes | Canonical state schema version |
| `generated_at` | datetime | Yes | Export generation time |
| `account_id` | string | Yes | Export account scope |
| `selected_user_id` | string | Yes | Current focused user |
| `selected_opportunity_id` | string | Yes | Current focused opportunity |
| `use_case_ids` | list | Yes | Included use cases |
| `included_paths` | list | Yes | Human-readable package contents |
| `notes` | list | No | Recovery and compatibility notes |

### 13A. SensitiveSupportProfile
Represents an optional local-only support profile for sensitive life or background circumstances.

| Field | Type | Required | Notes |
|---|---|---|---|
| `support_profile_id` | string | Yes | Unique identifier |
| `opportunity_id` | string | Yes | Parent opportunity |
| `enabled` | boolean | Yes | Opt-in only |
| `categories` | enum[] | No | `layoff`, `fired`, `quit_without_notice`, `criminal_history`, `reentry`, `background_concern` |
| `notes` | text | No | Local-only private notes |
| `encouragement_plan` | text | No | Practical next-step coaching |
| `include_in_export` | boolean | Yes | Defaults to false |
| `updated_at` | datetime | Yes | Last update timestamp |

## Canonical Stage Model
Only one primary stage may be active on an opportunity at a time.

| Stage | Description |
|---|---|
| `intake_started` | Opportunity created, minimum info not yet complete |
| `intake_complete` | Required artifacts and profile capture complete |
| `fit_review` | Fit and risk evaluation in progress |
| `positioning` | Story, resume, and narrative refinement in progress |
| `outreach_ready` | Outbound artifacts are in review or approved state |
| `interview_active` | Interview preparation or live interview cycle in progress |
| `debrief_captured` | Post-interview analysis recorded |
| `offer_review` | Offer, level, or compensation review in progress |
| `closed_won` | Opportunity accepted |
| `closed_lost` | Opportunity declined, lost, or closed without success |

These stage names are the platform default, not a permanent limitation. The team may:
- add sub-stages for operational use
- add parallel views for analytics or UX
- map multiple UI states to one canonical stage

The hard requirement is that reporting and automation continue to resolve back to the canonical stage vocabulary or a documented successor vocabulary.

## Stage Transition Rules

| From Stage | To Stage | Allowed | Conditions |
|---|---|---|---|
| `intake_started` | `intake_complete` | Yes | Required intake data and core artifacts are complete |
| `intake_complete` | `fit_review` | Yes | Candidate profile confirmed or reviewed |
| `fit_review` | `positioning` | Yes | Pursue decision is active |
| `fit_review` | `closed_lost` | Yes | Pass decision or opportunity closed |
| `positioning` | `outreach_ready` | Yes | Positioning artifacts reviewed |
| `outreach_ready` | `interview_active` | Yes | Interview scheduled or active |
| `interview_active` | `debrief_captured` | Yes | Interview round completed |
| `debrief_captured` | `interview_active` | Yes | Additional rounds remain |
| `debrief_captured` | `offer_review` | Yes | Offer or comp discussion begins |
| `offer_review` | `closed_won` | Yes | Opportunity accepted |
| `offer_review` | `closed_lost` | Yes | Declined, rejected, or withdrawn |

These are default allowed transitions. The team may support additional transitions, including reopening or returning to earlier stages, if:
- the behavior is documented
- reporting remains interpretable
- blocking approvals are preserved

## Approval States

| Approval State | Meaning |
|---|---|
| `draft` | Generated or created, not yet reviewed |
| `review` | Awaiting user or staff review |
| `approved` | Reviewed and accepted for intended use |
| `rejected` | Explicitly not approved |
| `archived` | No longer active but retained for history |

The team may add more granular approval states such as `changes_requested`, `expired`, or `superseded` if that improves workflow clarity.

## Human Review Rules
The following always require human review before final external use:
- tailored resume outputs
- recruiter or outreach drafts
- offer and compensation recommendations
- any output flagged by a high-risk AI checkpoint

The team may add additional human-review rules by market, account type, policy tier, or use case. These default high-stakes protections should not be reduced without an explicit policy decision.

## AI Checkpoint Triggers
An AI checkpoint must run at minimum:
- after initial artifact intake
- before fit recommendation is shown
- before positioning artifacts are finalized
- before outreach artifacts are marked approved
- after interview debrief ingestion
- before final offer recommendation is shown
- whenever a policy, truthfulness, privacy, accessibility, or legal risk is detected

The team may add checkpoint triggers for enterprise accounts, government deployments, regulated regions, or premium support workflows.

## Required Fields By Stage

### `intake_started`
- `opportunity_id`
- `user_id`
- `company_name`
- `role_title`
- `status`
- at least one initial contact or source indicator

### `intake_complete`
- confirmed `CandidateProfile`
- `resume` artifact or equivalent
- `job_description` artifact or equivalent

### `fit_review`
- at least one `AICheckpoint`
- one `DecisionMemo` of type `fit` or `pursuit`

### `positioning`
- one positioning-related artifact
- review state available

### `outreach_ready`
- one outreach artifact in `review` or `approved`

### `interview_active`
- at least one scheduled or active interview record or prep artifact

### `offer_review`
- comp or offer artifact, note, or equivalent
- one high-stakes AI checkpoint

These are default minimums. Individual use cases may require additional fields or relax non-critical fields if the user journey remains trustworthy and reviewable.

## Reporting Mappings

| KPI | Source Fields |
|---|---|
| Opportunities created | `Opportunity.created_at` |
| Intake completion rate | opportunities with stage `intake_complete` or beyond / opportunities created |
| Fit review completion rate | opportunities with stage `fit_review` or beyond / eligible opportunities |
| Positioning approval rate | approved positioning artifacts / generated positioning artifacts |
| Outreach approval rate | approved outreach artifacts / generated outreach artifacts |
| Interview conversion rate | opportunities reaching `interview_active` / opportunities reaching `outreach_ready` |
| Offer conversion rate | opportunities reaching `offer_review` / opportunities reaching `interview_active` |
| Closed won rate | opportunities with status `closed_won` / closed opportunities |
| AI checkpoint pass rate | checkpoints with `decision` in `proceed`, `proceed_with_warning` / all checkpoints |
| Human override rate | reviewed outputs changed or rejected after AI recommendation / reviewed outputs |
| Escalation rate | `Escalation` count / active opportunities |

The team may add derived metrics or client-specific KPIs so long as the canonical metrics remain computable.

## Local Persistence And Handoff
- Browser localStorage is allowed as convenience persistence.
- Durable recovery should rely on an exported handoff package, not on local browser storage alone.
- Canonical restore data should come from exported JSON, with human-readable Markdown files treated as derivatives.
- Candidate story Markdown should be exported as a first-class handoff artifact.
- Printable PDFs should be generated as human-readable derivatives for candidate stories, lifecycle summaries, correspondence, memos, and reporting summaries.
- Sensitive support data should remain local-only by default and should only enter an export package when the user explicitly enables inclusion.

## Role Ownership Mappings

| Domain | Primary Role |
|---|---|
| Product behavior | Product Lead / AI Product Architect |
| User journey and wizard structure | UX Lead / Service Designer |
| Accessibility requirements | Accessibility Lead |
| User-facing language | UX Writer / Content Designer |
| Opportunity-fit logic | Opportunity Strategist |
| Positioning outputs | Resume And Positioning Architect |
| Domain translation | Autodesk / CAD Domain Translator |
| Interview logic | Technical Interview Coach |
| Offer guidance | Compensation And Offer Analyst |
| Workflow operations | Hiring Process Operator |
| Structured knowledge and evidence | Knowledge Engineer |
| AI runtime and checkpoints | LLM / Agent Engineer |
| Implementation quality | Engineering Lead |
| Release validation | QA / Reliability Lead |
| Security and privacy controls | Security Lead and Privacy Lead |
| Policy and truthfulness rules | Safety / Policy Lead |
| Legal commitments | Legal Counsel |
| Financial commitments | Finance Lead |
| Client onboarding and support | Customer Success / Implementation Lead |

Ownership mappings may be satisfied by one person wearing multiple hats, a fractional operator, or a retained partner. The platform should model roles, not assume a fixed headcount shape.

## AI Escalation Rules
The AI must escalate rather than decide autonomously when:
- a legal commitment is requested
- a security or privacy representation is requested
- an accessibility compliance claim is requested without supporting documentation
- pricing, discounting, or contractual approval is requested outside approved policy
- evidence materially conflicts with a generated recommendation
- the output may encourage user misrepresentation
- high-stakes guidance has weak supporting evidence

## Schema Governance
Changes to this schema should be approved by:
- Product Lead
- Knowledge Engineer
- LLM / Agent Engineer
- UX Lead
- QA / Reliability Lead

Security, privacy, accessibility, legal, and finance owners must be consulted if changes affect their controlled domains.

## Preferred Exception Path
If the team wants to depart from this schema, the preferred path is:
1. document the desired change
2. explain why the current default is too rigid or incomplete
3. identify the reporting, AI, and policy impact
4. update this schema or create an approved extension note

## Implementation Notes
- Teams may normalize this schema differently in storage than in the UI.
- The user experience may combine or hide fields that remain required in the backend model.
- The AI may reason over richer internal structures than are exposed to users, as long as user-visible decisions remain explainable.
- The initial implementation should optimize for clarity and evolvability rather than perfect upfront normalization.

## Open Decisions
- Should `Opportunity` remain the universal entity name if Monyawn expands beyond hiring workflows?
- Should review state and artifact approval be separated into different objects?
- Should confidence be stored as labels, percentages, or internal scores plus display labels?
- Should stage events be append-only, or should some be synthesized from state changes?
- Should enterprise deployments support configurable stage vocabularies mapped to canonical stages?

## Relationship To Use Cases
Each use case may add:
- extra fields
- extra specialist roles
- stage-specific artifacts
- domain-specific evaluation criteria

Each use case should not change:
- canonical entity names without strong justification
- global approval semantics
- core escalation logic
- role-based authority boundaries

## Summary
This schema gives Monyawn one operating backbone for data capture, workflow progression, AI determinations, reporting, and escalation. If a template, screen, or agent design conflicts with this schema, the conflict should be resolved here rather than patched ad hoc elsewhere.
