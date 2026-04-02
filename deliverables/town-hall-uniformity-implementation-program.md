# Town Hall: Uniformity and Simplicity Implementation Program

## Objective
Take Monyawn from "improving screens" to a finished, uniform product system where users always know:
- where to look
- what this page is for
- what action matters now
- why the system is asking for it

This program exists because the app does not yet feel fully uniform end to end.

Current finish-state assessment:
- visual maturity: `7.5 / 10`
- workflow clarity: `6.5 / 10`
- consistency across pages: `6 / 10`
- finished-product feel overall: `6.5 - 7 / 10`

Target after this program:
- visual maturity: `9 / 10`
- workflow clarity: `9 / 10`
- consistency across pages: `9.25 / 10`
- finished-product feel overall: `9 / 10`

---

## Required Panel By Dimension

### Product and System
- CEO / Founder / Product Authority
- Principal Product Designer
- Principal Service Designer
- Principal Workflow Architect

### Enterprise Data Entry
- Enterprise Data Entry Specialist (Salesforce Lens)
- Enterprise Data Entry Specialist (Oracle Lens)
- Lifecycle Intake Specialist (Tax / CarMax / Regulated Capture Lens)

### AI-Native Experience
- AI UX / Conversation Design Lead
- AI Systems Engineer

### Accessibility and Trust
- Trust / Privacy Architect
- Accessibility + Voice UX Specialist

### Delivery and Platform
- Identity and Integrations Engineer
- Platform Reliability Engineer

---

## Non-Negotiable Rules
- We would rather have more pages than one overloaded page.
- Every screen gets one primary job.
- One page gets one focal point.
- No more than one true form in focus at a time.
- Default desktop maximum is `5` major visible components per page.
- High-stakes entry screens should aim for `3` major visible components or fewer.
- Low contrast is a blocking defect.
- Any layout exception must be explicitly approved by the panel.

---

## Canonical Page Grammar
Every screen should map to one of these page types.

### Type A: Guided Entry Page
- primary working surface on the left
- guidance or status rail on the right
- one primary action
- optional back action

### Type B: Review and Confirm Page
- AI-structured draft as the main body
- confidence and source context in the secondary rail
- accept, edit, or request-more-info actions

### Type C: Operational Workspace Page
- compact top orientation band
- single active working region
- secondary rail for next-step logic and system state

### Type D: Memo / Briefing Page
- product brief, governance, release status, or orientation content
- no feature sprawl
- reads like an executive memo, not a dashboard

If a screen does not fit one of these four types, it must justify why.

---

## Phased Implementation

## Phase 1: Layout Grammar and Inventory
**Goal:** classify every current screen and component against the canonical system.

### Deliverables
- page inventory
- component inventory
- page-type classification
- violations list
- overloaded page list
- candidate split map

### Required Gates
- Principal Product Designer
- Principal Service Designer
- CEO / Product Authority

### Definition of Done
- every screen is mapped to a canonical page type
- every violation is tagged as keep, merge, split, or remove
- the team no longer designs new pages ad hoc

---

## Phase 2: Uniformity System Pass
**Goal:** standardize page structure so the app stops feeling page-specific.

### Scope
- header behavior
- primary action placement
- progress placement
- right-rail rules
- spacing rhythm
- headline hierarchy
- form grouping rules

### Deliverables
- one true desktop page shell family
- one form layout standard
- one action-bar standard
- one right-rail standard

### Required Gates
- Principal Product Designer
- Principal Workflow Architect
- Enterprise Data Entry Specialist (Salesforce Lens)

### Definition of Done
- users can predict where primary action, context, and progress live on every page
- layout changes from page to page only when function genuinely changes

---

## Phase 3: Cognitive Load Reduction
**Goal:** remove ambiguity, excess components, and unnecessary reading.

### Scope
- enforce component budget
- enforce word budget
- reduce simultaneous choices
- split overloaded pages
- remove vague sections and internal-language UI

### Deliverables
- screen scorecard for:
  - component count
  - visible word load
  - primary decision count
  - clarity of next step
