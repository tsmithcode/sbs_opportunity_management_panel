# Contributing

## Purpose
This guide helps contributors work in the Monyawn repo without breaking product truth, local-only guarantees, or cross-doc consistency.

## Before You Change Anything
Read these first:
1. [README.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/README.md)
2. [workflow-schema.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/workflow-schema.md)
3. [product-spec.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/product-spec.md)
4. [07-company-org-structure-and-ai-decision-authority.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md)

Use [docs-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/docs-index.md) if you need faster navigation.

## Core Working Rules
- Keep Monyawn local-first unless the docs and product direction explicitly change.
- Do not add new top-level workflow screens casually.
- Prefer extending the existing guided, staff, and admin surfaces.
- Treat `workflow-schema.md` as the canonical entity and lifecycle reference.
- Keep README, platform docs, and runtime behavior aligned.
- Do not imply hosted, sovereign, or compliance claims that are not already documented.

## Local Setup
```bash
npm install
npm run dev
```

Useful checks:
```bash
npm run build
npm run smoke
npm run smoke:cross-browser
npm run roundtrip
npm run verify
npm run release:summary
npm run verify:artifacts
```

The same release gate is automated in [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml).

## What To Update When You Change The Product

| If you change... | Also review... |
|---|---|
| runtime behavior | [product-spec.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/product-spec.md), [README.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/README.md) |
| schema or resource model | [workflow-schema.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/workflow-schema.md), [platform-api-surface.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/platform-api-surface.md) |
| trust, privacy, or buyer posture | [trust-center-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/trust-center-index.md) and the relevant policy docs |
| org ownership or expert routing | [07-company-org-structure-and-ai-decision-authority.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md), [08-enterprise-execution-expert-panel.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/08-enterprise-execution-expert-panel.md) |
| buyer-facing materials | [premium-enterprise-buyer-packet.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-buyer-packet.md), [premium-enterprise-sales-playbook.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/premium-enterprise-sales-playbook.md), [trust-center-index.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/trust-center-index.md) |

## Contribution Standards
- Prefer small, coherent changes over repo-wide churn.
- Keep filenames and folder structure intentional.
- Use the existing `use-cases/` pattern for use-case-specific materials.
- Keep source-of-truth platform docs at the root.
- Add or update smoke coverage when changing critical user/admin/buyer flows.
- Preserve accessibility-first behavior and keyboard usability.

## When To Escalate
Escalate or pause if your change touches:
- privacy or data custody claims
- security posture
- accessibility commitments
- sovereign or deployment commitments
- contract, pricing, or buyer-facing promises
- sensitive-support behavior

The authority model lives in [07-company-org-structure-and-ai-decision-authority.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/use-cases/sbs/phase-00-panel-setup/07-company-org-structure-and-ai-decision-authority.md).

## Good Builder Path
If you want the shortest productive path into the code:
1. Read [README.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/README.md)
2. Read [workflow-schema.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/workflow-schema.md)
3. Open [src/App.tsx](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/src/App.tsx)
4. Run `npm run smoke` before and after significant UI or governance changes

## Repo Promise
This repo tries to stay truthful, local-first, and decision-complete. Contribute in a way that keeps those three qualities intact.
