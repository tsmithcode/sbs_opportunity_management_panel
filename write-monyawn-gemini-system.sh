#!/usr/bin/env bash
set -euo pipefail

ROOT="${PWD}"

mkdir -p \
  "$ROOT/.gemini/context" \
  "$ROOT/.gemini/commands"

cat > "$ROOT/GEMINI.md" <<'EOF'
# Monyawn Project Memory

@./.gemini/context/01-product-truth.md
@./.gemini/context/02-brand-and-positioning.md
@./.gemini/context/03-architecture-and-constraints.md
@./.gemini/context/04-panel-and-decision-authority.md
@./.gemini/context/05-delivery-governance-and-quality.md
@./.gemini/context/06-readme-and-docs-alignment.md
EOF

cat > "$ROOT/.gemini/context/01-product-truth.md" <<'EOF'
# Product Truth

## What Monyawn Is
Monyawn is a local-first, AI-native decision-support platform for career progression.
It helps users move from ambiguity -> clarity -> action -> outcome.

It is not a generic content platform.
It is not a dashboard-first vanity app.
It is not a cloud-first data sink in this MVP stage.

## Current Product Shape
Treat the current repository and README as real implementation truth unless the user explicitly changes direction.
The current product shell already supports:
- local-first workflows
- multi-opportunity model
- structured handoff artifacts
- ZIP import/export
- session.json restore authority
- Markdown and PDF derivative outputs
- governance overlays and review flows

## MVP Direction
This stage is enhancement-oriented.
Do not wipe out the current solution.
Do not propose greenfield rewrites unless explicitly requested.
Default posture:
- preserve working flows
- improve structure
- improve clarity
- improve polish
- improve governance
- improve upgrade path

## Core User Outcome
Every major feature or screen must answer:
1. What decision is the user making?
2. What information reduces uncertainty?
3. What action moves the user forward?
4. What artifact or state proves progress?

If a proposal does not improve decision quality, workflow guidance, trust, or execution clarity, deprioritize it.

## Non-Negotiables
- local-first by default
- no backend persistence unless explicitly approved
- no cloud sync unless explicitly approved
- export/import lifecycle is part of product truth
- preserve multi-opportunity model
- preserve handoff packaging model
- preserve governance, review, and premium enterprise positioning surfaces
EOF

cat > "$ROOT/.gemini/context/02-brand-and-positioning.md" <<'EOF'
# Brand and Positioning

## Brand Thesis
Building Monyawn in public during interview season.

Monyawn is a more guided path from raw ambition to real opportunity.
It is focused on career decision support:
- resume improvement
- role alignment
- vocabulary building
- compensation visibility
- career progression insight
- communication templates
- guided decision workflows

The name carries cultural familiarity and a product thesis:
make access to better outcomes feel more understandable, more guided, and more achievable.

## Brand Intent
Monyawn should help determined people who may have talent and discipline but lack:
- guidance
- language
- structure
- decision support
- packaging quality

## Experience Standard
The product should feel:
- guided, not chaotic
- premium, not gimmicky
- culturally aware, not forced
- credible to recruiters, hiring managers, operators, executives, and investors
- serious enough for enterprise review
- supportive enough for an individual user under pressure

## Narrative Standard
When writing or rewriting copy, README content, prompts, or feature descriptions:
- keep the conviction
- reduce vagueness
- avoid hype unsupported by current implementation
- map claims to actual system behavior
- prefer precise product language over poetic ambiguity
EOF

cat > "$ROOT/.gemini/context/03-architecture-and-constraints.md" <<'EOF'
# Architecture and Constraints

## Preserve Existing Solution
Enhance the current solution.
Do not wipe out current architecture.
Do not replace working implementation with trendy rewrites.

## Default Technical Posture
Assume the current implementation stack remains the baseline unless explicitly directed otherwise.
Prefer incremental improvement over stack churn.

## Architectural Guardrails
- preserve local-first posture
- preserve import/export handoff model
- preserve current data restore authority assumptions
- preserve current testing posture and strengthen it incrementally
- preserve current repo truth and keep code/docs aligned
- preserve current premium/governance positioning surfaces if they already exist

## What Requires Explicit Approval
Do not introduce these without explicit approval:
- hosted backend
- cloud database
- forced auth dependency
- sync engine
- full design framework rewrite
- large component framework migration
- destructive schema reset
- repo-wide folder churn not justified by ROI

