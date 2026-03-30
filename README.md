# Monyawn

Primary domain: `www.monyawn.com`

Monyawn is a local-first, AI-native opportunity platform for guided career decision workflows, candidate story development, and durable handoff packaging without storing user data on Monyawn systems.

## What Monyawn Is
Monyawn is designed as a multi-opportunity platform by default. The current product shell supports one actively selected opportunity at a time for clarity, but the underlying model is built to manage multiple opportunities, lifecycle records, and exportable handoff artifacts in one workspace.

This repository uses **Spatial Business Systems (SBS)** as the active reference use case. SBS is the current example workflow, not the boundary of the product.

## Current Product Capabilities
- Guided workspace with user, staff, and admin modes
- Multi-opportunity local-first workflow model
- Candidate story generation and editing
- Local structured extraction from artifacts and correspondence
- Stage-aware coaching, glossary, business lifecycle, and document/process guidance
- Optional sensitive-support paths with local-only defaults
- ZIP import and export with canonical `session.json`
- Human-readable Markdown and client-generated PDF handoff artifacts
- Governance overlays, checkpoints, tasks, escalations, and reporting snapshots
- Admin-side buyer packet ZIP generation for premium enterprise review flows

## How Data Works
- Browser localStorage is convenience persistence only.
- ZIP export is the durable handoff and recovery mechanism.
- `session.json` is the restore authority on import.
- Markdown and PDF outputs are human-readable derivatives for review, print, and transfer.
- Monyawn does **not** retain user opportunity data on company systems in this local-first version.

## Who This Repo Is For
- Builders and operators who need the platform model, product shape, and implementation surfaces quickly
- Organizational buyers and reviewers who need trust, governance, and readiness context
- Advanced users who want to understand how the app, use cases, and handoff model fit together

## Repository Map
- [src](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/src) - app shell, workflow state, seed data, coaching, export packaging
- [tests/fixtures/desktop-e2e](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/tests/fixtures/desktop-e2e) - frozen live-posting snapshots and reusable desktop/mobile proof scenarios
- [docs-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/docs-index.md) - fast navigation map for builders, operators, and reviewers
- [CONTRIBUTING.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/CONTRIBUTING.md) - contributor setup, working rules, and update expectations
- [use-cases](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases) - reference use cases and use-case operating assets
- [product-spec.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/product-spec.md) - platform requirements and operating expectations
- [workflow-schema.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/workflow-schema.md) - canonical entities, lifecycle model, and handoff rules
- [agent-architecture.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/agent-architecture.md) - runtime AI and checkpoint architecture
- [platform-api-surface.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/platform-api-surface.md) - first-class resource contract
- [trust-center-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/trust-center-index.md) - trust and readiness entrypoint
- [platform-roadmap.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/platform-roadmap.md) - platform sequencing and strategic roadmap
- [repo-organization-and-expert-execution-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/repo-organization-and-expert-execution-plan.md) - repo-quality plan, benchmark table, and execution owners
- [frontend-frustration-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/frontend-frustration-matrix.md) - blunt role-by-role view of current frontend friction and expected fixes
- [desktop-town-hall-ui-data-pipeline-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/desktop-town-hall-ui-data-pipeline-matrix.md) - desktop/mobile blockers, owners, and target outcomes for premium acceptance
- [habasit-town-hall-findings.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/habasit-town-hall-findings.md) - CEO-visible failure log and fixes from the Habasit America seeded product-hardening pass
- [ceo-premium-sovereign-enterprise-expectations-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-expectations-matrix.md) - CEO-grade premium sovereign enterprise gap matrix and required experts
- [ceo-premium-sovereign-enterprise-phase-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-phase-plan.md) - phased implementation path to reach premium sovereign enterprise outcomes
- [premium-enterprise-positioning-and-claims-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-positioning-and-claims-guide.md) - approved premium narrative, positioning, and claim boundaries
- [sovereign-posture-and-residency-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/sovereign-posture-and-residency-guide.md) - current sovereign, residency, and hosted-posture boundaries
- [premium-enterprise-diligence-response-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-diligence-response-matrix.md) - buyer diligence routing and source-of-truth response model
- [premium-enterprise-approved-answer-bank.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-approved-answer-bank.md) - short approved answers for common premium enterprise questions
- [premium-enterprise-escalation-map.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-escalation-map.md) - escalation routing for premium enterprise commitments
- [premium-commercial-packaging-rules.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-commercial-packaging-rules.md) - premium enterprise packaging rules aligned to current product truth
- [premium-commercial-approval-ladder.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-commercial-approval-ladder.md) - approval boundaries for premium pricing, legal, and commitment requests
- [premium-enterprise-pursuit-criteria.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-pursuit-criteria.md) - qualify, slow, or decline guidance for premium enterprise deals
- [deployment-posture-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/deployment-posture-matrix.md) - current vs future deployment posture boundaries
- [supported-and-unsupported-deployment-patterns.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/supported-and-unsupported-deployment-patterns.md) - deployment support truth table
- [deployment-commitment-review-rule.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/deployment-commitment-review-rule.md) - controlled review rule for deployment commitments
- [ceo-premium-sovereign-enterprise-benchmark-review.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-benchmark-review.md) - recurring CEO-grade benchmark review process
- [ceo-premium-sovereign-enterprise-evidence-checklist.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-evidence-checklist.md) - evidence standard for score increases and expected outcomes
- [premium-enterprise-buyer-packet.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-buyer-packet.md) - concise buyer-facing packet for enterprise review
- [security-questionnaire-response-kit.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/security-questionnaire-response-kit.md) - controlled response set for common enterprise security and privacy questions
- [premium-enterprise-one-pager.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-one-pager.md) - executive-facing summary for sponsors and first-pass buyer review
- [msa-redline-guidance.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/msa-redline-guidance.md) - internal contract redline guide aligned to current product truth
- [buyer-diligence-workflow.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/buyer-diligence-workflow.md) - end-to-end workflow for handling premium buyer diligence
- [premium-enterprise-sales-playbook.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-sales-playbook.md) - controlled premium enterprise motion for qualification, demo, diligence, and close discipline
- [next-three-workstreams-execution-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/next-three-workstreams-execution-plan.md) - ordered expert-led plan for diligence packet export, executive deck, and enterprise-facing product controls
- [diligence-packet-export.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/diligence-packet-export.md) - exact send order and audience-specific packet guidance for buyer diligence

