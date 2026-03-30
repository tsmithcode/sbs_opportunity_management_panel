# Monyawn (SBS Opportunity Management Panel)

## Project Overview

Monyawn is a local-first, AI-native opportunity platform designed for guided career decision workflows, candidate story development, and durable handoff packaging. The architecture is intentionally local-first: it does not store user data on company systems; instead, browser `localStorage` acts as a convenience layer while ZIP exports (containing a canonical `session.json`, human-readable Markdown, and PDFs) serve as the durable handoff and recovery mechanism. 

This repository uses **Spatial Business Systems (SBS)** as its active reference use case.

### Key Technologies
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Testing:** Playwright (Smoke, Desktop E2E, Mobile E2E, Roundtrip)
- **Styling:** Vanilla CSS (with CSS variables for theming)
- **Exports:** `jszip` for packaging, `jspdf` for document generation

## Architecture & Data Flow

- **State Management:** A singular `AppState` object (defined in `src/types.ts` and `src/schema.ts`) manages the whole lifecycle, including Accounts, Users, Opportunities, Artifacts, Checkpoints, Tasks, and more.
- **Workflow:** Defined heavily in `src/workflow.ts`, the application manages transitions through predefined stages (e.g., `intake_started`, `positioning`, `offer_review`). 
- **Data Posture:** Local-only. The app relies on user-initiated imports/exports (`src/package.ts`) to persist data beyond the current browser session.

## Building and Running

Ensure you have Node.js and npm installed.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

### Testing & Verification
The project maintains a rigorous testing standard, including round-trip export/import verifications and UI testing.

```bash
# Run lightweight browser smoke suite (Chromium)
npm run smoke

# Run cross-browser smoke matrix (Chromium, Firefox, WebKit)
npm run smoke:cross-browser

# Run full desktop proof suite
npm run desktop:e2e

# Run full mobile proof suite
npm run mobile:e2e

# Run browser round-trip verification
npm run roundtrip

# Run full release verification bundle (build + all tests)
npm run verify

# Run release verification and generate artifacts
npm run verify:artifacts
```

## Development Conventions

1. **Builder Truth:** The `README.md` and standard markdown files in the root dictate the product truth. Code implementation should strictly adhere to rules found in `product-spec.md`, `workflow-schema.md`, and `agent-architecture.md`.
2. **Local-First Constraints:** Never introduce backend syncing, external database dependencies, or remote data storage without explicitly altering the product's fundamental security posture and governance models.
3. **Typing & Schema:** Always use explicit types defined in `src/types.ts`. The schema version is tracked (`SCHEMA_VERSION`) and must be respected during state generation and imports.
4. **Testing is Mandatory:** Any changes to workflow, export packaging, or UI logic must be verified using the Playwright E2E and roundtrip suites to ensure no regressions occur to the core handoff loops.
5. **Styling:** Utilize the existing design system found in `src/styles.css`. Adhere to the established CSS variables (`--surface`, `--accent`, `--muted`, etc.) rather than introducing new frameworks like Tailwind.