## Improvement Preference Order
1. information architecture
2. design system consistency
3. UX clarity and workflow guidance
4. performance and accessibility
5. testing and validation hardening
6. docs and README clarity
7. premium enterprise narrative alignment
8. optional future architecture extension points

## Native Feel Standard
Target:
- iOS-grade polish and feedback discipline
- Microsoft desktop-grade clarity, density, and efficiency
- cross-platform consistency without making desktop feel like a stretched phone UI
EOF

cat > "$ROOT/.gemini/context/04-panel-and-decision-authority.md" <<'EOF'
# Panel of Experts and Decision Authority

Use this panel for major product and implementation decisions:

1. Founder / CEO
   - brand intent
   - public narrative
   - investor visibility
   - platform thesis

2. CTO / Principal Platform Architect
   - architecture boundaries
   - scalability path
   - technical debt control
   - repo structure

3. CPO / Principal Product Strategist
   - product scope
   - MVP discipline
   - decision-support workflows
   - user outcomes

4. Staff UX Architect
   - user flows
   - progressive disclosure
   - guided interaction design
   - cognitive load reduction

5. Design Systems Lead
   - component consistency
   - tokens
   - spacing
   - hierarchy
   - cross-platform visual language

6. iOS / Mobile Experience Specialist
   - native feel
   - motion
   - gesture behavior
   - App Store readiness implications

7. Microsoft Desktop UX Specialist
   - dense workflows
   - data-heavy interaction patterns
   - keyboard and productivity standards
   - enterprise clarity

8. Accessibility and Compliance Lead
   - WCAG discipline
   - contrast
   - focus order
   - semantics
   - compliance risks

9. Privacy / Governance Architect
   - local-first trust posture
   - data minimization
   - auditability
   - enterprise review posture

10. QA / Release / Evidence Lead
    - regression safety
    - verification
    - proof artifacts
    - release confidence

11. Growth / GTM / Investor Narrative Advisor
    - differentiation
    - demo readiness
    - commercial readability
    - executive storytelling

## Decision Rules
- Use multi-disciplinary reasoning, not single-discipline bias.
- If experts disagree, surface the tradeoff and choose a default.
- Default to the highest-ROI path that preserves current working value.
- Avoid speculative redesign when a targeted enhancement will do.
EOF

cat > "$ROOT/.gemini/context/05-delivery-governance-and-quality.md" <<'EOF'
# Delivery, Governance, and Quality

## Output Style
Produce dense, structured, high-signal output in Markdown.
No fluff.
No generic inspiration language.
No fake confidence.
No claims that exceed current implementation evidence.

## Enhancement Rule
Always optimize for:
- enhance current solution
- do not wipe out
- do not replace more than necessary
- preserve working code paths where possible
- evolve toward stronger architecture gradually

## Required Tags
Use:
- P0 = must have now
- P1 = high ROI next
- P2 = nice to have later

## Every serious recommendation must include
- why it matters
- tradeoffs
- implementation implication
- impact on current solution
- whether it is additive or refactor-oriented
- whether it touches docs, tests, UX, architecture, or governance

## Required States for UX recommendations
Always account for:
- loading
- empty
- error
- offline/degraded
- export/import recovery

## Required Quality Gates
For material changes, include:
- affected files
- test/update impact
- regression risk
- documentation impact
- release proof expectations

## Unknown Handling
For each important unknown:
- state the unknown
- propose 2-3 viable options
- choose a default
- explain risk if assumption is wrong

## Scope Control
If the requested scope is too large:
- break into phases
- preserve continuity
- start with highest leverage
- do not explode the project unnecessarily
EOF

cat > "$ROOT/.gemini/context/06-readme-and-docs-alignment.md" <<'EOF'
# README and Docs Alignment

## Builder Truth
README, root docs, and implementation must not contradict each other.

## README Rewrite Rules
When updating README:
- align brand narrative with actual product behavior
- keep local-first truth explicit
- keep current capabilities explicit
- keep current limits explicit
- improve navigation, trust, and premium positioning
- do not claim backend, sync, or hosted features that do not exist
- do not hide MVP limitations
- make the repository legible to:
  - builders
  - operators
  - buyers/reviewers
  - recruiters/investors

## Repo Evolution Rules
When proposing new files:
- keep structure understandable
- avoid ceremonial document sprawl without purpose
- prefer small number of high-value files
- connect every file to execution, trust, or product clarity
EOF

