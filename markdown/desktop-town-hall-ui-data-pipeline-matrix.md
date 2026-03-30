# Desktop And Mobile Town Hall UI And Data Pipeline Matrix

## Purpose
Capture the current desktop and mobile UI and data-pipeline problems that block premium enterprise perception, assign owners, and make acceptance criteria explicit before declaring the frontend disciplined.

## Current Read
The current app is capable, but the operating surfaces need sharper discipline. Desktop was previously underselling the product through equal-weight card clutter, and mobile now needs its own proof lane so responsive quality is measured rather than assumed.

## Town Hall Matrix

| Topic | What Staff Is Reacting To | Current Benchmark | Expected Outcome Rating | Primary Owner | Required Experts | Blocking Issue |
|---|---|---|---|---|---|---|
| Desktop workspace hierarchy | The top workspace reads like equal-weight card clutter instead of a premium operating cockpit | 6.4/10 | 9.3/10 | Desktop Experience Director | UX Lead / Service Designer, Accessibility Lead, Frontend Engineer, Workflow Analyst, Visual QA Lead | Above-the-fold hierarchy is too flat |
| Action clarity | Primary actions compete with secondary admin and recovery actions | 7.0/10 | 9.2/10 | Product Lead / AI Product Architect | Desktop Experience Director, UX Writer / Content Designer, Frontend Engineer | Users do not get one dominant next move |
| Admin desktop credibility | Admin mode feels functionally rich but visually crowded | 6.8/10 | 9.1/10 | Enterprise Product Operations Lead | Entitlements And Admin Controls Lead, Desktop Experience Director, Visual QA Lead | Enterprise controls and release data compete for attention |
| Full lifecycle proof | There is no true three-scenario desktop E2E proof today | 4.9/10 | 9.4/10 | E2E Proof Lead | QA / Reliability Lead, Scenario Fixture Steward, Data Pipeline Validation Lead, Applied Opportunity Research Lead | Product claims outrun proof depth |
| Scenario repeatability | Current tests are too shallow and do not preserve realistic opportunity fixtures | 5.5/10 | 9.4/10 | Scenario Fixture Steward | E2E Proof Lead, Repository Steward / Documentation Systems Lead, Applied Opportunity Research Lead | No durable reusable scenario pack |
| Data pipeline confidence | Export/import works, but it is not yet proven across three realistic full journeys | 7.3/10 | 9.5/10 | Data Pipeline Validation Lead | Director Of Data Platform, Data Steward / Data Quality Lead, QA / Reliability Lead | Export/import proof is not scenario-complete |
| Sensitive-support discipline | Sensitive paths exist, but proof of export exclusion and optional inclusion is not institutionalized | 7.1/10 | 9.6/10 | Safety / Policy Lead | Privacy Lead, Career Development Coach Lead, Data Pipeline Validation Lead | No repeatable proof pack for sensitive-support boundaries |
| Desktop visual signoff | Screenshots exist, but visual acceptance has not been formalized | 5.8/10 | 9.2/10 | Visual QA Lead | Desktop Experience Director, Accessibility Lead, QA / Reliability Lead | No visual gate for premium desktop acceptance |
| Mobile workflow clarity | Mobile can function, but responsive hierarchy and touch priority are not yet enterprise disciplined | 6.2/10 | 9.0/10 | Mobile Experience Lead | UX Lead / Service Designer, Accessibility Lead, Frontend Engineer, Responsive QA Lead | Small-screen action order is not yet proven |
| Mobile lifecycle proof | There is no equivalent three-scenario mobile E2E proof today | 4.7/10 | 9.1/10 | E2E Proof Lead | Responsive QA Lead, QA / Reliability Lead, Scenario Fixture Steward, Data Pipeline Validation Lead | Responsive reliability is assumed, not proven |
| Mobile visual signoff | Breakpoint screenshots and touch acceptance are not formalized | 5.4/10 | 9.0/10 | Responsive QA Lead | Mobile Experience Lead, Accessibility Lead, QA / Reliability Lead | No mobile-specific screenshot gate |

## Required Consulting Group
- Desktop Experience Director
- UX Lead / Service Designer
- Accessibility Lead
- Frontend Engineer
- QA / Reliability Lead
- Data Steward / Data Quality Lead
- Workflow Analyst
- Career Development Coach Lead
- Safety / Policy Lead
- Data Pipeline Validation Lead
- Visual QA Lead
- E2E Proof Lead
- Mobile Experience Lead
- Responsive QA Lead

## Acceptance Before Calling The Frontend Premium
- The desktop cockpit has one dominant summary block, one clear status rail, and a compact action strip.
- The admin surface no longer feels like a grid of equal-weight operational cards.
- Three realistic scenario proofs complete from intake through terminal state.
- Export and import are proven for all three scenarios.
- Sensitive-support export exclusion is proven by default and optional inclusion is proven explicitly.
- Visual acceptance screenshots are captured and reviewed for guided and admin desktop states.
- Equivalent mobile scenario proofs complete across the same three journeys.
- Mobile screenshots are captured and reviewed for guided and admin responsive states.

## Habasit America Town Hall Pass

| Pass | Scope | Result | What Worked | What Failed First | Fix Applied |
|---|---|---|---|---|---|
| Web pass | Habasit America 30-day seeded sample, desktop, export/import, admin review | Passed | Selector rail, export/import, admin review, seeded support and lifecycle evidence | Workspace selector targeting was initially ambiguous because labels collided with intake forms | Targeted the desktop selector rail explicitly in proof flows |
| Mobile pass | Habasit America 30-day seeded sample, mobile, support-boundary proof, export/import | Passed | Responsive selector rail, support boundary visibility, export/import, admin review | Initial support assertion was too generic and not tied to the actual cockpit heading | Switched the proof to assert the exact responsive support state shown in-product |
| Extended desktop scenario suite | Generic three-scenario desktop suite | Passed | Full intake, profile, artifacts, correspondence, terminal states, ZIP restore | Status assertions became ambiguous once multiple live status regions existed | Moved proof to the action-notice channel instead of generic ARIA status |
| Extended mobile scenario suite | Generic three-scenario mobile suite | Not in default release gate | Responsive flows can run as extended proof | Runtime cost is still too high for the default release gate | Kept it as a separate extended-proof script while Habasit web/mobile proof covers the release gate |
