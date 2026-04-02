# Town Hall: AI-Native Low-Cognitive-Load Data Entry Sweep

## Objective
Make the full journey from first intake to award feel as easy, calm, and minimal as possible while still supporting high-stakes, high-data workflows.

The standard is not "better forms."

The standard is:
- the user brings raw input
- the system structures it
- AI proposes the draft
- the user confirms or corrects
- the workflow advances with visible confidence checkpoints

This is the target posture for desktop first. Mobile follows only after the desktop model is disciplined enough to shrink cleanly.

---

## Current Rating
- Current end-to-end data-entry ease: `6.5 / 10`
- Near-term expected outcome after full desktop sweep: `8.8 / 10`
- Expected outcome after mobile follow-on and assisted capture integrations: `9.1 / 10`

### Why It Is Not Higher Yet
- Too many moments still require typing instead of approving.
- The user still has to understand the workflow structure more than they should.
- Some screens are now visually tighter, but cognitively they still behave like forms instead of assisted capture flows.
- AI is present, but not yet native enough to remove major effort.

---

## Required Expert Panel

### Core Product and Experience Panel
- **CEO / Founder / Product Authority**
  - Protect the product thesis: calm, premium, high-trust, high-outcome.
- **Principal Product Designer**
  - Enforce minimal UI, disciplined page shape, and premium hierarchy.
- **Principal Service Designer**
  - Reduce steps, collapse decisions, and remove avoidable user effort.
- **AI UX / Conversation Design Lead**
  - Replace manual entry with intelligent prompts, confirmation, and guided correction.
- **Principal Workflow Architect**
  - Decide what should be inferred, automated, checkpointed, or skipped.
- **Trust / Privacy Architect**
  - Ensure AI-native capture remains local-first, explicit, and user-controlled.
- **Accessibility + Voice UX Specialist**
  - Ensure transcription, dictation, and assisted entry reduce effort instead of increasing confusion.

### Enterprise Data Entry Panel
- **Enterprise Data Entry Specialist (Salesforce Lens)**
  - Optimize for task velocity, field grouping, smart defaults, and progressive disclosure.
  - Bring expectations from CRM-grade workflows where users tolerate data entry only if the system clearly does most of the work.
- **Enterprise Data Entry Specialist (Oracle Lens)**
  - Bring rigor from dense enterprise workflows: required-field strategy, validation timing, and low-error completion behavior.
  - Ensure complex data models do not leak complexity into the UI.
- **Lifecycle Intake Specialist (Tax / CarMax / Regulated Capture Lens)**
  - Study how users complete high-friction intake when trust, identity, personal data, and completion speed all matter.
  - Emphasize prefill, guided sequencing, save confidence, and "you are almost done" reassurance patterns.

### Technical Enablement Panel
- **Identity and Integrations Engineer**
  - Own Sign in with Google, Apple, Gmail, calendar, and document ingestion strategy.
- **AI Systems Engineer**
  - Own structured extraction, confidence scoring, checkpoint orchestration, and local-first AI patterns.
- **Platform Reliability Engineer**
  - Ensure assisted capture remains fast, resilient, and transparent when integrations fail or are absent.

---

## Product Thesis
The easiest experience is not fewer fields alone.

The easiest experience is:
- fewer original thoughts required
- fewer irreversible decisions up front
- fewer screens that ask the user to translate reality into system language
- more AI-assisted structuring
- more high-confidence prefilling
- more calm review checkpoints

The UI should feel closer to:
- OpenAI for visual restraint
- CarMax for guided trust and staged commitment
- taxes software for confidence-oriented progress and assisted completion
- Salesforce and Oracle for enterprise-grade data-entry expectations, but without their visible complexity

---

## Hard Product Constraints

### Primary Rule
We would rather have more pages than one overloaded page.

If a page tries to do too many jobs, split the page.

### Maximum Visible Component Budget Per Page
- default maximum: `5` major visible components on desktop
- aspirational maximum for high-stakes entry screens: `3` major components
- one page may have:
  - `1` primary working surface
  - `1` secondary guidance or status rail
  - up to `3` supporting utility regions only if they materially reduce effort

### What Counts As A Major Component
- a form block
- a summary block
- a status panel
- a table or record list
- a card group acting like a section
- a guidance or AI panel

Small inline controls do not count by themselves. Large grouped regions do.