cat > "$ROOT/.gemini/commands/mvp-enhance.toml" <<'EOF'
description = "Panel-gated MVP enhancement workflow for Monyawn across product, UX, architecture, governance, testing, docs, and positioning."
prompt = """
You are executing the Monyawn MVP enhancement workflow.

Apply the full project memory and use the defined panel of experts.
This is an enhancement pass, not a wipeout.
Preserve the current solution and evolve it with controlled, governed, high-leverage changes.

PRIMARY GOAL
Produce a governed MVP enhancement plan and, when requested, implementation-ready changes that improve the current product across all relevant dimensions:
- product clarity
- information architecture
- UX / UI
- mobile responsiveness
- iOS feel
- Microsoft desktop standards
- local-first architecture integrity
- performance
- accessibility
- privacy / governance
- testing / release proof
- README / docs clarity
- investor / C-suite visibility
- repo maintainability

NON-NEGOTIABLES
- do not propose greenfield replacement unless explicitly asked
- do not introduce backend persistence or cloud sync
- do not damage the current local-first handoff model
- preserve the multi-opportunity and export/import posture
- optimize for phased enhancement

REQUIRED OUTPUT SHAPE
1. current-state diagnosis
2. strengths worth preserving
3. gaps and risks
4. panel-gated recommendations tagged P0 / P1 / P2
5. phased implementation plan
6. affected files / areas
7. test and release implications
8. README / docs implications
9. unknowns and default assumptions

TASK FROM USER
{{args}}
"""
EOF

cat > "$ROOT/.gemini/commands/readme-refresh.toml" <<'EOF'
description = "Refresh README for Monyawn branding clarity without overstating current capabilities."
prompt = """
Update the repository README to reflect the current Monyawn brand and product truth.

GOALS
- improve clarity
- improve trust
- improve navigation
- improve premium positioning
- preserve current implementation truth
- preserve local-first posture
- preserve current capability and limit disclosures
- make the repo legible to builders, operators, and buyers/reviewers

RULES
- do not invent features
- do not over-market
- do not contradict current product behavior
- keep the README useful as builder truth
- maintain a strong but credible voice
- make Monyawn feel intentional, premium, and governed

REQUIRED SECTIONS
- what Monyawn is
- why it matters
- current capabilities
- how data works
- getting started
- testing and verification
- current limits
- strategic docs / trust docs
- MVP direction / execution posture

TASK FROM USER
{{args}}
"""
EOF

cat > "$ROOT/.gemini/commands/phase-plan.toml" <<'EOF'
description = "Generate a phased enhancement plan that preserves the current solution and sequences work by ROI."
prompt = """
Create a phased enhancement plan for the current Monyawn solution.

RULES
- enhancement, not wipeout
- preserve working flows
- preserve repo truth
- keep recommendations additive or controlled refactors
- tag every item P0 / P1 / P2
- include tradeoffs
- include affected areas
- include success criteria

DIMENSIONS
- product
- UX / UI
- mobile / desktop behavior
- architecture
- governance
- accessibility
- testing
- docs / README
- premium narrative / investor visibility

TASK FROM USER
{{args}}
"""
EOF

printf '\nCreated:\n'
printf '  %s\n' \
  "GEMINI.md" \
  ".gemini/context/01-product-truth.md" \
  ".gemini/context/02-brand-and-positioning.md" \
  ".gemini/context/03-architecture-and-constraints.md" \
  ".gemini/context/04-panel-and-decision-authority.md" \
  ".gemini/context/05-delivery-governance-and-quality.md" \
  ".gemini/context/06-readme-and-docs-alignment.md" \
  ".gemini/commands/mvp-enhance.toml" \
  ".gemini/commands/readme-refresh.toml" \
  ".gemini/commands/phase-plan.toml"

printf '\nNext inside Gemini CLI:\n'
printf '  /memory refresh\n'
printf '  /commands reload\n'
printf '\nRecommended first run:\n'
printf '  /mvp-enhance Start with a repo-aware MVP enhancement audit for Monyawn. Do not implement yet. Produce a phased plan that covers product, UX/UI, mobile responsiveness, iOS feel, Microsoft desktop standards, local-first architecture integrity, accessibility, governance, testing, README/docs alignment, and investor/C-suite visibility. Enhance current solution; do not wipe out.\n'