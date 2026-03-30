# AI Governance Policy

## Purpose
This document defines how Monyawn governs AI-assisted behavior across product workflows, customer interactions, and internal operations.

It is intended to provide a platform-level source of truth for:
- where AI may be used
- where human review is required
- which risks must trigger escalation
- what the AI may and may not claim on behalf of the company

This is an operating policy, not legal advice.

## Policy Objectives
- keep outputs truthful and reviewable
- prevent unsupported claims and misleading guidance
- require human review for high-stakes actions
- support safe use across enterprise, government, and consumer contexts
- make AI behavior explainable enough for users and staff to trust it appropriately

## Approved AI Use Cases
Monyawn may use AI for:
- structured intake assistance
- fit and risk analysis
- positioning and artifact drafting
- outreach drafting
- interview preparation
- offer and decision support
- evidence retrieval and summarization
- workflow recommendation and checkpointing

## Restricted AI Use Cases
AI must not autonomously:
- send external communications on behalf of a user without required review
- fabricate work history, qualifications, credentials, or domain depth
- make legal, regulatory, security, privacy, accessibility, or financial commitments on behalf of Monyawn
- represent undocumented compliance or certification status
- bypass required human review on high-stakes outputs

## Human Review Requirements
Human review is required before final external use of:
- tailored resume outputs
- recruiter or outreach drafts
- compensation or offer recommendations
- outputs flagged by a high-risk checkpoint
- any output required by account-specific or market-specific policy

## Required AI Behavior
AI systems used by Monyawn must:
- distinguish evidence from inference
- provide confidence signals where applicable
- degrade gracefully when evidence is weak
- escalate controlled-domain questions to the correct role
- avoid overstating certainty
- preserve user edit and override capability where applicable

## Disallowed Claims
Unless supported by an approved source-of-truth document, AI must not state:
- "Monyawn is compliant with..."
- "Monyawn is certified for..."
- "Monyawn guarantees..."
- "Monyawn accepts these legal terms..."
- "Monyawn will use your data in this exact way..." unless documented in privacy policy or contract

## Escalation Triggers
AI must escalate when:
- evidence is weak, conflicting, or incomplete
- truthfulness risk is medium or high
- privacy or security representations are requested
- legal or contractual commitments are requested
- accessibility conformance claims are requested
- pricing exceptions or financial promises are requested
- a user appears to be using the system to misrepresent themselves

## Explainability Standard
For user-facing decisions, AI should provide:
- what the recommendation is
- why it was made
- what evidence supports it
- what uncertainty remains
- what the user can review, edit, or override

## Data And Training Position
AI behavior involving customer data must follow the privacy policy and any account-specific contract terms.

If data usage for model improvement or training changes, this policy and related privacy documentation must be updated before the new behavior is presented as active.

## Policy Governance
Primary owners:
- Safety / Policy Lead
- Product Lead
- LLM / Agent Engineer

Consulted owners where applicable:
- Legal Counsel
- Privacy Lead
- Security Lead
- Accessibility Lead

## Review Cadence
This policy should be reviewed:
- before major product launches
- before new regulated-market expansion
- before major model behavior changes
- at least quarterly while the product is evolving rapidly

## Summary
Monyawn AI should act as a governed assistant and workflow engine, not as an unbounded autonomous actor. When in doubt, it should escalate, not over-claim.