## Reference Use Cases
- [use-cases/sbs](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs) - active SBS reference implementation
- New use cases should be added under [use-cases](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases) using the same phase-and-shared-assets structure

## Getting Started
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Run the lightweight browser smoke suite:
```bash
npm run smoke
```

Run the cross-browser smoke matrix:
```bash
npm run smoke:cross-browser
```

Run the browser round-trip verification:
```bash
npm run roundtrip
```

Run the full desktop proof suite:
```bash
npm run desktop:e2e
```

Run the full mobile proof suite:
```bash
npm run mobile:e2e
```

Run the CEO-visible Habasit web/mobile town-hall proof:
```bash
npm run townhall:habasit
```

Run the full release verification bundle:
```bash
npm run verify
```

Run build plus the desktop proof suite:
```bash
npm run verify:desktop
```

Run build plus the mobile proof suite:
```bash
npm run verify:mobile
```

Generate verification summary artifacts:
```bash
npm run release:summary
```

Run the full release gate plus cross-browser smoke and summary export:
```bash
npm run verify:artifacts
```

CI uses the same gate:
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml) runs `npm run verify` on push, pull request, and manual dispatch in GitHub Actions.
- The same workflow also runs a cross-browser smoke matrix for `chromium`, `firefox`, and `webkit`.
- The verify job uploads release-summary artifacts from `output/release/`.

What to expect:
- the seeded workspace opens with multiple SBS opportunities
- you can create your own opportunities locally
- exports produce a ZIP handoff package with JSON, Markdown, and PDFs

## Read This Before Live Use
- Export a ZIP before clearing browser storage, changing browsers, or resetting state.
- Review generated candidate story, coaching, and extraction outputs before using them in outreach or interviews.
- Sensitive-support data is local-only by default and is excluded from export unless you explicitly include it.
- There is no backend or cross-device sync in this version.
- Client-side PDF generation works, but it increases bundle size and currently produces a build chunk warning.

## Execution Plan
- Phase A: Platform foundation and local-only data posture
- Phase B: Multi-opportunity lifecycle and handoff architecture
- Phase C: Candidate story, coaching, and sensitive support
- Phase D: Enterprise-grade export, governance, and compact operational UI
- Phase E: Hardening, validation, and readiness for personal and organizational use

