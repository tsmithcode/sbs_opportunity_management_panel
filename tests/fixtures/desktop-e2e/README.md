# Desktop And Mobile E2E Fixtures

This folder contains the durable inputs for the premium desktop and mobile proof suites.

## What Lives Here
- `scenarios.ts`: the three reusable scenario definitions
- `postings/`: frozen markdown snapshots of the live public job postings used to seed those scenarios

## Why It Exists
- Live postings change or disappear.
- The proof suite needs stable inputs.
- The scenarios should remain reviewable by humans without digging into generated output only.

## Generated Artifacts
Fresh screenshots, downloads, and proof exports are written to:

- `output/playwright/desktop-e2e/`
- `output/playwright/mobile-e2e/`

Those generated artifacts are useful for review, but the files in this folder are the durable source inputs for repeatable end-to-end runs.
