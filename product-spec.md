# Product Spec

## Product Name
Monyawn Opportunity Management Wizard

## Domain
`www.monyawn.com`

## Product Summary
Monyawn Opportunity Management Wizard is an AI-native, accessibility-first story framework wizard that helps a user evaluate, position for, pursue, and decide on a job opportunity through a guided sequence of steps.

The product should not feel like a generic dashboard website. It should feel like a calm, structured, high-trust public-service workflow that supports zero-knowledge users without making them decode the process themselves.

Monyawn is intended to evolve into a reusable AI-native SaaS or AGaaS platform for opportunity management, career decisioning, and guided work-transition workflows. The SBS material in this repository should be treated as an initial codification use case, not the long-term boundary of the product.

## Source Inputs
This specification is derived from:
- [README.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/README.md)
- [01-panel-of-experts.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/01-panel-of-experts.md)
- [03-raci-by-phase.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/03-raci-by-phase.md)
- [04-screen-ownership-map.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/04-screen-ownership-map.md)

## Problem Statement
The current repository is a strong decision-support knowledge pack, but it is not yet a runnable product. Zero-knowledge users still need to interpret the documents, sequence their own steps, and translate expert guidance into action.

The product must convert the document pack into a guided application that:
- leads users through the opportunity lifecycle step by step
- makes expert reasoning visible and grounded
- preserves truthfulness and human oversight
- works reliably in real browser and device conditions
- is highly accessible for a broad range of users
- can generalize from a single opportunity workflow into a reusable platform model

## Product Goals

### Primary goals
- Guide zero-knowledge users through a full opportunity-management workflow
- Translate expert knowledge into a usable wizard experience
- Reduce cognitive load by presenting one primary task per screen
- Make AI recommendations reviewable, editable, and evidence-backed
- Provide strong accessibility and production-grade reliability
- Establish Monyawn as a reusable platform for broader AI-native opportunity and career workflows

### Secondary goals
- Support expert users with secondary review surfaces
- Preserve reusable artifacts across stages
- Make progress resumable across sessions and devices
- Provide inspectable reasoning and confidence signals
- Create a product architecture that can expand into multi-opportunity and multi-tenant use cases

### Non-goals
- A broad job-search CRM for dozens of opportunities at once
- A marketing-first website experience
- Fully autonomous outbound messaging without user approval
- Hidden or unexplained AI decision-making
- A product identity tied only to the SBS opportunity

These non-goals describe the current direction, not permanent limitations. The team may revisit them if market learning justifies a documented change.

## Target Users

### Primary user
A zero-knowledge or low-confidence job seeker who needs a guided path to:
- understand whether to pursue an opportunity
- position existing experience honestly
- prepare for interviews
- assess compensation and final decision tradeoffs

### Secondary user
A more experienced user who wants:
- a faster review mode
- editable artifacts
- evidence inspection
- stage-specific expert guidance

### Future platform users
- enterprises supporting internal mobility or guided career workflows
- staffing and talent organizations
- universities and workforce programs
- managed-service operators using an AGaaS delivery model

## Product Principles
- Guided by default
- Accessible by default
- Truthful by default
- One primary action per screen
- Evidence before confidence
- Save and resume always available
- Human review for high-stakes outputs
- Strong defaults with room for governed product evolution

## Experience Model
The default product experience is a story framework wizard.

The wizard should:
- move in a clear linear sequence
- allow backtracking without penalty
- allow save and resume later
- present one major decision or action per screen
- use large headings and plain language
- avoid dense dashboard clutter for first-run users

Secondary expert views may exist, but they must not replace the guided default path.

The first implementation in this repository is opportunity-focused, but the experience model should be designed so Monyawn can later support adjacent guided workflows without changing the product philosophy.

The team may introduce alternative modes, such as expert review mode, admin review mode, or organization-sponsored mode, as long as guided mode remains the primary first-run experience.

The platform should support multiple opportunities per user or account by default. The guided UI may still focus on one selected opportunity at a time, but the underlying operating model should not assume a single-opportunity product.

## Core User Journey

### Phase 1: Start opportunity
The user starts a new opportunity and understands the overall path.

### Phase 2: Intake
The user uploads a resume, job description, and any supporting notes.

### Phase 3: Fit review
The system analyzes fit, strengths, risks, and recommendation quality.

### Phase 4: Positioning
The system helps the user build a truthful story, tailored resume, and role-aligned framing.

### Phase 5: Outreach
The system drafts messages and follow-up language, but requires user approval before use.

### Phase 6: Interview preparation
The system prepares the user by round, captures debriefs, and adapts future prep.

### Phase 7: Offer decision
The system reviews compensation, level, title, and tradeoffs before the final decision.

## Functional Requirements

### 1. Opportunity creation
- The system must allow a user to create a new opportunity.
- The system must capture at minimum a role title, company name, and creation date.
- The system should allow resume and job description upload at creation time or later.
- The architecture should support multiple opportunities per user or account as a normal operating mode.

