# Town Hall: Mobile UI Premium Sweep - Multi-Phase Plan

## Objective
Transform the mobile web experience into a premium, native-feeling, offline-first SPA. This sweep eliminates the "responsive website" feel in favor of a "native app" container.

## Strategic Decision: The Hybrid Model
The panel of experts (Mobile UX & Offline Architect) has rejected a pure "Infinite Scroll" (TikTok) vs. "Pure Onboarding" (Workday) choice in favor of a **Hybrid Operating Shell**:

1.  **The Shell:** Persistent Bottom Tab Bar (Home, Lifecycle, Story, Admin) for native SPA navigation.
2.  **The Flow (Onboarding Style):** Used for Stage advancing, intake, and data entry. High clarity, step-by-step.
3.  **The Feed (Infinite Style):** Used for reviewing the "Candidate Story" and "Correspondence" as a vertical, scrollable evidence stream.

---

## Phase 1: The Mobile Container (P0)
- **Implement `MobileNavigation`:** A bottom-docked navigation bar visible only on screens < 768px.
- **Refactor `AppHeader`:** Shrink the top bar on mobile to prioritize vertical space; move "Mode" labels into an iOS-style profile toggle or drawer.
- **SPA Hydration Polish:** Ensure zero-flicker transitions between workspace modes.

## Phase 2: The "Flow" System (P1)
- **Workflow Stepper:** Transform the `step-nav` sidebar into a horizontal, swipeable stepper at the top of the mobile content area.
- **Form Optimization:** Convert dense multi-field forms into "One Question per Screen" flows for critical intake phases (Onboarding style).
- **Touch-First Buttons:** Increase hit-targets for all action buttons to minimum 44x44px (App Store standard).

## Phase 3: The "Feed" System (P1)
- **Story Reader:** Transform the "Candidate Story" textarea into a rich-text vertical feed with card-based segments.
- **Infinite Evidence Stream:** Allow users to scroll through all artifacts and correspondence as a continuous feed rather than clicking through table rows.

## Phase 4: Offline-First Visuals (P2)
- **Sync Status:** Add a discreet "Saved to Device" pulse in the status bar to reinforce the offline-first/local-only posture.
- **Haptic Hints:** (Web API) Implement subtle vibration feedback for successful local saves or ZIP generations.

---

## CEO Visibility Note
This plan delivers a "Store-Ready" appearance without the cost of a native rewrite. It preserves the local-first integrity while satisfying the demand for modern, high-engagement UI patterns.
