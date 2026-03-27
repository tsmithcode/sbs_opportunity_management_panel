# Verification Summary

Generated: `2026-03-27T09:49:05.172Z`

## Summary
Monyawn release verification is scripted, automated, and exportable.

## Local Checks
- `npm run build`
- `npm run smoke`
- `npm run roundtrip`
- `npm run verify`
- `npm run smoke:cross-browser`

## CI Checks
- GitHub Actions verify workflow runs npm run verify.
- GitHub Actions verify workflow runs cross-browser smoke on chromium, firefox, and webkit.

## Coverage
- Production build verification
- Chromium smoke verification for guided, admin, and About surfaces
- Chromium round-trip verification for handoff ZIP and buyer packet ZIP
- Cross-browser smoke verification for chromium, firefox, and webkit

## Known Limits
- Round-trip verification remains Chromium-only.
- Verification status is exported as repo and CI artifacts rather than a hosted dashboard.

## Expert Owners
- `CI / Release Automation Lead`
- `Browser Compatibility Lead`
- `QA / Reliability Lead`
- `Engineering Lead`
- `Release Manager`
- `Benchmarking And Evaluation Lead`

