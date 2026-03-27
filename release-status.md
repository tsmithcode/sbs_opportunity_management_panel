# Release Status

## Summary
Monyawn now has a visible release-verification path for both local builders and CI.

The current standard is:
- local verification uses scripted commands instead of memory
- CI runs the same verification gate automatically
- cross-browser smoke confidence is visible and intentionally scoped

## Current Verified Gates
- `npm run build`
- `npm run smoke`
- `npm run roundtrip`
- `npm run verify`
- `npm run smoke:cross-browser`
- `npm run release:summary`
- `npm run verify:artifacts`

## Current CI Automation
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml) runs `npm run verify`
- the same workflow runs a smoke matrix for `chromium`, `firefox`, and `webkit`
- the verify job exports summary artifacts in `output/release/` and uploads them to GitHub Actions

## Current Coverage
- production build verification
- guided workspace smoke verification
- admin and buyer-control smoke verification
- About-page and resume-link smoke verification
- Chromium handoff ZIP export/import round-trip verification
- Chromium buyer-packet ZIP verification
- cross-browser smoke verification for `chromium`, `firefox`, and `webkit`

## Current Limits
- round-trip verification is still Chromium-only
- CI status is surfaced through repo docs and workflow files rather than a hosted release dashboard

## Expert Owners
- `CI / Release Automation Lead`
- `Browser Compatibility Lead`
- `QA / Reliability Lead`
- `Engineering Lead`
- `Release Manager`

## Source Docs
- [release-checklist.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/release-checklist.md)
- [CONTRIBUTING.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/CONTRIBUTING.md)
- [README.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/README.md)
- [verify.yml](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/.github/workflows/verify.yml)
- [output/release/verification-summary.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/output/release/verification-summary.md)
