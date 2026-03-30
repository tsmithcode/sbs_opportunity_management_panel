# Town Hall: DX Improvement Sprint - Separation of Concerns

## Objective
Implement a governed, scalable architecture by breaking down the monolithic `App.tsx` into modular, folder-based components. This sprint prioritizes Developer Experience (DX), maintainability, and architectural integrity.

## Panel Consensus
- **Architecture Expert:** Recommends a "Contract-First" approach. Each component folder must contain a `.contract.ts` for interfaces and a `.tsx` for implementation.
- **UI/UX Expert:** Demands uniform templates. Use a finite set of layouts (e.g., `PageTemplate`, `PanelTemplate`) to ensure a consistent "Premium Enterprise" feel.
- **CEO/Governance:** Enforces strict code limits. Files should aim for < 256 lines (512 max) to ensure auditability and clarity.

## Phase Execution Plan

### Phase 1: Foundation (P0) - Completed
- [x] Initial extraction of `AboutPage` from `App.tsx`.
- [x] Establishment of basic component directory structure.

### Phase 2: Refinement & Templating (P0) - Active
- [ ] Implement `src/components/templates/PageTemplate.tsx` for shared layout logic.
- [ ] Migrate `AboutPage` to folder-based structure:
    - `src/components/pages/About/AboutPage.tsx`
    - `src/components/pages/About/AboutPage.contract.ts`
- [ ] Ensure all files adhere to the < 512 line limit.

### Phase 3: Major Container Extraction (P1)
- [ ] Extract `AppHeader` (Top bar + Navigation).
- [ ] Extract `HeroSection` (The operational dashboard at the top of workspace).
- [ ] Extract `ModeSelection` rail.

### Phase 4: Lifecycle Stage Extraction (P2)
- [ ] Extract complex workflow containers (Account Setup, User Onboarding, Opportunity Intake).

## Risks & Mitigations
- **State Fragmentation:** Mitigation: Maintain the singular `AppState` in `App.tsx` but pass dispatch/update functions via clearly defined props in contracts.
- **CSS Leakage:** Mitigation: Use standard design system variables and specific BEM-like class naming conventions within component folders.

## CEO Visibility Note
This plan moves Monyawn from a "demo-ready" single-file script to an "enterprise-ready" scalable platform foundation without introducing destructive rewrites or external dependencies.
