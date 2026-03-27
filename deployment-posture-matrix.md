# Deployment Posture Matrix

## Purpose
This document defines the approved deployment postures Monyawn can describe today and how future deployment conversations should be framed.

## Core Rule
Deployment posture must be described from current product truth first.

If a buyer requests a deployment pattern that is not currently documented, the request must be routed rather than implied.

## Deployment Postures

| Posture | Current Status | What It Means | What We May Say | What We Must Not Say |
|---|---|---|---|---|
| Local-first user-managed | Supported today | User opportunity data stays on the user-controlled device; exports provide durable handoff | This is the current default product posture | Do not imply Monyawn-hosted storage or syncing |
| Customer-managed local or internal deployment | Conditionally discussable | Customer may run the product in its own managed environment subject to technical and policy review | This may be explored as customer-managed, not as a default product offer | Do not imply turnkey support or a standardized enterprise deployment package |
| Monyawn-hosted standard SaaS | Future-state discussion only | Hosted product model with company-managed infrastructure | This is not the current product posture | Do not present this as a current offer |
| Region-bound hosted deployment | Not currently offered | Hosted model constrained to a geography or residency boundary | Requires formal review before discussion as anything beyond a future-state concept | Do not imply current availability |
| Sovereign or isolated deployment | Not currently offered | Customer-specific isolated or sovereignty-bound environment pattern | Requires sovereignty, legal, privacy, security, and engineering review | Do not imply support today |

## Product Boundary Summary
The current platform should be described as:
- local-first
- export-first
- not reliant on Monyawn-hosted opportunity-data persistence for standard use
- not currently a documented sovereign or hosted enterprise platform

## Supporting Documents
- [sovereign-posture-and-residency-guide.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/sovereign-posture-and-residency-guide.md)
- [security-overview.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/security-overview.md)
- [privacy-policy.md](/Users/cadguardianllc/Downloads/sbs_opportunity_management_panel/privacy-policy.md)

## Summary
Premium technical credibility comes from describing the real deployment posture clearly and distinguishing current support from future-state discussion.
