# Town Hall: The "Max Yield" Opportunity Engine Execution Plan

## Objective
Enable the user to push 10+ high-stakes opportunities through Monyawn with minimal effort and maximum secondary yield (content, marketing, research). Transform the system from a "Tracker" to a "High-Velocity Opportunity Engine." 🥱

---

## Expert Panel Consensus
- **LLMOps Engineer (Expert 25):** We will leverage the OpenAI API (GPT-4o-mini) to turn raw emails and artifacts into high-leverage narratives. Cost-efficiency is achieved by using the API only when needed, with local rule-based fallback.
- **Content Strategist (Expert 26):** Every outcome is an asset. Denials provide "Market Gaps" research; Awards provide "Success Case Studies." The engine will automatically generate a ZIP containing `article.md` and `metadata.jsonl` for every opportunity.
- **Staff UX Architect:** 10 opportunities must feel snappy. We will implement "Opportunity Cockpit" quick-actions and clear "Leverage Scores" to gamify the completion of the 10 use cases.
- **CEO/Founder:** The system must act as a "Guardian Angel." It shouldn't just store data; it should *educate* the user on why their skills are worth $100k-$300k+ while they work.

---

## Multi-Phase Execution Plan

### Phase 1: High-Velocity Outcome Cataloging (P0) - [COMPLETED]
- Implement the `OutcomePanel` to capture "Awarded 🥱", "Denied", or "Withdrawn".
- Add metadata for `Lessons Learned` and `Market Intelligence`.
- Integrate the **Leverage Score 🥱** to show progress across the 10 use cases.

### Phase 2: The Content Factory (P0) - [COMPLETED]
- Feature: "Export as Blog Asset."
- Logic: Transform the Candidate Story + Outcome into a branded Markdown article and a structured JSONL metadata file.
- Packaging: Export as a portable ZIP for immediate marketing or research use.

### Phase 3: AI Narrative Uplift (P1) - [IN PROGRESS]
- Transition from local signal extraction to full **OpenAI Intelligence**.
- Allow users to input their own API key (browser-local storage) for high-yield, personalized storytelling.
- Add "Educational Tooltips" that explain the business logic behind AI suggestions.

### Phase 4: Snappy Batch Management (P1)
- Optimize the Opportunity Switcher for 10+ items.
- Implement "Bulk Export" for all 10 use cases to generate a "Season Report" (Season = current interview season).
- Performance Pass: Ensure the SPA remains zero-latency even with 10+ rich narratives stored in localStorage.

---

## CEO Visibility Note
This plan transforms Monyawn from a utility into a **Value Multiplier**. Even if a job is denied, the user gains a market research asset and a lessons-learned blog post, ensuring their time is never wasted. 🥱
