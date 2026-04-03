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
bash scripts/setup.sh   # installs deps, bootstraps .env, sets git hooks
npm run dev
```

Or use the included devcontainer (`devcontainer.json`) for a fully configured environment in VS Code or GitHub Codespaces.

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

## Rollback Procedure

**GitHub Pages deployment rollback:**
1. Navigate to the Actions tab → `Verify And Deploy` workflow.
2. Find the last successful deploy run on `main`.
3. Re-run the `deploy` job from that run to re-deploy the previous artifact.

**Supabase migration rollback:**
- Never delete or edit existing migration files.
- Write a forward corrective migration with a later timestamp in `supabase/migrations/`.
- Run `supabase db push` to apply.

## Escalation Path
Pause and escalate to the **Panel of Experts** if your change touches:
- Privacy or data custody claims.
- Security and encryption posture.
- Sovereign deployment commitments.
- Sensitive-support behavior or data handling.
- Core brand voice or "Monyawn" identity.

*Monyawn: Finna get to the monyawn.* 🥱
