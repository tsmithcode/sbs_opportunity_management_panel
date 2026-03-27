# Screen Ownership Map

## Purpose
Map the story framework wizard into concrete screens, owners, approval points, and quality requirements so the product behaves like a guided public-service workflow rather than a generic website.

## Product Direction
The primary experience should be a high-accessibility, low-cognitive-load wizard inspired by trusted public workflows such as voting or ballot-style systems:
- one primary task per screen
- large readable headings
- plain-language prompts
- obvious progress and next steps
- save and resume later
- visible review before commitment
- keyboard and screen-reader-first interaction design

## Core Screen Map

| Screen | User Goal | Primary Owner | Supporting Owners | Required Approvals | Notes |
|---|---|---|---|---|---|
| 1. Welcome / Start Opportunity | Understand what this tool does and begin with confidence | Product Lead | UX Lead, UX Writer, Accessibility Lead | Accessibility, QA | Should feel calm, official, and clear rather than promotional |
| 2. Guided Intake Overview | See the steps ahead before starting | UX Lead | UX Writer, Frontend Engineer | Accessibility, QA | Must set expectations for time, inputs, and save/resume behavior |
| 3. Upload Resume and Job Description | Provide required source artifacts | Frontend Engineer | UX Lead, Accessibility Lead, Knowledge Engineer | Accessibility, QA | Large targets, clear supported file types, recoverable upload errors |
| 4. Candidate Profile Check | Confirm extracted identity, skills, and constraints | Knowledge Engineer | UX Writer, Frontend Engineer, LLM / Agent Engineer | QA, Safety | User must be able to correct extraction mistakes easily |
| 5. Opportunity Fit Review | Understand fit, strengths, and risks | Product Lead | Knowledge Engineer, LLM / Agent Engineer, UX Lead | Safety, QA | Must show evidence and confidence, not just scores |
| 6. Pursue or Pass Decision | Decide whether to continue | Product Lead | UX Writer, Safety / Policy Lead | Safety | Use explicit tradeoffs and allow defer / revisit |
| 7. Positioning Story Builder | Build the candidacy narrative step by step | UX Lead | UX Writer, LLM / Agent Engineer, Knowledge Engineer | Safety, QA | This is the center of the story framework wizard |
| 8. Resume Review and Approve | Inspect tailored resume changes before use | UX Writer | Frontend Engineer, LLM / Agent Engineer, Safety / Policy Lead | Safety, QA | Must clearly separate sourced facts from generated framing |
| 9. Outreach Draft Review | Review recruiter email, LinkedIn message, and follow-up drafts | UX Writer | Hiring Process Operator equivalent, LLM / Agent Engineer | Safety, Human review | No outbound use without user approval |
| 10. Interview Prep Dashboard | Prepare for upcoming rounds | Product Lead | LLM / Agent Engineer, Knowledge Engineer, UX Lead | QA | Should branch by interview stage and surface top concerns |
| 11. Interview Round Prep | Practice one round at a time | UX Lead | UX Writer, Frontend Engineer, LLM / Agent Engineer | Accessibility, QA | One round, one objective, one prep path |
| 12. Debrief Capture | Record what happened after an interview | Frontend Engineer | UX Writer, Product Lead, Knowledge Engineer | QA | Fast entry on desktop or mobile matters here |
| 13. Offer Review | Compare comp, title, level, and trajectory | Product Lead | Safety / Policy Lead, Backend Engineer, UX Writer | Safety, QA | Strong review language required because stakes are high |
| 14. Final Recommendation | See the system's summary recommendation | Product Lead | Knowledge Engineer, LLM / Agent Engineer, Safety / Policy Lead | Safety | Must include rationale, confidence, and user override |
| 15. Evidence Explorer | Inspect why the system made its recommendations | Knowledge Engineer | Frontend Engineer, LLM / Agent Engineer | QA | Critical for trust and debugging |
| 16. Save / Resume and History | Return safely to prior work | Backend / Workflow Engineer | Frontend Engineer, QA Lead | QA | This is essential, not a nice-to-have |

## Screen Standards

### Interaction standard
Each screen should have:
- one primary question or action
- one primary call to action
- clear back and next controls
- visible progress indicator
- visible current step title
- plain-language supporting text

### Accessibility standard
Each screen must support:
- keyboard-only use
- visible focus states
- screen reader labels and landmarks
- 200 percent zoom without layout breakage
- mobile layout without horizontal scrolling
- high-contrast readable typography

### AI trust standard
Each AI-assisted recommendation screen must show:
- what the recommendation is
- why it was made
- what evidence supports it
- how confident the system is
- what the user can edit or override

## Review And Approval Points

| Screen Group | Human Review Required | Why |
|---|---|---|
| Resume and positioning outputs | Yes | Generated framing can drift beyond supported evidence |
| Outreach drafts | Yes | Outbound communication should never be sent without approval |
| Offer recommendations | Yes | Compensation and acceptance guidance are high-stakes |
| Fit and risk outputs | Recommended | Users should understand tradeoffs before acting on them |

## Production-Like Validation Matrix

| Validation Area | Required Condition | Owner |
|---|---|---|
| Browser coverage | Chrome, Safari, Edge, Firefox | QA Lead |
| Mobile coverage | iPhone Safari and Android Chrome | QA Lead |
| Keyboard proof | Full task completion without mouse | Accessibility Lead |
| Screen reader proof | VoiceOver and NVDA path validation | Accessibility Lead |
| Slow network behavior | No silent state loss during delays or reconnects | Backend / Workflow Engineer |
| Save/resume proof | Exact return to in-progress step after session break | Backend / Workflow Engineer |
| Zero-knowledge usability | First-run completion by new users without coaching | Research Lead |

## Design Direction Notes

### What the company should embrace
- calm formal structure
- service-style trust signals
- strong readability
- visible review states
- less browsing, more guided completion

### What the company should avoid
- homepage-heavy marketing feel
- dense dashboards as the default view
- hidden AI reasoning
- multi-column clutter for first-run users
- jargon-heavy expert language on primary screens

## Operating Recommendation
Make the wizard the default mode and treat expert dashboards as secondary support views. The product should feel like a guided civic workflow with strong trust cues, not like a generic SaaS site asking users to figure out where to click first.
