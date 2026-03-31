# Town Hall: Accessibility & Navigation Refinement

## Objective
Reposition the "Skip to Main Content" link to improve usability and reachability, following user feedback and accessibility best practices.

## Expert Panel Consensus
- **Accessibility & Inclusion Specialist:** The skip-link must remain near the top of the tab order, but it can follow the primary header if the header itself is not excessively long. Moving it just before the `<main>` element ensures it's reachable after a single tab press if the header actions are minimized.
- **Mobile UX Specialist:** On mobile, the skip-link often gets buried or overlaps with fixed headers. Positioning it logically after the navigation but before the content area prevents "visual collision."
- **CEO/Governance:** This change balances regulatory compliance (WCAG) with real-world user ergonomics.

---

## Execution Plan

### 1. Structural Move (DOM)
- Relocate the `<a>` skip-link in `App.tsx` from the very top of `app-shell` to the position immediately following the `AppHeader` and `MobileNavigation` components.
- This ensures that keyboard users can tab into it after briefly passing the brand/navigation context, but before entering the complex workspace logic.

### 2. Visual Style Adjustment (CSS)
- Update `.skip-link` in `src/styles.css` to ensure it appears *below* the header when focused, rather than at the very top of the viewport where it may be obscured by the browser's URL bar or fixed app elements.
- Adjust `z-index` to ensure it sits above all other navigation elements when active.

### 3. Verification
- Verify focus order using keyboard navigation.
- Ensure the skip-link correctly targets the `main-content` ID across all pages (Workspace and About).

---

## CEO Visibility Note
This refactor ensures Monyawn's accessibility is "user-centered," not just "compliant." It eliminates a known friction point for keyboard-only users.
