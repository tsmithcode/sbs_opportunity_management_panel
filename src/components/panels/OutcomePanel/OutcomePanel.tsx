import { useState } from "react";
import { OutcomePanelProps } from "./OutcomePanel.contract";

export function OutcomePanel({ opportunityId, existingOutcome, onSubmit, onGenerateBlog }: OutcomePanelProps) {
  const [resolution, setResolution] = useState(existingOutcome?.resolution ?? "awarded");
  const [lessons, setLessons] = useState(existingOutcome?.lessons_learned ?? "");
  const [marketIntel, setMarketIntel] = useState(existingOutcome?.market_intelligence ?? "");
  const [contentPotential, setContentPotential] = useState(existingOutcome?.content_potential ?? "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      opportunity_id: opportunityId,
      resolution: resolution as any,
      lessons_learned: lessons,
      market_intelligence: marketIntel,
      content_potential: contentPotential as any,
    });
  };

  return (
    <div className="stage-block outcome-panel">
      <h3>Opportunity Resolution 🥱</h3>
      <p>Turn this outcome into easy leverage for your next high-stakes move.</p>
      
      <form onSubmit={handleSubmit} className="field-stack">
        <label className="field">
          <span>Resolution 🥱</span>
          <select value={resolution} onChange={e => setResolution(e.target.value as any)}>
            <option value="awarded">Awarded / Offer Accepted 🥱</option>
            <option value="denied">Denied / Offer Declined</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>

        <label className="field">
          <span>Lessons Learned</span>
          <textarea 
            rows={3} 
            value={lessons} 
            onChange={e => setLessons(e.target.value)} 
            placeholder="What did this process teach you about your narrative or technical fit?"
          />
        </label>

        <label className="field">
          <span>Market Intelligence</span>
          <textarea 
            rows={3} 
            value={marketIntel} 
            onChange={e => setMarketIntel(e.target.value)} 
            placeholder="Any insights on company culture, tech stack, or hiring trends?"
          />
        </label>

        <label className="field">
          <span>Content Potential</span>
          <select value={contentPotential} onChange={e => setContentPotential(e.target.value as any)}>
            <option value="low">Low - Internal Only</option>
            <option value="medium">Medium - Great for Portfolio</option>
            <option value="high">High - Blog / Marketing Asset</option>
          </select>
        </label>

        <div className="platform-button-row" style={{ marginTop: '1.5rem' }}>
          <button className="primary-action" type="submit">Save Outcome</button>
          <button 
            className="secondary-action" 
            type="button" 
            onClick={onGenerateBlog}
            disabled={!lessons}
          >
            Generate Blog Asset (Markdown + JSONL)
          </button>
        </div>
      </form>
    </div>
  );
}
