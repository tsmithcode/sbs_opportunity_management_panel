# RACI By Product Phase

## Purpose
Define who is responsible, accountable, consulted, and informed as the SBS opportunity system shifts from a document pack into an accessibility-first story framework wizard for zero-knowledge users.

## Role Key
- Product Lead
- UX Lead
- Accessibility Lead
- UX Writer
- Knowledge Engineer
- LLM / Agent Engineer
- Frontend Engineer
- Backend / Workflow Engineer
- QA Lead
- Research Lead
- Safety / Policy Lead
- Program Manager

## RACI Legend
- `R` = Responsible for doing the work
- `A` = Accountable for final decision and completion
- `C` = Consulted before decisions are finalized
- `I` = Informed of progress and outcome

## Phase RACI

| Product Phase | Product Lead | UX Lead | Accessibility Lead | UX Writer | Knowledge Engineer | LLM / Agent Engineer | Frontend Engineer | Backend / Workflow Engineer | QA Lead | Research Lead | Safety / Policy Lead | Program Manager |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. Vision and scope alignment | A | R | C | C | C | C | I | I | I | C | C | R |
| 2. Wizard flow architecture | C | A/R | C | C | C | C | C | C | I | C | C | R |
| 3. Accessibility standards and acceptance criteria | I | C | A/R | C | I | I | C | C | C | C | C | I |
| 4. Content model and knowledge codification | C | C | I | C | A/R | C | I | C | I | I | C | I |
| 5. Agent orchestration and prompt policy | C | C | C | C | C | A/R | I | C | C | I | C | I |
| 6. Screen design and interaction states | C | A/R | C | C | I | I | C | I | I | C | I | I |
| 7. Frontend wizard implementation | I | C | C | C | I | C | A/R | C | C | I | I | I |
| 8. Backend state, save/resume, and workflow APIs | I | C | C | I | C | C | C | A/R | C | I | I | I |
| 9. Evidence, confidence, and explanation layer | C | C | C | C | A/R | R | C | C | C | I | C | I |
| 10. Safety rules and human-review gates | C | C | C | C | C | C | I | C | C | I | A/R | I |
| 11. Browser, device, and assistive-tech proof | I | C | C | I | I | I | C | C | A/R | C | C | I |
| 12. Zero-knowledge user validation | C | C | C | C | I | I | I | I | C | A/R | C | I |
| 13. Release readiness and production launch | A | C | C | I | I | I | C | C | R | C | C | R |

## Decision Notes

### 1. One flow owner
The UX Lead is accountable for the end-to-end wizard path. This prevents a page-by-page website mindset from reappearing.

### 2. Accessibility has approval power
The Accessibility Lead must be able to block interactions that fail keyboard navigation, screen reader clarity, zoom behavior, contrast, or readable form design.

### 3. Copy is workflow logic
The UX Writer is consulted on every core step because plain-language prompts, review text, and error handling are part of the product logic for zero-knowledge users.

### 4. Safety is not optional
The Safety / Policy Lead is accountable for approval gates around outbound messaging, truthfulness, and recommendation boundaries.

### 5. Production proof is a release gate
The QA Lead is accountable for browser, device, and assistive-technology proof in production-like conditions before release.

## Staffing Interpretation

### No additional hiring required
If all roles are already staffed, the key change is role emphasis and decision clarity, not adding headcount.

### Highest-influence roles for the wizard shift
- UX Lead
- Accessibility Lead
- UX Writer
- Frontend Engineer
- QA Lead

These roles should have more influence in this product direction than they would in a standard marketing or dashboard website.