- page split recommendations implemented

### Required Gates
- Principal Service Designer
- Enterprise Data Entry Specialist (Oracle Lens)
- Lifecycle Intake Specialist (Tax / CarMax / Regulated Capture Lens)

### Definition of Done
- the creator can explain every page in one sentence
- a first-time user can identify the next action in under five seconds
- no page feels like a "control panel"

---

## Phase 4: AI-Native Assisted Capture
**Goal:** replace manual entry with structured inference, confirmation, and checkpointing.

### Scope
- resume and job-post ingestion
- AI draft generation
- confirm-and-correct flows
- confidence checkpoints
- optional voice input

### Deliverables
- assisted intake path
- assisted workspace editing path
- confidence-state model
- source attribution language

### Required Gates
- AI UX / Conversation Design Lead
- AI Systems Engineer
- Trust / Privacy Architect
- Accessibility + Voice UX Specialist

### Definition of Done
- the app feels like it is doing most of the work
- users spend more time approving than composing

---

## Phase 5: Accessibility and Contrast Enforcement
**Goal:** ensure clarity survives real-world conditions, not just ideal design review.

### Scope
- contrast review
- focus state review
- keyboard and tab order review
- reduced-color and grayscale review
- readability of muted text review
- hit-target and spacing review

### Deliverables
- component-level accessibility audit
- contrast remediation list
- required design token adjustments

### Required Gates
- Accessibility + Voice UX Specialist
- Principal Product Designer
- Trust / Privacy Architect

### Definition of Done
- no low-contrast blockers remain
- all primary flows remain clear without relying on color alone
- focus states are obvious throughout

---

## Phase 6: Integration and Effort Compression
**Goal:** make the easiest path also the fastest path.

### Scope
- Google sign-in
- Apple sign-in
- Gmail / message import
- voice transcription
- calendar and interview-context import

### Required Gates
- Identity and Integrations Engineer
- Platform Reliability Engineer
- Trust / Privacy Architect

### Definition of Done
- repeated data entry is replaced with import + review
- first-time setup burden drops materially

---

## Phase 7: Mobile Follow-On
**Goal:** shrink a disciplined system into mobile rather than redesign chaos for smaller screens.

### Scope
- mobile IA compression
- thumb-first action hierarchy
- panel-to-inline conversion rules
- mobile feel and pacing
- mobile accessibility QA

### Required Gates
- Mobile UX Specialist
- Accessibility + Voice UX Specialist
- Principal Product Designer
- Trust / Privacy Architect

### Definition of Done
- mobile feels like the same product, not a separate app
- no page is a stacked copy of desktop clutter

---

## Execution Order
1. Phase 1: Layout Grammar and Inventory
2. Phase 2: Uniformity System Pass
3. Phase 3: Cognitive Load Reduction
4. Phase 4: AI-Native Assisted Capture
5. Phase 5: Accessibility and Contrast Enforcement
6. Phase 6: Integration and Effort Compression
7. Phase 7: Mobile Follow-On

This order is intentional.

We do not add more AI, more integrations, or more mobile work before the product grammar is stable.

---

## Screen-Level Review Template
For every screen, the team must answer:
- What is this page for?
- What is the first thing the user should look at?
- What is the single primary action?
- Why is every major component on the page visible right now?
- Can any component be hidden, merged, deferred, or moved to another page?
- Does the page remain clear in high-contrast review?
- If the user saw this page for the first time, would they know what to do immediately?

If the team cannot answer those questions cleanly, the page is not done.

---

## Finish Criteria
The app can be considered a finished product when:
- page structure is predictable across the system
- no major screen violates the component budget without explicit approval
- no major screen feels overloaded to the creator
- the app feels guided rather than configurable
- AI reduces effort instead of adding explanation burden
- accessibility and contrast are visibly strong
- mobile inherits a disciplined system instead of patching desktop inconsistency

---

## CEO Visibility Note
This program is not about polishing isolated screens.

It is about making the product trustworthy through consistency.

The finished feeling comes from uniformity, clarity, and reduced effort more than from visual novelty.
