# Town Hall: The "Controlled Happy Path" UI Sweep (10/10 Plan)

## Objective
Evolve Monyawn from a dense "Control Panel" into a premium, multi-page guided experience. Ensure the brand voice (calm, authoritative, local-first) is the dominant UI element.

---

## Expert Panel Consensus
- **Brand Identity Lead:** The current homepage is a "workhorse," not a "welcome." We need a dedicated Landing Page that sells the "Why" (Clarity, Control, Career) before asking for the "What" (Forms).
- **Mobile UX Specialist:** Decompressing the single-page workspace into a multi-page flow is high ROI for mobile. It reduces cognitive load and allows for larger, touch-friendly targets.
- **Architecture Expert:** Use the `PageTemplate` to create distinct routes (or pseudo-routes via state) for `Landing`, `Intake`, `Shaping`, and `Review`.
- **CEO/Governance:** Maintain the < 512 LOC rule. Breaking pages into smaller, single-purpose containers is the only way to scale this safely.

---

## The Execution Plan: Multi-Phased Sweep

### Phase 1: The Brand Entry (Landing Page)
- **New Component:** `src/components/pages/Landing/LandingPage.tsx`.
- **Logic:** Move the "Hero" and "Value Props" out of the workspace. Replace the forms with a single, high-contrast "Start My Pursuit" call-to-action.
- **UI:** Full-width layout, serif typography for headlines, and illustrative "Process Steps" to build trust before data entry.

### Phase 2: The Guided Intake (The Onboarding Flow)
- **New Component Folder:** `src/components/flows/IntakeFlow/`.
- **Logic:** Decompose the 3-step intake (Account, User, Opportunity) into a dedicated "Wizard" experience. 
- **UX:** "One Task at a Time" layout. Progress bar at the top. High-finesse transitions between steps.

### Phase 3: The Operational Cockpit (Workspace Refinement)
- **Refactor:** The workspace becomes purely operational. 
- **Focus:** Once intake is done, the user enters the "Cockpit" which focuses on Artifacts, Story, and Export.
- **Brand Polish:** Standardize all "Mini-Cards" and "Stage Blocks" using a unified `Card` component to ensure spacing and border-radius consistency.

### Phase 4: High ROI "Final Mile" Tasks
- **Narrative Empty States:** Replace empty tables with branded "Guided Prompts" (e.g., "No artifacts yet. Start by uploading your current resume to build your foundation.")
- **Local-First Visual Cues:** Add a "Privacy Guard" visual theme—ensure the user *sees* that their data is staying on their machine (e.g., a "Safe" icon near the storage status).

---

## CEO Visibility Note
This 10/10 plan moves Monyawn from "Functional Utility" to "Category Leader." It treats the user's career transition with the premium architectural respect it deserves.
