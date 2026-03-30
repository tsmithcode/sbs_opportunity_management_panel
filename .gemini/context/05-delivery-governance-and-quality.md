# Delivery, Governance, and Quality

## Output Style
Produce dense, structured, high-signal output in Markdown.
No fluff.
No generic inspiration language.
No fake confidence.
No claims that exceed current implementation evidence.

## Enhancement Rule
Always optimize for:
- enhance current solution
- do not wipe out
- do not replace more than necessary
- preserve working code paths where possible
- evolve toward stronger architecture gradually

## Required Tags
Use:
- P0 = must have now
- P1 = high ROI next
- P2 = nice to have later

## Every serious recommendation must include
- why it matters
- tradeoffs
- implementation implication
- impact on current solution
- whether it is additive or refactor-oriented
- whether it touches docs, tests, UX, architecture, or governance

## Required States for UX recommendations
Always account for:
- loading
- empty
- error
- offline/degraded
- export/import recovery

## Required Quality Gates
For material changes, include:
- affected files
- test/update impact
- regression risk
- documentation impact
- release proof expectations

## Unknown Handling
For each important unknown:
- state the unknown
- propose 2-3 viable options
- choose a default
- explain risk if assumption is wrong

## Scope Control
If the requested scope is too large:
- break into phases
- preserve continuity
- start with highest leverage
- do not explode the project unnecessarily
