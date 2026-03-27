# Workflow Stage Operating Matrix Template

## Purpose
Provide one stage-by-stage operating matrix that aligns onboarding, data capture, AI checkpoints, review ownership, retention, export, and reporting for enterprise-grade execution.

| Stage | Intake Fields Required | AI Checkpoint Trigger | Review Owner | Escalation Owner | Export Path | Retention Path | Reporting Mapping |
|---|---|---|---|---|---|---|---|
| Intake started | Account, user, company, role, source, region, sponsorship type | Opportunity created without full evidence set | Customer Success Lead | VP Product Operations | Opportunity export | Local active record plus user-owned export package | Opportunity creation, onboarding started |
| Intake complete | Resume, job description, candidate profile, accessibility needs | Candidate profile confirmed or missing critical fields | Data Steward / Data Quality Lead | Director Of Data Platform | Intake package export | Local active record plus user-owned export package | Intake completion rate |
| Fit review | Fit memo inputs, risk signals, evidence links | Fit recommendation requested | Opportunity Strategist | Safety / Policy Lead | Fit memo export | Local decision-support record plus export package | Fit review completion rate |
| Positioning | Resume guidance, proof points, approved framing inputs, candidate story inputs | Generated positioning draft or candidate story is ready | Resume And Positioning Architect | Knowledge Operations Lead | Positioning asset and candidate story export | Local approved artifact record plus export package | Positioning approval rate |
| Outreach ready | Correspondence draft, target contact, cadence notes | Correspondence draft enters review | CRM / Correspondence Operations Lead | Safety / Policy Lead | Approved correspondence export | Local communication record plus export package | Outreach approval rate |
| Interview active | Interview plan, question bank, prep notes, glossary and coaching references if used | Interview round prep or debrief update | Technical Interview Coach | Workflow Analyst | Prep pack export | Local active interview record plus export package | Interview conversion rate |
| Debrief captured | Debrief notes, concerns, strengths, follow-up promises | Debrief submitted | Workflow Analyst | VP Product Operations | Debrief export | Local interview audit record plus export package | Debrief completion and concern tracking |
| Offer review | Offer details, compensation inputs, acceptance criteria, compensation education references if used | Offer guidance requested | Compensation And Offer Analyst | Finance Lead | Offer review export | Local high-stakes decision record plus export package | Offer conversion rate |
| Closed won / lost | Outcome, rationale, archive references, handoff summary | Opportunity closure | Implementation Program Manager or Workflow Analyst | Records / Information Governance Lead | Outcome summary export | Archived in local history and user-owned package | Closed won / lost rate |

## Notes
- Extend stage rows when a new use case requires more specialized operating fields.
- Keep review and escalation owners role-based so staffing can remain flexible.
- Keep reporting terms aligned to the canonical metrics in `workflow-schema.md`.
