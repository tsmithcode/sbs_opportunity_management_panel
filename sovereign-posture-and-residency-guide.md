# Sovereign Posture And Residency Guide

## Purpose
This document defines how Monyawn should answer sovereign, residency, hosting, and data-boundary questions in a way that is accurate, conservative, and consistent with the current product.

## Current Product Truth
Monyawn is currently a local-first product.

In the current model:
- user opportunity data is stored locally on the user-controlled device
- durable handoff happens through user-managed ZIP export packages
- Monyawn does not retain user opportunity data on company systems in the current local-first implementation
- Monyawn is not currently a Monyawn-hosted sovereign platform

## Sovereign Posture Summary
Monyawn should describe its current posture as:
- local-first by design
- export-first for durable retention and handoff
- conservative about hosted or residency-bound claims
- open to future enterprise or sovereign deployment discussions only through documented review

## What We Can Say Today
- The current product is local-first.
- In the current product model, user opportunity data remains on the user-controlled device unless the user exports it.
- The current version does not depend on Monyawn-hosted persistence for normal workflow operation.
- Sovereign, isolated, or residency-bound hosted patterns should be treated as future-state design discussions unless separately documented and approved.

## What We Must Not Say Without Approved Support
- "Monyawn is sovereign-hosted"
- "Monyawn guarantees data residency in your jurisdiction"
- "Monyawn provides regional hosting today"
- "Monyawn supports your regulated environment by default"
- "Monyawn can satisfy sovereign deployment requirements" unless a documented architecture and legal review exist

## Posture Matrix

| Posture | Current Support Status | What We May Say | Required Owner Review |
|---|---|---|---|
| Local-only user-managed workflow | Supported today | This is the current product posture | Product Lead, Privacy Lead |
| Customer-managed local use | Supported in principle where the customer runs the product within its own environment and assumptions are reviewed | Must be framed as customer-managed, not Monyawn-hosted | Engineering Lead, Privacy Lead |
| Monyawn-hosted standard SaaS | Not current product posture | Discuss only as future direction, not as an active offer | Product Lead, Engineering Lead, CRO / Revenue Lead |
| Region-bound or residency-controlled hosted product | Not currently supported as a documented product offer | Route for review; do not imply availability | Data Residency / Sovereignty Lead, Privacy Lead, Enterprise Counsel / Contracting Lead |
| Sovereign or isolated enterprise deployment | Not currently supported as a documented offer | Route for review; do not imply availability | Sovereign Deployment Architect, Data Residency / Sovereignty Lead, Enterprise Counsel / Contracting Lead |

## Approved Short Answers

### If asked whether Monyawn is sovereign-hosted
Approved answer:
"No. The current product is local-first and does not rely on Monyawn-hosted user opportunity data storage for normal operation. If you need sovereign or residency-bound deployment analysis, we would route that for formal review rather than imply support."

### If asked whether Monyawn stores customer data in a specific region
Approved answer:
"The current product is local-first. In this version, user opportunity data remains on the user-controlled device unless the user exports it. We should not imply regional hosted storage in the absence of a documented hosted architecture."

### If asked whether Monyawn can support sovereign deployment in the future
Approved answer:
"That is a controlled design and contracting question, not a default product claim. We would route it through sovereignty, architecture, privacy, security, and contracting review before saying more."

## Escalation Rule
Any sovereign, residency, regulated-hosting, or isolated-environment question must be routed before commitments are made.

Primary owner:
- Data Residency / Sovereignty Lead

Supporting owners:
- Sovereign Deployment Architect
- Privacy Lead
- Security Lead
- Enterprise Counsel / Contracting Lead

## Summary
The premium answer is not to sound bigger than the product. The premium answer is to be exact about the current local-first posture and disciplined about what requires further review.
