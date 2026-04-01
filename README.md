# Monyawn

Primary domain: `www.monyawn.com`

**Monyawn** (Money + Yawn) represents "easy money" for what used to seem hard—acting as a guardian angel to help candidates, whether Gen Z or Boomers, navigate the friction of landing high-value opportunities ($100k-$300k+) they already have the skills for. 🥱

Monyawn is a local-first, AI-native opportunity platform for guided career decision workflows, candidate story development, and durable handoff packaging without storing user data on Monyawn systems.

## What Monyawn Is
Monyawn is designed as a multi-opportunity platform by default. The current product shell supports one actively selected opportunity at a time for clarity, but the underlying model is built to manage multiple opportunities, lifecycle records, and exportable handoff artifacts in one workspace.

This repository uses **Spatial Business Systems (SBS)** as the active reference use case. SBS is the current example workflow, not the boundary of the product.

## Current Product Capabilities
- **Money + Yawn Identity 🥱**: Making high-stakes moves feel easy with guided support.
- **Guided Intake Flow**: Step-by-step onboarding for Account, User, and Opportunity.
- **Operational Cockpit**: Real-time **Leverage Score 🥱** and **Privacy Guard** visual assurance.
- **AI Intelligence**: Local rule-based signal extraction or **High-Yield OpenAI Narrative Generation** (optional).
- **Multi-Opportunity Support**: Switch between multiple opportunities dynamically via the top navigation bar.
- **Resilient Recovery States**: Explicit empty state to guide the user to start an intake, restore from ZIP, or load demo data.
- **Mobile-Native SPA Feel**: Bottom navigation and horizontal workflow stepper for high-performance mobile use.
- Candidate story generation and editing
- ZIP import and export with canonical `session.json`
- Markdown and PDF handoff artifacts
- Governance overlays, checkpoints, and reporting snapshots
- **Max-Yield Content Factory**: Export outcomes as branded **Monyawn Blog Assets 🥱** (Markdown + JSONL).

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
