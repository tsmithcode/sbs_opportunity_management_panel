# Conversation Engine

This repo now contains a reusable conversation product slice that is intentionally split into package-style boundaries:

- `packages/conversation-core`
  Headless flow engine, transcript model, replay/stale tracking, validation, progress.
- `packages/conversation-schema`
  Versioned step definitions plus migration helpers for persisted conversation state.
- `packages/conversation-react`
  Reusable chat UI primitives for prompts, controls, tabs, progress, answer cards, and edit modal.
- `packages/conversation-adapters`
  Host-app handoff layer. This is where app-specific draft hydration and commit behavior belongs.
- `packages/conversation-devtools`
  Lightweight debugging helpers for inspecting a conversation run.

## Extraction Rules

1. `conversation-core` must never import app business objects.
2. `conversation-schema` may depend on `conversation-core`, but not on host app state.
3. `conversation-react` may depend on `conversation-core`, but not on host app state.
4. `conversation-adapters` is the only package allowed to know about host app objects.
5. Host apps should talk to the engine through:
   - `schema`
   - `core`
   - `react`
   - one adapter implementation

## Minimum External Repo Shape

Create a new repo with:

- `packages/conversation-core`
- `packages/conversation-schema`
- `packages/conversation-react`
- `packages/conversation-adapters`
- `packages/conversation-devtools`
- `examples/react-starter`

## Persisted State Contract

Persist conversation state as:

```ts
{
  schemaVersion: "2026.04.02",
  state: {
    responses,
    history,
    staleStepIds
  }
}
```

Run persisted payloads through `migrateConversationState(...)` before rendering.

## Host App Responsibilities

- provide the step schema
- provide the adapter
- decide how/where to persist state
- decide when to commit conversation output into real domain objects
- brand the copy and theme

## Current Reference App

This app uses the conversation packages for the onboarding-to-workspace golden path in:

- `src/components/pages/ConversationIntake`
- `src/conversation/intakeConversation.ts`
- `src/App.tsx`

## Parked Next Track

This is the next track we intentionally parked for later so it does not get lost:

1. Prepare standalone repo extraction
   - move all conversation packages into their own workspace/repo
   - replace direct relative imports with published-style package imports
   - add package-level tsconfig/build setup

2. Publishing cleanup
   - add README files for each package
   - add package exports fields
   - add semantic versioning and release notes flow
   - add consumer installation instructions

3. Example app hardening
   - create a true `examples/react-starter` app
   - show persistence, schema migration, and adapter wiring
   - include a minimal brand/theme override example

4. Product-grade devtools
   - transcript inspector UI
   - step visibility debugger
   - stale-step replay visualizer
   - schema preview panel

5. Persistence and portability
   - add a storage adapter interface
   - provide local/session persistence examples
   - document migration strategy for persisted transcripts

6. Release and adoption readiness
   - add bundle-size and package verification checks
   - add package-focused CI jobs
   - add extraction checklist for moving from this repo to the standalone repo

## Golden Path And Side Quest Audit

Audit date: `2026-04-02`

This scorecard uses the fictional panel of experts as a transparent internal rubric across:

- product focus
- conversation UX
- auditability
- portability
- adapter architecture
- UI clarity
- accessibility
- motion / frontier feel
- testing / proof
- extraction readiness

### Overall Scores

- Golden path: `8.4/10`
- Side quests: `7.6/10`
- Whole app proof confidence: `8.0/10`

### Dimension Scores

| Dimension | Score | Panel note |
|---|---:|---|
| Product focus | 9.0 | The one-window intake is real and keeps attention in one place. |
| Conversation UX | 8.5 | Strong prompt flow and edit/replay behavior, but still somewhat schema-shaped in feel. |
| Auditability | 9.0 | Transcript, versioning, replay queue, and snapshot make the trail credible. |
| Portability | 8.5 | Package seams are real, but standalone package import cleanup still remains. |
| Adapter architecture | 8.5 | Host-app mapping is now extracted, but storage/persistence adapters are not done yet. |
| UI clarity | 8.0 | Much clearer than the old multi-screen path, but some states still need sharper labels. |
| Accessibility | 6.5 | Baseline is acceptable, but there has not been a deep keyboard/screen-reader audit. |
| Motion / frontier feel | 7.0 | Good structural visuals, but not yet at “frontier product” motion/art direction. |
| Testing / proof | 8.5 | Strong ROI coverage with unit, smoke, schema, adapter, and devtools tests. |
| Extraction readiness | 8.0 | The repo is now structured for extraction, but not yet packaged for publishing. |

### Per Page Scores

| Page | Golden Path | Side Quest | Panel note |
|---|---:|---:|---|
| `login` | 8.5 | 7.5 | Fast and clear enough, but not yet differentiated as a signature entry experience. |
| `start` | 8.5 | 7.5 | Good launch point and routing handoff. Mostly a staging page, not a proof-heavy one. |
| `proof-drop` / `confirm` / `setup-base` conversation page | 9.0 | 8.0 | Strongest page in the app now. One place, real transcript, replay honesty, and normalized snapshot. |
| `workspace` | 7.8 | 7.8 | Useful, but now feels older than the conversation-first intake that feeds it. |
| `about` | 7.0 | 7.0 | Fine support page, but low strategic importance to proof of the core product. |

### What Was Actually Verified

- `npm run build`
- `npm run test:unit`
- `npm run test:smoke`
- architecture review of the conversation engine, schema, React layer, adapters, and devtools

### What Was Not Fully Audited Yet

- dedicated accessibility pass with keyboard and screen-reader verification
- explicit golden-path integration test for edit -> stale -> replay -> complete
- broader side-quest proof audit inside the legacy workspace surfaces
- motion/performance review with a visual polish pass

### Red / Yellow / Green Findings

Green:
- The old multi-page intake has been meaningfully replaced by a single conversation workspace.
- Edit and replay behavior now leaves a believable audit trail.
- Package boundaries are strong enough to support future extraction.

Yellow:
- The conversation still feels partially “engine-driven” instead of fully conversational in tone and segue smoothness.
- The workspace experience is now behind the intake experience in overall quality and modernity.
- Adapter boundaries are good, but persistence/storage boundaries are still missing.

Red:
- Accessibility is the weakest scored dimension and should not be treated as complete.

### Highest ROI Next Fixes

1. Run a dedicated accessibility audit on the conversation page:
   focus order, transcript semantics, modal behavior, replay queue readability, and keyboard-only completion.
2. Add one focused integration test covering:
   answer -> edit earlier answer -> stale queue appears -> replay steps -> complete successfully.
3. Upgrade the conversation narrator layer so prompts and segues feel more human and less schema-declared.
4. Modernize the workspace shell so it feels consistent with the new conversation-first intake quality bar.
5. Replace repo-relative package imports with publish-style package boundaries before extraction.