### 2. Guided wizard flow
- The system must present a progress-based wizard as the default mode.
- The system must show the current step, previous steps, and remaining steps.
- The system must support back, next, save, and resume actions.
- The system must preserve partial progress without requiring full completion.

### 3. Source artifact intake
- The system must support upload of source artifacts including resume and job description.
- The system should support additional artifacts such as recruiter emails, interview notes, and compensation notes.
- The system must provide recoverable upload error states.
- The system must let users confirm or correct extracted data.
- The system should parse locally available text for names, emails, phones, companies, dates, times, interview cues, and related correspondence signals.

### 4. Fit assessment
- The system must generate an opportunity fit review.
- The fit review must identify strengths, risks, evidence, and confidence.
- The system must support a pursue, pass, or defer recommendation.
- The system must allow the user to inspect why the recommendation was made.

### 5. Positioning story builder
- The system must guide users through role positioning step by step.
- The system must produce tailored narrative outputs such as summary language, proof points, and resume guidance.
- The system must distinguish sourced facts from generated framing.
- The system must not fabricate unsupported experience.
- The system must support a candidate story artifact that explains who, what, why, where, when, and how using lifecycle evidence.
- The candidate story must be editable, regenerable, and exportable in Markdown during local-only use.

### 6. Resume and artifact review
- The system must provide reviewable outputs before they are treated as final.
- The system must allow user edits and approval.
- The system should preserve revision history for generated artifacts.

### 7. Outreach support
- The system must generate draft outreach content such as recruiter messages and follow-ups.
- The system must require human review before any outreach output is considered final.
- The system must clearly mark drafts as drafts.

### 8. Interview preparation
- The system must support interview-stage-specific preparation.
- The system should generate question banks, round-specific prep, and talking points.
- The system must support post-round debrief capture.
- The system should adapt later prep based on earlier interview concerns.

### 8A. Contextual coaching and glossary support
- The system must support optional stage-aware coaching within the existing lifecycle screens.
- The system must support a glossary of terms relevant to the current stage.
- The system should provide business lifecycle and document/process guidance tied to the current industry context.
- The system should provide compensation-stack education without forcing the user to engage with coaching.
- Coaching surfaces must remain skippable and hidden by default.

### 8B. Sensitive support and wellness paths
- The system should support opt-in local-only guidance for layoffs, firing, quitting without notice, criminal-history or re-entry concerns, and related background barriers.
- The system must not require disclosure of sensitive support data during standard onboarding.
- The system must exclude sensitive support data from export unless the user explicitly enables inclusion.
- Sensitive support guidance should be supportive, practical, and non-judgmental.

### 9. Offer support
- The system must support compensation and offer review.
- The system must help compare title, level, comp, and trajectory tradeoffs.
- The system must require explicit review on high-stakes recommendations.

### 10. Evidence explorer
- The system must provide an evidence view for generated recommendations.
- The evidence view must show source artifacts or structured evidence references.
- The system should show confidence alongside rationale.

### 11. Save, resume, and history
- The system must save wizard progress.
- The system must allow a user to resume where they left off.
- The system should preserve stage history and important decisions.
- The system should support durable local handoff through an export package when local browser storage is not sufficient.
- The export package should include canonical JSON plus human-readable Markdown and printable PDF artifacts for key lifecycle outputs.

## Accessibility Requirements
- The product must support keyboard-only completion of the core wizard.
- The product must include visible focus states for all interactive controls.
- The product must support screen reader landmarks, labels, and announcement of errors and progress.
- The product must remain usable at 200 percent zoom.
- The product must avoid horizontal scrolling on supported mobile devices.
- The product must use readable typography and strong contrast.
- The product must use plain language suitable for zero-knowledge users.

## AI And Policy Requirements
- AI outputs must be evidence-backed where possible.
- AI outputs must display confidence signals.
- AI outputs must distinguish between evidence, inference, and recommendation.
- The system must not fabricate unsupported claims or skill depth.
- The system must require human review for:
- resume approval
- outreach drafts
- offer and compensation guidance
- The system should escalate when confidence is low or evidence is weak.

## Design Requirements
- The default visual model must feel like a guided civic or public-service workflow, not a marketing website.
- Each screen must have one primary focus.
- The interface must emphasize readability, clarity, and calm progression.
- Dense dashboard views must be secondary to the guided path.
- Jargon-heavy expert language must be avoided on primary user screens.

## Screen Requirements

### Required screens
- Welcome / Start Opportunity
- Guided Intake Overview
- Upload Resume and Job Description
- Candidate Profile Check
- Opportunity Fit Review
- Pursue or Pass Decision
- Positioning Story Builder
- Resume Review and Approve
- Outreach Draft Review
- Interview Prep Dashboard
- Interview Round Prep
- Debrief Capture
- Offer Review
- Final Recommendation
- Evidence Explorer
- Save / Resume and History

