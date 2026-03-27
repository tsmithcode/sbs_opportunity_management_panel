# Platform Roadmap

## Purpose
This document defines the phased execution roadmap for Monyawn from documentation system to AI-native platform.

It is intended to help the company, staff, and AI system align on:
- what gets built first
- what dependencies must be satisfied
- what is required for product, trust, and enterprise readiness
- what should remain flexible while the platform is still learning

## Roadmap Principles
- build the operating backbone before scaling surface area
- guided workflow quality matters more than feature count
- trust and governance must keep pace with product capability
- accessibility is a release requirement, not a polish task
- enterprise readiness should be earned, not assumed

## Current State
Monyawn now has:
- product direction
- workflow schema
- agent architecture
- org and decision authority model
- policy drafts
- trust-center index
- SBS reference use case
- operational templates

What it does not yet have:
- a working product implementation
- production validation
- reviewed public legal and compliance materials
- formal enterprise operating proof

## Roadmap Phases

## Phase 1: Foundation Completion
Goal: make the operating model internally coherent and implementation-ready.

### Objectives
- connect all platform docs into one build-ready system
- remove ambiguity in core entities, stages, and policy references
- create a reusable base for future use cases

### Key Deliverables
- final review pass on product spec, workflow schema, and agent architecture
- link policy docs from org and trust-center docs where needed
- create a canonical field dictionary if more precision is required
- create a use-case template starter for future onboarding

### Exit Criteria
- no core doc contradicts another
- AI authority model maps cleanly to policy docs
- platform team can implement from the current documentation set

## Phase 2: Product MVP
Goal: build the first working Monyawn wizard using the SBS use case.

### Objectives
- implement the guided wizard shell
- support intake, fit review, positioning, and save/resume
- establish evidence-backed AI checkpoints
- create a usable first-run experience for zero-knowledge users

### Key Deliverables
- opportunity creation flow
- intake and candidate profile confirmation
- fit review screen with rationale and confidence
- positioning story builder
- review and approval states
- save/resume support

### Exit Criteria
- a user can complete the core SBS workflow through positioning
- AI checkpoint records are persisted
- browser and mobile baseline validation passes

## Phase 3: Full Opportunity Workflow
Goal: complete the end-to-end SBS use case.

### Objectives
- extend MVP into outreach, interview, debrief, and offer flows
- complete the decision-support lifecycle
- implement escalation and review paths for high-stakes outputs

### Key Deliverables
- outreach review workflow
- interview prep and debrief workflows
- offer analysis flow
- final recommendation flow
- decision and escalation logging

### Exit Criteria
- user can run a full opportunity from intake through final decision
- all high-stakes outputs enforce review gates
- reporting works across the full lifecycle

## Phase 4: Trust And Enterprise Readiness
Goal: make Monyawn credible for organizational adoption.

### Objectives
- mature trust-center materials
- convert policy drafts into reviewed external-facing versions where needed
- prepare procurement, support, and security response materials

### Key Deliverables
- reviewed public policy set
- enterprise diligence packet
- subprocessor and incident handling materials if applicable
- support model and escalation commitments
- enterprise implementation runbook

### Exit Criteria
- enterprise buyers can complete an initial diligence cycle without ad hoc scrambling
- the AI can safely defer to documented company positions

## Phase 5: Multi-Use-Case Platformization
Goal: make Monyawn reusable beyond SBS.

### Objectives
- prove that the platform can onboard additional use cases cleanly
- separate platform logic from use-case-specific logic
- reduce SBS-specific assumptions in product implementation

### Key Deliverables
- at least one new use case onboarded into `use-cases/`
- reusable use-case intake and setup flow
- configurable specialist routing or policy overlays
- account-level or tenant-level configuration model

### Exit Criteria
- new use cases can be added without restructuring core platform documents
- platform terminology holds outside the SBS context

## Phase 6: Enterprise And Global Expansion
Goal: support enterprise deployments, organizational governance, and region-aware growth.

### Objectives
- support multi-account and organization-sponsored workflows
- harden role-based approvals and policy overlays
- prepare for region-specific requirements

### Key Deliverables
- tenant-aware or account-aware controls
- expanded reporting and operational dashboards
- configurable approvals and review gates
- region-aware policy and support overlays
- government-readiness path if pursued

### Exit Criteria
- enterprise and organizational customers can run governed workflows
- the product supports multiple accounts or deployment types without architectural confusion

## Cross-Cutting Workstreams

## Product And UX
- preserve guided-first experience
- validate zero-knowledge usability
- support expert and admin secondary views without breaking onboarding

## AI And Workflow Quality
- tune checkpoint quality
- improve evidence display
- monitor human override rates
- refine escalation thresholds

## Accessibility And QA
- run keyboard and screen-reader testing continuously
- test real browser and mobile behavior
- treat accessibility regressions as release blockers for core flows

## Trust And Policy
- review and update policy docs as features mature
- align product behavior with published company positions
- avoid unsupported market claims

## Data And Reporting
- keep reporting mappable to canonical schema
- avoid metric drift across use cases
- instrument product behavior for operational learning

## Suggested Milestone Order
1. Foundation completion
2. SBS wizard MVP
3. End-to-end SBS workflow
4. Trust-center maturity
5. Multi-use-case onboarding
6. Enterprise and global expansion

## Known Risks
- documentation may outrun product reality
- the team may overbuild enterprise posture before proving core product value
- use-case expansion may happen before the first use case is operationally solid
- accessibility may get deferred under implementation pressure
- AI workflows may become harder to explain as more specialists are added

## Risk Mitigations
- tie roadmap gates to working demos and validation, not just docs
- require production-like proof before claiming readiness
- add new use cases only after the first use case is structurally sound
- keep policy claims conservative until reviewed
- monitor where human overrides cluster and use that to refine the system

## Open Decisions
- when should Monyawn move from SBS-first to multi-use-case product messaging
- what is the right enterprise-readiness threshold before active outbound sales
- which platform capabilities should be configurable by account versus fixed globally
- when should AGaaS offerings be layered on top of SaaS
- how early should government procurement readiness be prioritized

## Recommended Immediate Next Steps
1. choose whether the next workstream is product implementation or enterprise-sales packaging
2. if product implementation is next, scaffold the wizard application
3. if enterprise packaging is next, create an enterprise sales playbook and buyer packet checklist
4. keep policy and trust docs synchronized with real implementation progress

## Summary
Monyawn should move in phases: foundation, working product, full workflow, trust maturity, platformization, then enterprise-scale expansion. The strongest discipline now is to keep the company honest about what is designed, what is implemented, and what is truly ready for customers.
