# Use Cases

## Purpose
This directory holds individual Monyawn use cases.

Each use case should package its own:
- phase-based workflow documents
- domain assumptions
- operating rules
- expert panel logic
- shared assets specific to that use case

This structure allows Monyawn to expand from the SBS opportunity workflow into additional opportunity, workforce, enterprise, government, education, or sector-specific use cases over time.

## Current Use Cases
- `sbs/` — initial opportunity-management use case based on the Spatial Business Systems workflow

## Standard Use Case Structure
Each use case should follow this pattern:

- `phase-00-panel-setup/`
- `phase-01-opportunity-strategy/`
- `phase-02-application-materials/`
- `phase-03-interview-system/`
- `phase-04-offer-and-decision/`
- `shared-assets/`

## Use Case Creation Rules
- Keep use-case-specific logic inside its own folder
- Do not mix unrelated use-case assets together
- Reuse root-level platform documents where possible
- Add new cross-platform governance documents at the repository root, not inside a single use case, unless the rule is use-case-specific
- Keep naming consistent across use cases unless there is a strong reason not to

## Monyawn Platform Guidance
Monyawn should treat each use case as:
- a codified workflow
- a reusable decision-support pattern
- a candidate for future productization

The goal is not just to store documents. The goal is to turn each use case into a structured, governable, AI-native workflow that can later be served through the Monyawn platform.
