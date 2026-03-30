# Agent Architecture

## Purpose
This document defines how Monyawn should structure its AI runtime so the product can operate as a guided, evidence-aware, human-reviewable system.

It connects:
- the product spec
- the workflow schema
- the company org structure and AI decision authority model
- use-case-specific expert logic

This is a platform architecture document. The SBS use case is the reference implementation, but the architecture should support future use cases without requiring a redesign of the AI operating model.

## Design Goals
- preserve a calm guided experience for zero-knowledge users
- route work to the right specialist logic at the right time
- keep AI outputs evidence-aware and reviewable
- support human review and escalation for high-stakes actions
- allow future expansion into SaaS and AGaaS operating modes

## Architecture Principles
- orchestration first, not chatbot first
- role-based decisioning, not freeform opinion generation
- evidence before recommendation
- policy before automation
- review before high-stakes external action
- configurable by use case, governed at the platform layer

## Runtime Layers

### 1. Experience Layer
This is what the user interacts with.

Responsibilities:
- wizard steps
- progress state
- user prompts
- review screens
- evidence display
- approval actions

Primary owners:
- Product Lead
- UX Lead
- Frontend Engineer
- UX Writer

### 2. Orchestration Layer
This is the traffic director of the system.

Responsibilities:
- decide which agent or expert logic to invoke
- trigger AI checkpoints
- enforce stage and policy rules
- manage retries, pauses, and resumptions
- route escalations to human or policy authority
- decide when optional coaching, glossary, or business-context help should be made available without interrupting the main flow

Primary owners:
- LLM / Agent Engineer
- Backend / Workflow Engineer
- Product Lead

### 3. Knowledge And Evidence Layer
This is the grounding system.

Responsibilities:
- retrieve source artifacts
- map structured evidence to decisions
- maintain use-case logic references
- attach rationale and confidence context to outputs
- supply local curated coaching packs, glossary terms, and document/process context for the active stage when requested

Primary owners:
- Knowledge Engineer
- Opportunity Strategist or relevant use-case domain expert

### 4. Policy And Governance Layer
This is the control surface for acceptable behavior.

Responsibilities:
- enforce truthfulness rules
- block unsupported claims
- require human review where needed
- route legal, privacy, security, accessibility, and finance issues correctly

Primary owners:
- Safety / Policy Lead
- Legal Counsel
- Privacy Lead
- Security Lead
- Accessibility Lead

### 5. Human Review Layer
This is the explicit approval system.

Responsibilities:
- approve or reject high-stakes outputs
- resolve escalations
- correct AI overreach or weak recommendations
- close decision checkpoints

Primary owners:
- user
- designated staff reviewer
- function owner defined in the org structure

## Primary Runtime Components

### 1. Workflow Orchestrator
The central runtime service that:
- reads workflow state
- triggers the appropriate specialist logic
- enforces stage transitions
- initiates AI checkpoints
- records events and decisions

This should be the authoritative coordinator for the product flow.

### 2. Specialist Agents
These are role-oriented agent modules or services.

Default specialist set:
- `opportunity_strategist_agent`
- `positioning_architect_agent`
- `domain_translator_agent`
- `process_operator_agent`
- `interview_coach_agent`
- `offer_analyst_agent`
- `retrieval_agent`
- `evaluation_agent`
- `policy_guard_agent`

These may be implemented as:
- distinct prompts
- internal services
- modular tools
- policy-controlled workflows

They do not need to be separate infrastructure units as long as their role boundaries remain clear.

### 3. Retrieval And Evidence Service
This service:
- indexes source artifacts
- retrieves relevant evidence
- links outputs to source support
- supports explanation views

### 4. Checkpoint Engine
This service:
- evaluates readiness at key workflow steps
- records determinations in the canonical `AICheckpoint` structure
- decides whether to proceed, warn, pause, escalate, or block

### 5. Review And Approval Service
This service:
- assigns review tasks
- captures approvals and rejections
- enforces review requirements before external use
- records overrides and reviewer identity

### 6. Escalation Router
This service:
- maps issues to the correct role owner
- applies the company decision authority model
- records escalation events and outcomes

## Agent Roles

### `opportunity_strategist_agent`
Purpose:
- assess fit
- identify risks and strengths
- recommend pursue, pass, or defer

Inputs:
- opportunity metadata
- candidate profile
- job description
- prior stage outputs

Outputs:
- fit memo
- risk summary
- recommendation

### `positioning_architect_agent`
Purpose:
- generate truthful role-positioning language
- structure proof points
- support resume tailoring

Outputs:
- positioning narrative
- story pack
- resume guidance

### `domain_translator_agent`
Purpose:
- translate prior experience into use-case-specific language
- identify adjacent relevance and gaps

Outputs:
- domain mapping
- terminology alignment
- gap narrative

### `process_operator_agent`
Purpose:
- manage stage hygiene
- create tasks and reminders
- support outreach sequence logic

Outputs:
- workflow tasks
- follow-up recommendations
- stage progression signals

### `interview_coach_agent`
Purpose:
- prepare the user by round
- adapt preparation after debriefs

Outputs:
- prep packs
- question banks
- concern summaries

### `offer_analyst_agent`
Purpose:
- analyze comp, title, level, and tradeoffs
- support final decision framing

Outputs:
- comp scenarios
- decision support memo
- negotiation guidance

### `retrieval_agent`
Purpose:
- find and rank relevant source evidence
- make downstream outputs more grounded

