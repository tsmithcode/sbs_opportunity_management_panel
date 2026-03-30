# Habasit America Town Hall Findings

## Purpose
Capture the CEO-visible findings from the Habasit America, Suwanee, Georgia sample workspace hardening pass.

This is a product-hardening record, not a marketing summary.

## Sample Scope
- Company basis: Habasit America, Suwanee, GA
- Workspace shape: 30-day seeded sample history
- Scenarios represented in seeded state:
  - standard non-sensitive path
  - felony / re-entry support path
  - layoff / transition-stress path
- Proof passes completed:
  - one desktop web pass
  - one mobile pass

## What We Added
- A persisted Habasit America sample account with realistic 30-day activity in [src/seed.ts](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/src/seed.ts)
- A dedicated CEO-visible proof spec in [tests/habasit-town-hall.spec.ts](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/tests/habasit-town-hall.spec.ts)
- Generated proof artifacts in `output/playwright/habasit-town-hall/`
- Updated team ownership for mobile and town-hall discipline in:
  - [07-company-org-structure-and-ai-decision-authority.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md)
  - [08-enterprise-execution-expert-panel.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/08-enterprise-execution-expert-panel.md)

## What Worked
- The product can now open a richer seeded workspace that feels materially closer to a real product than a demo shell.
- The Habasit sample survives export/import and remains readable in admin review.
- Desktop hierarchy is stronger than before: the top workspace reads like an operating cockpit instead of flat card soup.
- Sensitive-support rules behave correctly in the seeded sample:
  - local-only by default
  - explicit inclusion only where intended
- The Habasit sample gives the team realistic operations evidence to review across 30 days instead of a thin seed.

## Failures We Hit
1. Workspace selector ambiguity
The town-hall proof initially failed because the generic `Account` label matched both the live selector rail and the intake form fields.

2. Status-channel ambiguity
The broader desktop proof initially failed because the app now has more than one `role="status"` region, and the tests were still asserting against the generic role rather than the action notice channel.

3. Export expectation drift
The desktop proof initially assumed a support folder should be absent when the active scenario did not export support. That stopped being true once the seeded workspace became richer and included other opportunities with intentionally exportable support.

4. Generic mobile suite cost
The generic three-scenario mobile suite is still too expensive to be the default release gate. It works better as an extended proof lane than as the main CI path right now.

## Fixes Applied On The Spot
1. Selector targeting was fixed in the Habasit proof by binding to the workspace selector rail instead of ambiguous page-wide labels.
2. Status assertions were fixed by targeting the action notice surface instead of the generic ARIA status role.
3. Export assertions were fixed to validate support inclusion per opportunity, while still honoring workspace-wide exported support reality.
4. The release gate was updated so the CEO-visible Habasit web/mobile proof is in the default path, while the heavier generic mobile suite remains available as an extended script.

## Current Read
- Desktop web pass: passed
- Mobile pass: passed
- Habasit export/import proof: passed
- Seed realism: materially improved
- Release gate discipline: improved
- Remaining gap: the generic mobile three-scenario proof is still heavier than a good default gate

## Expected Next Hardening Moves
- Reduce runtime cost of the generic mobile suite if it is to become part of the default release gate.
- Continue replacing ambiguous test selectors with surface-specific selectors wherever the UI now has multiple valid live regions.
- Expand seeded production-like samples only when they improve proof quality without bloating the main workspace.

## Expert Signoff Group
- Desktop Experience Director
- Mobile Experience Lead
- Town Hall Review Lead
- E2E Proof Lead
- Data Pipeline Validation Lead
- Visual QA Lead
- Responsive QA Lead
- QA / Reliability Lead
- Workflow Analyst
