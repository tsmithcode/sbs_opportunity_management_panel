# Town Hall: End-to-End Page Improvement Plan

## Product Reset
The first page should be `Login`.

After login, the user should see `Get Started`.

From there, the product should behave like a guided opportunity operating system, not a collection of sections the user has to interpret.

North star:
- recruiter email arrives
- user drops in email, link, transcript, or note
- system structures the opportunity
- user confirms a few things
- system recommends the next step

Target promise:
`Most new opportunity events should be processable in under 5 minutes.`

---

## New End-to-End Page Flow

1. `Login`
2. `Get Started`
3. `New Signal Intake`
4. `Opportunity Confirm`
5. `Opportunity Home`
6. `Artifacts Review`
7. `Profile Confirm`
8. `Correspondence Drafts`
9. `Interview Support`
10. `Interview Debrief`
11. `Decision / Offer Review`
12. `Outcome and Export`

This is intentionally more pages, not fewer.

Each page gets one job.

---

## Page-by-Page Improvement Plan

## 1. Login
### Purpose
Get the user into the product with zero ambiguity.

### Current State
- No true login-first entry posture.
- Landing currently tries to explain the product before identity is settled.

### Target State
- Single-purpose authentication page.
- Options:
  - Sign in with Google
  - Sign in with Apple
  - Continue locally

### Rules
- No extra product education here.
- No complex layout.
- One sentence max beneath the title.

### Expert Gates
- Identity and Integrations Engineer
- Trust / Privacy Architect
- Principal Product Designer

---

## 2. Get Started
### Purpose
Orient the user and give them one obvious way to begin.

### Current State
- Landing is currently doing too much brand explanation.

### Target State
- One hero line.
- One primary CTA: `Add your first signal`
- Secondary CTA: `Open existing opportunity`

### Rules
- Maximum 3 major visible components.
- No card grid.
- The user should know what to do in under 3 seconds.

### Expert Gates
- CEO / Product Authority
- Principal Service Designer
- Principal Product Designer

---

## 3. New Signal Intake
### Purpose
Capture the real-world thing the user has right now.

### Supported Inputs
- recruiter email text
- job posting URL
- pasted job description
- interview transcript
- voice note
- manual note

### Current State
- Intake is still modeled too much as account/user/opportunity setup.

### Target State
- This becomes the real first workflow page after Get Started.
- The product asks:
  - `What do you have?`
- Then offers:
  - paste text
  - paste link
  - upload file
  - record or paste transcript

### Rules
- No long form.
- One large input surface.
- Autofill wherever possible.

### Expert Gates
- AI UX / Conversation Design Lead
- Lifecycle Intake Specialist
- Accessibility + Voice UX Specialist

---

## 4. Opportunity Confirm
### Purpose
Let the user confirm what the system inferred.

### Current State
- Opportunity details are still too manual.

### Target State
- AI proposes:
  - company
  - role
  - source
  - contact
  - pathway
  - likely stage
- User only corrects what is wrong.

### Rules
- Review-and-confirm page, not a blank form.
- Show confidence for inferred fields.
- Unknowns should be few and clearly requested.

### Expert Gates
- AI Systems Engineer
- Principal Workflow Architect
- Trust / Privacy Architect

---

## 5. Opportunity Home
### Purpose
Give the user one stable place to understand the current opportunity.

### Current State
- Workspace is improving, but still contains too many concepts at once.

### Target State
- This becomes the anchor page for one selected opportunity.
- It should show:
  - current stage
  - next recommended action
  - recent signals
  - progress

### Rules
- No more than 5 major visible components.
- One main working region.
- One right rail for support and status.

### Expert Gates
- Principal Product Designer
- Principal Workflow Architect
- Enterprise Data Entry Specialist (Salesforce Lens)

---

## 6. Artifacts Review
### Purpose
Review and refine source documents and AI summaries.

### Current State
- Artifact entry is still a manual form-first step.

### Target State
- Artifacts enter through signal ingestion when possible.
- This page is for reviewing:
  - extracted summary
  - artifact type
  - evidence notes
  - relevance

### Rules
- Focus on confirm-and-correct.
- Avoid making artifact classification the user’s burden unless needed.

### Expert Gates
- Enterprise Data Entry Specialist (Oracle Lens)
- AI UX / Conversation Design Lead

---

## 7. Profile Confirm
### Purpose
Let the user confirm or refine the candidate story inputs.

### Current State
- Profile confirmation is still somewhat form-shaped.

