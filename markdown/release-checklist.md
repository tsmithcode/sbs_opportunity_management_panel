# Release Checklist

## Purpose
This is the current release-readiness checklist for Monyawn.

It is intended to keep product truth, verification, and repository discipline aligned before calling a change "ready."

## Primary Owners
- `Release Manager`
- `QA / Reliability Lead`
- `Engineering Lead`
- `CI / Release Automation Lead`
- `Developer Experience Lead`
- `Benchmarking And Evaluation Lead`

## Required Verification
Run the full verification command:

```bash
npm run verify
```

Generate release-summary artifacts:

```bash
npm run release:summary
```

Run the expanded release gate with summary export:

```bash
npm run verify:artifacts
```

That command currently includes:
- production build
- browser smoke suite
- export/import round-trip verification

Cross-browser release visibility:
- `npm run smoke:cross-browser` runs the smoke suite across `chromium`, `firefox`, and `webkit`.
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml) runs a matching cross-browser smoke matrix in GitHub Actions.

Automated CI mirror:
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml) runs the same release gate in GitHub Actions on push, pull request, and manual dispatch.
- The verify job also uploads generated verification-summary artifacts from `output/release/`.

## Release Gates

| Gate | Pass Requirement |
|---|---|
| Build | `npm run build` passes |
| Guided workspace | smoke suite passes guided lifecycle check |
| Admin and buyer controls | smoke suite passes admin control and buyer-packet check |
| About / public surface | smoke suite passes About-page and resume-link check |
| Cross-browser confidence | cross-browser smoke passes on `chromium`, `firefox`, and `webkit` |
| Handoff round-trip | roundtrip suite proves export, mutation, import, and restore |
| Buyer packet artifact | roundtrip suite proves buyer-packet ZIP download |
| Product truth | README and source-of-truth docs do not contradict current implementation |
| Local-only posture | no change silently weakens local-only or export-first behavior |

## Manual Review Items
- Review notices and warnings shown during export/import flows if behavior changed.
- Review accessibility-sensitive UI changes if controls, labels, or disclosure patterns changed.
- Review buyer-facing docs if trust, deployment, commercial, or diligence posture changed.

## When To Update This Checklist
Update this file when:
- a new critical workflow gets automated coverage
- release gates change
- the verification command changes
- the product posture changes in a way that affects readiness claims

## Current Note
The export stack is now lazy-loaded and split, but client-side PDF/export code still adds meaningful optional weight when those features are used. That is acceptable in the current product posture and should be monitored rather than hidden.