### Page Word Budget
- target visible body copy per screen: `60-120` words
- soft ceiling for visible body copy per screen: `150` words
- any screen exceeding that must justify why the copy reduces effort instead of adding it
- headings, labels, button text, and hidden expandable help do not count the same as long paragraphs

### Decision Budget
- no screen should ask the user to make more than `1` primary decision at a time
- no screen should present more than `2` competing primary actions
- the user should always know:
  - what this screen is for
  - what the next action is
  - why the system is asking for this now

### Split-Page Rule
Split a page immediately if:
- the creator cannot explain where to look first in under five seconds
- the page contains more than one true form in focus
- the right rail becomes mandatory to understand the left side
- the user has to scroll to understand the page structure
- a new user could not tell what to do next from the first viewport

### Accessibility and Contrast Rule
High accessibility is not optional. Contrast and clarity are part of the product thesis.

Required standard:
- all body text and interactive controls must meet strong contrast expectations
- hierarchy must remain clear without relying on color alone
- muted text must still be readable for real users, not just technically present
- status, success, warning, and privacy states must remain understandable in grayscale and reduced color contexts
- focus states must be visually obvious
- touch and click targets must remain generous

### Simplicity Benchmark
The product should trend toward:
- easier than Workday
- closer to setting up a new iPhone
- impossible to get lost in
- calm enough that the user never needs to study the interface before acting

---

## North Star Interaction Model

### The Golden Pattern
1. User drops in raw signal.
2. System extracts structure.
3. AI proposes a draft.
4. User confirms or corrects only what matters.
5. Confidence checkpoint decides whether to advance, warn, or request more detail.

### The Wrong Pattern
1. User opens a long form.
2. User manually types everything.
3. System validates late.
4. User wonders which fields matter.
5. User feels like the workflow is work.

---

## Desktop Program

### Phase 1: Cognitive Load Audit and Triage
**Goal:** identify every place the user is forced to think, type, search, translate, or re-enter data unnecessarily.

#### Deliverables
- screen-by-screen cognitive load audit
- field inventory by source-of-truth
- visible component count per page
- visible word count estimate per page
- contrast and accessibility risk review per page
- explicit classification for every field:
  - must type
  - should infer
  - should prefill
  - should import
  - should remain hidden unless needed

#### Required Gates
- Principal Service Designer
- Enterprise Data Entry Specialist (Salesforce Lens)
- Enterprise Data Entry Specialist (Oracle Lens)
- CEO / Product Authority

#### Success Criteria
- no screen contains fields that exist only because the model is convenient for the system
- every field has a reason to be visible
- every high-effort field has a plan for eventual automation or assist
- every page stays within the component budget unless an expert gate explicitly approves an exception
- every page has a clear first-look focal point
- low-contrast text or weak state distinction is treated as a blocking issue, not polish debt

### Phase 2: Assisted Intake First
**Goal:** make intake feel like capture and confirmation, not setup labor.

#### Features
- resume upload -> candidate profile draft
- job posting URL or pasted job text -> opportunity draft
- optional voice note -> AI summary draft for role context
- Sign in with Google or Apple -> identity and email prefill

#### UX Rules
- one primary ask per screen
- if the screen needs more than one real ask, split it
- hide advanced fields behind confidence or correction states
- surface "we filled this for you" language calmly
- ask for confirmation before asking for invention

#### Required Gates
- AI UX / Conversation Design Lead
- Identity and Integrations Engineer
- Trust / Privacy Architect
- Accessibility + Voice UX Specialist

#### Success Criteria
- most users can complete first intake with upload + review + confirmation
- manual account and user typing is reduced to the minimum viable set

### Phase 3: Assisted Workspace Data Entry
**Goal:** make artifacts, profile shaping, correspondence, posture, and support feel like low-effort review work.

#### Features
- artifact ingest suggestions
- AI-generated evidence notes and summaries
- profile correction suggestions based on uploaded resume and job text
- correspondence drafts generated from opportunity context
- posture suggestions for 1099 pathways
- AI-native support checkpoints with clear privacy boundary

#### UX Rules
- the left side is always the working surface
- the right side informs, reassures, and suggests
- the system should recommend the next move before the user asks
- no more than one true form in focus at a time
- if a step needs too much supporting context, convert it into a separate review page rather than adding more panels

#### Required Gates
- Principal Product Designer
- Principal Workflow Architect
- Enterprise Data Entry Specialist (Salesforce Lens)
- Enterprise Data Entry Specialist (Oracle Lens)