### Target State
- Pull prior data forward.
- Autofill from resume, prior opportunities, and saved profile.
- Highlight only what changed or is missing for this opportunity.

### Rules
- The user should not re-enter stable information.
- Reuse and inherit aggressively.

### Expert Gates
- Enterprise Data Entry Specialist (Salesforce Lens)
- Principal Service Designer

---

## 8. Correspondence Drafts
### Purpose
Help the user act on recruiter communications fast.

### Current State
- Correspondence exists, but it feels like a section rather than a triggered support flow.

### Target State
- If the user pastes a recruiter email, the product offers:
  - summarize email
  - detect ask
  - draft response
  - set next step

### Rules
- This should feel fast and energizing.
- Every recruiter email should produce an immediate useful output.

### Expert Gates
- AI UX / Conversation Design Lead
- Lifecycle Intake Specialist
- Principal Product Designer

---

## 9. Interview Support
### Purpose
Support the user before or during interview preparation.

### Current State
- Interview-specific lifecycle support is not strong enough yet.

### Target State
- Page should show:
  - interview context
  - likely focus areas
  - role-specific preparation
  - tailored prep notes
  - recommended response angles

### Rules
- Do not make the user build prep from scratch.
- This should feel like support, not homework.

### Expert Gates
- Principal Workflow Architect
- AI Systems Engineer
- Accessibility + Voice UX Specialist

---

## 10. Interview Debrief
### Purpose
Turn transcripts or debrief notes into actionable insight.

### Current State
- Transcript and debrief flow is not yet central enough.

### Target State
- User pastes transcript or notes.
- AI returns:
  - how the interview likely went
  - strengths shown
  - weak moments
  - unanswered concerns
  - follow-up draft
  - updated opportunity confidence

### Rules
- This should be a first-class page.
- Transcript ingestion must feel native.

### Expert Gates
- AI UX / Conversation Design Lead
- AI Systems Engineer
- Trust / Privacy Architect

---

## 11. Decision / Offer Review
### Purpose
Help the user make a calm decision when the stakes rise.

### Current State
- Post-interview and offer-review lifecycle is underdeveloped in the main UX.

### Target State
- Decision page should support:
  - interview outcome interpretation
  - offer structure review
  - compensation context
  - next-step recommendation

### Rules
- One decision page, not fragmented sections.
- Strong AI support, but clear human control.

### Expert Gates
- CEO / Product Authority
- Principal Workflow Architect
- Trust / Privacy Architect

---

## 12. Outcome and Export
### Purpose
Close the loop and preserve value from the opportunity.

### Current State
- Export exists, but outcome closure is not yet emotionally or structurally central enough.

### Target State
- Capture:
  - awarded
  - denied
  - withdrawn
  - lessons learned
  - reusable insights
- Then produce:
  - export packet
  - reusable memory for autofill

### Rules
- The user should feel the work was not wasted.
- This page should reinforce the learning loop and future speed.

### Expert Gates
- Content Strategist
- Enterprise Data Entry Specialist (Salesforce Lens)
- CEO / Product Authority

---

## Pages To Merge, Reduce, or Remove

### Merge
- current landing + orientation logic -> split into `Login` and `Get Started`
- current workspace step complexity -> move into dedicated lifecycle pages

### Reduce
- generic form-heavy intake
- section-based correspondence flow
- overloaded workspace surface

### Promote
- recruiter email intake
- transcript ingestion
- interview debrief
- decision and offer review

---

## Uniformity Rules Across Every Page
- same location for page title
- same location for primary action
- same location for progress or state
- same location for support rail when present
- same form rhythm and field grouping
- same contrast standard and focus behavior

Users should never have to relearn the app from page to page.

---

## Success Standard
The product is on the right path when:
- a recruiter email feels like an exciting input, not a chore
- the user can enter a new signal in under 5 minutes
- AI autofills known information aggressively
- transcripts become immediate insight, not storage
- every page feels calm, sparse, and obvious
- getting lost feels impossible

---

## Recommended Immediate Execution Order
1. Add `Login` as the true first page.
2. Replace current landing logic with `Get Started`.
3. Make `New Signal Intake` the main entry into opportunity creation.
4. Convert manual opportunity setup into `Opportunity Confirm`.
5. Decompose current workspace into lifecycle pages instead of one overloaded operational page.
6. Make transcript and recruiter email handling first-class.
7. Enforce uniformity and accessibility review across every page.
