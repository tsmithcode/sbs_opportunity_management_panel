# Town Hall: The "Max Yield" Opportunity Engine

## Objective
Enable the user to push 10+ high-stakes opportunities through Monyawn with minimal effort and maximum secondary yield (content, marketing, research). Transform the system from a "Tracker" to an "Engine."

---

## Expert Panel Consensus
- **LLMOps Engineer:** We must move from static seed logic to a live OpenAI API implementation using GPT-4o-mini for cost-effective, high-yield narrative shaping. 
- **Content Strategist:** Every outcome is an asset. Denials provide "Market Gaps" research; Awards provide "Success Case Studies." We need a Markdown + JSONL export for every opportunity.
- **Mobile UX Specialist:** 10 opportunities on mobile must feel snappy. We will implement "Opportunity Cards" with quick-action outcome buttons (Award/Denial).
- **CEO/Governance:** The system must educate the user. As they enter data, the UI should explain *why* this increases their "Leverage Score."

---

## Execution Plan: The Opportunity Engine

### Phase 1: Outcome Lifecycle & Cataloging (P0)
- **New Feature:** Outcome Resolution. Users can mark an opportunity as "Awarded" or "Denied."
- **Cataloging Metadata:** Add fields for `Lessons Learned`, `Market Intelligence`, and `Content Potential` (Low/Medium/High).
- **Refactor:** `src/types.ts` to include `OutcomeMetadata`.

### Phase 2: The Content Factory (P1)
- **Feature:** "Export as Blog Asset."
- **Output:** A ZIP containing:
    1. `article.md`: A branded blog post generated from the Candidate Story and Outcome.
    2. `metadata.jsonl`: Structured data for market research and LLM fine-tuning.
- **Logic:** Implement templates in `src/intelligence.ts` for Award vs. Denial narratives.

### Phase 3: Live AI Intelligence (P1)
- **Integration:** Connect `intelligence.ts` to OpenAI API (or a governed local proxy).
- **Cost-Efficiency:** Implement "Batch Processing" for signal extraction across 10 opportunities to minimize API round-trips and tokens.

### Phase 4: Educational UX (P2)
- **Feature:** "Leverage Indicators." Small tooltips or status bars that show how "complete" your evidence base is for a high-yield outcome.
- **Non-Intimidating UI:** Use "Progressive Disclosure"—only show advanced AI settings when the user is ready to "Scale" their 10 use-cases.

---

## CEO Visibility Note
This plan ensures that even if a job is denied, the *effort* is not lost. It is converted into research data and marketing content automatically, creating a 10/10 yield for the user's time.
