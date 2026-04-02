# Developer Guide

## Purpose
This guide helps contributors work in the **Monyawn** repo without breaking product truth, local-only guarantees, or architectural consistency.

## Before You Change Anything
Read the "Monyawn Truth" documentation first:
1. [README.md](../README.md)
2. [PRODUCT_TRUTH.md](PRODUCT_TRUTH.md)
3. [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)
4. [DECISION_AUTHORITY.md](DECISION_AUTHORITY.md)
5. [AI_OPERATING_SYSTEM.md](AI_OPERATING_SYSTEM.md)

## Core Working Rules
- **Local-First:** Monyawn data stays in the browser. Do not introduce cloud-sync or external storage for personal history without explicit architectural review.
- **Guided Workflows:** Prefer extending the existing guided conversation engine and workspace surfaces rather than adding top-level screens.
- **Expert Gating:** Use the expert panel defined in `DECISION_AUTHORITY.md` to gate product and implementation decisions.
- **Evidence-Backed:** Ensure all candidate story claims can be traced back to artifacts or correspondence items.

## Local Setup
```bash
npm install
npm run dev
```

## Verification Suite
We prioritize automated verification to maintain our "10/10" quality bar:
```bash
npm run build         # Build the static site
npm run test:unit     # Run Vitest unit tests
npm run test:smoke    # Run Playwright smoke tests
npm run verify        # Complete verification (build + unit + smoke)
```

The same release gate is automated in `.github/workflows/verify.yml`.

## Contribution Standards
- **Surgical Changes:** Prefer small, coherent changes over repo-wide churn.
- **Package Discipline:** Respect the boundaries between `packages/` (conversation engine) and `src/` (Monyawn host app).
- **Accessibility:** Maintain keyboard-first usability and ARIA-compliant semantics.
- **Consistency:** Keep filenames, folder structures, and internal naming (e.g., `use_case_id: "monyawn"`) consistent.

## Escalation Path
Pause and escalate to the **Panel of Experts** if your change touches:
- Privacy or data custody claims.
- Security and encryption posture.
- Sovereign deployment commitments.
- Sensitive-support behavior or data handling.
- Core brand voice or "Monyawn" identity.

*Monyawn: Finna get to the monyawn.* 🥱