These screens define the default reference flow. The team may merge, split, rename, or reorganize screens if the resulting experience remains accessible, reviewable, and aligned to the same core user journey.

### Screen behavior requirements
- Every screen must have a clear title.
- Every screen must have one obvious primary action.
- Every screen must support back and next behavior where applicable.
- Every AI-assisted screen must expose rationale and evidence.

## Data Requirements
The system must define and persist the following core entities:
- `Opportunity`
- `CandidateProfile`
- `SourceArtifact`
- `Stage`
- `PanelOpinion`
- `Risk`
- `DecisionMemo`
- `PositioningAsset`
- `InterviewRound`
- `Debrief`
- `CompScenario`
- `WorkflowTask`
- `PolicyRule`
- `EvaluationResult`

The initial schema may be scoped to a single-user or single-opportunity workflow, but it should be designed so it can expand into a multi-tenant SaaS or AGaaS platform without requiring a full conceptual rewrite.

## Technical Requirements
- The product must be implemented as a resumable multi-step application.
- The system must persist state across sessions.
- The system must support structured retrieval of source artifacts and prior outputs.
- The system must support phase-based orchestration of specialist logic.
- The system should keep business logic and content schemas separate from presentation code.
- The system should be designed for future multi-tenant deployment under the Monyawn platform.
- The current implementation should treat browser localStorage as convenience persistence, not as the only durable retention path.
- The current implementation should support an exportable local handoff package with canonical JSON and human-readable derivatives.

The exact implementation stack, agent architecture, and storage model are intentionally not fixed by this document. The team should choose them based on reliability, accessibility, cost, and maintainability.

## Quality Requirements

### Browser and device proof
Before release, the system must be validated in:
- Chrome
- Safari
- Edge
- Firefox
- iPhone Safari
- Android Chrome

### Assistive technology proof
Before release, the system must be validated for:
- keyboard-only completion
- VoiceOver review path
- NVDA review path

### Usability proof
Before release, the system must be tested with zero-knowledge users completing a first-run flow without live coaching.

### Reliability proof
Before release, the system must prove:
- no silent loss of in-progress state
- safe save and resume behavior
- recoverable handling of slow network conditions

## Acceptance Criteria

### MVP acceptance
- A user can create an opportunity and complete the guided flow from intake through fit review.
- A user can review generated outputs with evidence and confidence.
- A user can save, leave, and resume without losing progress.
- A keyboard-only user can complete the primary flow.
- Core screens work on desktop and mobile without blocking layout issues.

### Production-readiness acceptance
- Human review gates are active for high-stakes outputs.
- Browser and device validation is complete.
- Screen reader validation is complete.
- Zero-knowledge usability testing shows the flow is understandable without facilitator intervention.
- Safety rules prevent unsupported claim generation in core artifact flows.

## Delivery Priorities

### Priority 1
- Wizard shell and progress model
- Source artifact intake
- Candidate profile extraction and correction
- Fit review with evidence and confidence
- Save and resume

### Priority 2
- Positioning story builder
- Resume review workflow
- Outreach draft review
- Evidence explorer

### Priority 3
- Interview prep and debrief system
- Offer review and final recommendation
- History and expert secondary views

### Priority 4
- Platform generalization for non-SBS workflows
- multi-opportunity support
- account and tenant model
- operational support for SaaS or AGaaS delivery

## Dependencies
- Structured content extraction from the existing markdown repository
- Defined data model for workflow stages and artifacts
- Accessibility review from the start of design
- QA test matrix for browser and device proof
- Safety and human-review policy implementation

## Risks
- The team may drift back toward a dashboard-first website model.
- Accessibility may be treated as validation instead of design input.
- AI recommendations may feel authoritative without enough visible evidence.
- The wizard may become too rigid if branching and recovery are not designed carefully.
- Save and resume may be underbuilt even though it is central to user trust.

## Open Questions
- Will the first version support only one opportunity at a time or a small list of opportunities?
- How much artifact editing happens inline versus in dedicated editors?
- What confidence scale should be shown to users?
- Which outputs must always require human approval versus advisory review?
- What admin tooling is required in v1 for policy and evaluation monitoring?
- Which parts of the workflow should be configurable by enterprise customers without breaking the core model?
- How much per-region policy variation is needed before launch?
- Which functions are staffed directly versus fulfilled through fractional or partner support?

## Success Measures
- First-run completion rate for zero-knowledge users
- Resume and fit-review approval rate
- Drop-off rate by wizard step
- Save/resume return rate
- Accessibility defect count at release
- Production browser/device pass rate
- User trust score for AI recommendations

## Summary Requirement
The product must behave like a trustworthy guided decision system. If there is a tradeoff between adding more interface surface area and preserving a calm, accessible, reviewable wizard flow, the wizard flow wins.

The Monyawn brand should represent the reusable platform. The SBS opportunity materials in this repository should be treated as the first proof-of-concept workflow that validates the product model.