Outputs:
- evidence bundles
- citations or source references

### `evaluation_agent`
Purpose:
- score output quality
- identify weak evidence or internal inconsistency

Outputs:
- evaluation results
- warning flags
- improvement recommendations

### `policy_guard_agent`
Purpose:
- inspect outputs for policy, truthfulness, accessibility, legal-adjacent, privacy, or security issues

Outputs:
- policy pass / fail decision
- escalation recommendation
- review requirement flag

## Orchestration Model

### Default pattern
1. user completes a wizard step
2. workflow state is updated
3. orchestrator determines whether a checkpoint is required
4. retrieval gathers relevant evidence
5. one or more specialist agents run
6. evaluation and policy checks run
7. result is shown, paused, or escalated
8. review tasks are created if required

### Phase-based routing for the SBS use case
- intake: `retrieval_agent`, `policy_guard_agent`
- fit review: `opportunity_strategist_agent`, `domain_translator_agent`, `evaluation_agent`
- positioning: `positioning_architect_agent`, `domain_translator_agent`, `policy_guard_agent`
- outreach: `process_operator_agent`, `positioning_architect_agent`, `policy_guard_agent`
- interview: `interview_coach_agent`, `evaluation_agent`
- offer: `offer_analyst_agent`, `opportunity_strategist_agent`, `policy_guard_agent`

This routing is a strong default, not a permanent lock.

## Checkpoint Architecture

### Required checkpoint types
- intake completeness checkpoint
- fit recommendation checkpoint
- positioning truthfulness checkpoint
- outreach approval checkpoint
- debrief assimilation checkpoint
- offer recommendation checkpoint
- policy escalation checkpoint

### Checkpoint decision outputs
- proceed
- proceed with warning
- pause for user input
- escalate for human review
- block

### Checkpoint inputs
- current stage
- current step
- evidence bundle
- relevant artifacts
- prior decisions
- active policies
- account type or use-case constraints when applicable

## Review Architecture

### User review
The user must review:
- tailored resume outputs
- outreach drafts
- offer recommendations
- any output the system marks for direct human confirmation

### Staff review
Staff review may be required for:
- enterprise account escalations
- government procurement outputs
- policy or truthfulness risk
- contract or pricing questions
- accessibility, privacy, or security claims

### Review outcomes
- approve
- reject
- request changes
- escalate

## Escalation Architecture

The escalation router should use role-based rules from the org structure document.

Examples:
- legal commitment -> Legal Counsel
- privacy commitment -> Privacy Lead
- security representation -> Security Lead
- accessibility compliance claim -> Accessibility Lead
- pricing exception -> Finance Lead
- support commitment outside policy -> Customer Success Lead

The AI should not improvise commitments when escalation is required.

## Human And AI Boundary Rules

### AI can do
- analyze evidence
- draft recommendations
- surface risks
- prepare structured outputs
- recommend next steps
- trigger review or escalation

### AI cannot finalize alone
- contract acceptance
- legal or regulatory representations
- pricing exceptions
- accessibility conformance claims not documented in policy
- privacy commitments not documented in policy
- security certifications or guarantees not documented in policy
- final external use of high-stakes user artifacts without required review

## Memory And State

### Short-lived state
- current screen inputs
- unsaved user edits
- active UI state

### Persistent workflow state
- opportunity record
- stage
- tasks
- artifacts
- checkpoints
- decisions
- escalations

### Historical state
- prior revisions
- prior approvals
- reporting snapshots
- closed outcome summaries

The exact technical implementation is flexible, but the distinction between transient interaction state and auditable workflow state should remain clear.

## Multi-Tenant And Global Considerations
- account type may affect checkpoint rules
- region may affect privacy, support, and compliance behavior
- government workflows may require stricter review and approval logic
- organization-sponsored users may require different visibility and audit controls

The architecture should support policy overlays rather than hardcoding every account type into the core logic.

## Observability
The runtime should record:
- agent invocations
- checkpoint outcomes
- review actions
- overrides
- escalations
- stage transitions
- user save/resume behavior

This supports:
- reporting
- debugging
- trust analysis
- quality improvement
- enterprise audit needs

## Failure And Recovery Model

The platform should handle:
- missing artifacts
- weak or conflicting evidence
- partial save states
- agent timeout or service failure
- failed parsing
- user abandonment and return

Default recovery actions:
- pause and ask for user input
- retry non-destructive steps
- downgrade to warning instead of overconfident output
- escalate when risk is high

## Governance And Change Management
Changes to agent behavior should be reviewed by:
- Product Lead
- LLM / Agent Engineer
- Knowledge Engineer
- Safety / Policy Lead
- QA / Reliability Lead

Consult additional owners when changes affect:
- accessibility
- privacy
- security
- legal commitments
- enterprise support commitments

## Open Decisions
- how many specialist agents should be visibly distinct in the product versus hidden behind orchestration
- whether some specialists should be implemented as deterministic workflows rather than freeform LLM steps
- how much of the explanation layer should be generated versus template-driven
- whether account-specific policies should be stored as overlays, profiles, or rule bundles
- whether evaluation runs synchronously in the user flow or asynchronously with review alerts

## Summary
Monyawn should operate as a governed orchestration system, not just a chat interface. The architecture should preserve user trust, evidence grounding, human review, and role-based authority while remaining flexible enough to support new use cases, enterprise deployment patterns, and future platform evolution.