#### Success Criteria
- each step can be understood in under five seconds by scanning only title, body, and primary action
- the majority of new data is confirm-and-correct rather than compose-from-scratch

### Phase 4: Confidence Checkpoints and AI-Native Guidance
**Goal:** make AI feel like an operating partner, not a hidden assistant.

#### Features
- explicit confidence states:
  - high confidence: ready to accept
  - medium confidence: needs review
  - low confidence: ask user for one specific missing input
- checkpoint prompts like:
  - "I filled this from your resume."
  - "I inferred this from the job posting."
  - "I need one more detail to finalize this step."
- lightweight audit trail for what AI touched

#### Required Gates
- AI Systems Engineer
- Trust / Privacy Architect
- CEO / Product Authority

#### Success Criteria
- users feel helped, not overridden
- confidence language reduces uncertainty rather than adding complexity

### Phase 5: Integrations and Effort Compression
**Goal:** remove repetitive data entry with smart ingestion.

#### Integration Candidates
- Gmail
- Google Drive / Docs
- Google Sign-In
- Apple Sign-In
- voice transcription
- calendar / interview event capture
- structured email import

#### Priority Order
1. Google Sign-In
2. resume and job posting ingestion
3. Gmail / correspondence import
4. voice transcription for notes and intake narration
5. calendar / interview capture

#### Required Gates
- Identity and Integrations Engineer
- Platform Reliability Engineer
- Trust / Privacy Architect

#### Success Criteria
- a large share of data entry becomes import + approval
- repeated opportunity setup gets faster over time

---

## Desktop Heuristics
- default to fewer fields
- default to fewer components
- default to fewer words
- prefer review over entry
- prefer inference over asking
- prefer smart defaults over blank states
- prefer one strong action over many equivalent actions
- validate early when it reduces wasted effort
- validate late when early validation would add stress
- never show the data model if the user can just express the real-world thing
- if the page feels crowded, split the page before shrinking the UI further
- strong contrast beats subtle aesthetics when the two are in tension

### Desktop Acceptance Rubric
For a page to pass desktop review:
- the creator can explain the page in one sentence
- a new user can identify the main action in under five seconds
- the page stays within the component budget
- the page stays within the word budget unless explicitly justified
- the page passes a contrast and focus-state review
- the page does not require the user to understand the whole workflow to complete the current step

---

## Mobile Follow-On Program
Mobile should not begin as a styling pass.

Mobile begins only after the desktop interaction model is stable.

### Mobile Phase 1: Information Architecture Compression
- reduce visible options further
- define strict thumb-friendly action priorities
- identify which desktop side rail content becomes inline context versus drawers

### Mobile Phase 2: Touch and Ergonomics
- shorten tap paths
- increase single-action clarity
- convert long review surfaces into collapsible chunks
- preserve one-task-at-a-time flow

### Mobile Phase 3: Mobile Feel and Motion
- quiet, premium motion
- strong iPhone-like pacing
- no cluttered stacked cards
- preserve calm, not novelty

### Mobile Phase 4: Mobile QA and Accessibility
- field focus behavior
- keyboard overlap
- dictation and voice note behavior
- hit target review
- dynamic text and zoom review

### Mobile Required Gates
- Mobile UX Specialist
- Accessibility + Voice UX Specialist
- Principal Product Designer
- Trust / Privacy Architect

---

## Metrics

### Core Outcome Metrics
- time to first completed opportunity
- average number of fields typed manually
- percentage of fields prefilled or inferred
- first-session completion rate
- correction rate after AI suggestion
- drop-off by step
- number of user-authored characters per completed opportunity

### Experience Metrics
- perceived effort
- trust in AI-generated structure
- clarity of next step
- confidence that data remains private

---

## Expected Outcome
If this program is executed with discipline:
- the system shifts from "form-driven app" to "AI-native guided capture workflow"
- user effort drops materially
- completion speed improves significantly
- desktop becomes calm enough to compress into mobile without breaking

### Final Rating Projection
- current: `6.5 / 10`
- after full desktop sweep: `8.8 / 10`
- after mobile plus integrations: `9.1 / 10`

This is a realistic premium outcome, not hype.

Getting beyond that requires:
- deep integrations
- excellent transcription and structured extraction
- very high trust in AI checkpoints
- relentless removal of unnecessary user choices

---

## CEO Visibility Note
The goal is not to impress the user with more AI.

The goal is to make the user feel like the system quietly did most of the work.

That is what "AI-native with minimum cognitive load" should mean here.
