# Pipeline Stage Definition Template

## Purpose
Define consistent stages for data capture, automation triggers, reporting, and accountability.

## Stage Table

| Stage | Entry Criteria | AI Actions | Human Actions | Exit Criteria | Required Artifacts |
|---|---|---|---|---|---|
| Intake started | Opportunity created | Validate minimum fields, request missing inputs | Confirm opportunity basics | Required intake fields complete | Resume, JD or equivalent |
| Intake complete | Source artifacts received | Extract profile, identify gaps, prepare fit review | Correct extracted data | Candidate profile confirmed | Intake record |
| Fit review | Profile confirmed | Generate fit memo, strengths, risks, recommendation | Review pursue/pass/defer output | Decision recorded | Fit memo |
| Positioning | Pursue decision is active | Draft story, proof points, resume guidance | Review and edit narrative | Positioning approved | Story pack |
| Outreach ready | Positioning approved | Draft outreach artifacts | Approve or reject outbound drafts | Approved message available | Outreach drafts |
| Interview active | Interview scheduled | Generate prep pack and question bank | Rehearse, review, update notes | Round completed | Prep pack |
| Debrief captured | Interview complete | Summarize signals and update risk profile | Confirm notes | Next-step plan recorded | Debrief |
| Offer review | Offer or comp discussion active | Analyze title, level, comp, tradeoffs | Review acceptance criteria | Decision recorded | Offer analysis |
| Closed won | Opportunity accepted | Archive artifacts and summarize outcome | Confirm closeout | Status complete | Final decision |
| Closed lost / pass | Opportunity declined or closed | Archive learnings and close tasks | Confirm closeout | Status complete | Final note |

## Stage Governance
- Every stage must have clear entry and exit criteria
- Every stage must define at least one AI checkpoint
- Human review is required before external-facing outputs are treated as final
- Reporting must use the same stage names across all use cases unless deliberately overridden