For CEO-grade premium sovereign enterprise execution, use:
- [ceo-premium-sovereign-enterprise-phase-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-phase-plan.md)
- [premium-enterprise-positioning-and-claims-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-positioning-and-claims-guide.md)
- [sovereign-posture-and-residency-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/sovereign-posture-and-residency-guide.md)
- [premium-enterprise-diligence-response-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-diligence-response-matrix.md)
- [premium-enterprise-approved-answer-bank.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-approved-answer-bank.md)
- [premium-enterprise-escalation-map.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-escalation-map.md)
- [premium-commercial-packaging-rules.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-commercial-packaging-rules.md)
- [premium-commercial-approval-ladder.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-commercial-approval-ladder.md)
- [premium-enterprise-pursuit-criteria.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-pursuit-criteria.md)
- [deployment-posture-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/deployment-posture-matrix.md)
- [supported-and-unsupported-deployment-patterns.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/supported-and-unsupported-deployment-patterns.md)
- [deployment-commitment-review-rule.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/deployment-commitment-review-rule.md)
- [ceo-premium-sovereign-enterprise-benchmark-review.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-benchmark-review.md)
- [ceo-premium-sovereign-enterprise-evidence-checklist.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-evidence-checklist.md)

## Strategic Docs
- [product-spec.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/product-spec.md)
- [workflow-schema.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/workflow-schema.md)
- [agent-architecture.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/agent-architecture.md)
- [platform-roadmap.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/platform-roadmap.md)
- [repo-organization-and-expert-execution-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/repo-organization-and-expert-execution-plan.md)
- [docs-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/docs-index.md)
- [CONTRIBUTING.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/CONTRIBUTING.md)
- [release-checklist.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/release-checklist.md)
- [release-status.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/release-status.md)
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml)
- [ceo-premium-sovereign-enterprise-expectations-matrix.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-expectations-matrix.md)
- [ceo-premium-sovereign-enterprise-phase-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-premium-sovereign-enterprise-phase-plan.md)
- [premium-enterprise-positioning-and-claims-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-positioning-and-claims-guide.md)
- [trust-center-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/trust-center-index.md)
- [premium-enterprise-buyer-packet.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-buyer-packet.md)
- [security-questionnaire-response-kit.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/security-questionnaire-response-kit.md)
- [premium-enterprise-one-pager.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-one-pager.md)
- [msa-redline-guidance.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/msa-redline-guidance.md)
- [buyer-diligence-workflow.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/buyer-diligence-workflow.md)
- [next-three-workstreams-execution-plan.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/next-three-workstreams-execution-plan.md)
- [diligence-packet-export.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/diligence-packet-export.md)
- [ceo-cro-cto-scorecard.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ceo-cro-cto-scorecard.md)
- [ready-for-personal-use-checklist.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/ready-for-personal-use-checklist.md)
- [use-cases/sbs/phase-00-panel-setup/05-enterprise-readiness-package.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/05-enterprise-readiness-package.md)
- [use-cases/sbs/phase-00-panel-setup/06-user-readiness-requirements.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/06-user-readiness-requirements.md)
- [use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md)

## Current Limits
- No cloud sync or Monyawn-hosted persistence
- Desktop/mobile end-to-end proof and round-trip verification are still Chromium-only; cross-browser CI currently covers the smoke suite rather than the full export/import flow
- Industry coaching is bundled and stage-aware, but not yet dynamically expanded from richer imported knowledge packs

## 10/10 Repo Standard
This repo should feel excellent to use for three audiences at once:
- builders who need fast orientation and truthful implementation boundaries
- operators who need governance, ownership, and handoff clarity
- buyers or reviewers who need trust, policy, and readiness context without digging through code

The standard for a 10/10 repo here is:
- clear product truth at the root
- explicit ownership for controlled decisions
- easy navigation between code, use cases, policy, and trust materials
- no contradiction between implementation, README, and platform docs
- a visible execution plan with benchmarks and accountable experts

## Builder Truth
This README is intentionally builder-first. If a feature is described here, it should exist either in the current app shell or in the current source-of-truth docs. If the platform changes, this file should change with it.
