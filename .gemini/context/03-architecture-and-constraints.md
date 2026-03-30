# Architecture and Constraints

## Preserve Existing Solution
Enhance the current solution.
Do not wipe out current architecture.
Do not replace working implementation with trendy rewrites.

## Default Technical Posture
Assume the current implementation stack remains the baseline unless explicitly directed otherwise.
Prefer incremental improvement over stack churn.

## Architectural Guardrails
- preserve local-first posture
- preserve import/export handoff model
- preserve current data restore authority assumptions
- preserve current testing posture and strengthen it incrementally
- preserve current repo truth and keep code/docs aligned
- preserve current premium/governance positioning surfaces if they already exist

## What Requires Explicit Approval
Do not introduce these without explicit approval:
- hosted backend
- cloud database
- forced auth dependency
- sync engine
- full design framework rewrite
- large component framework migration
- destructive schema reset
- repo-wide folder churn not justified by ROI

## Improvement Preference Order
1. information architecture
2. design system consistency
3. UX clarity and workflow guidance
4. performance and accessibility
5. testing and validation hardening
6. docs and README clarity
7. premium enterprise narrative alignment
8. optional future architecture extension points

## Native Feel Standard
Target:
- iOS-grade polish and feedback discipline
- Microsoft desktop-grade clarity, density, and efficiency
- cross-platform consistency without making desktop feel like a stretched phone UI
