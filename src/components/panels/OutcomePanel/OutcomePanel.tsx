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
    <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/40 border border-black/5 shadow-brand-shadow">
      <div>
        <h3 className="text-2xl font-bold text-brand-ink mb-1">How it ended</h3>
        <p className="text-sm text-brand-muted">Turn this into ammo for your next bag.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Outcome</span>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={resolution} 
            onChange={e => setResolution(e.target.value as any)}
          >
            <option value="awarded">Got it / Accepted</option>
            <option value="denied">Nope / Declined</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">What you learned</span>
          <textarea 
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
            rows={3} 
            value={lessons} 
            onChange={e => setLessons(e.target.value)} 
            placeholder="What did this teach you about your story or fit?"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Street intel</span>
          <textarea 
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
            rows={3} 
            value={marketIntel} 
            onChange={e => setMarketIntel(e.target.value)} 
            placeholder="Insights on culture, stack, or hiring moves?"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Share potential</span>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={contentPotential} 
            onChange={e => setContentPotential(e.target.value as any)}
          >
            <option value="low">Low - private</option>
            <option value="medium">Medium - portfolio ready</option>
            <option value="high">High - post it</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-black/5">
          <button className="bg-brand-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95" type="submit">Save outcome</button>
          <button 
            className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-2.5 rounded-xl font-medium hover:bg-black/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
            type="button" 
            onClick={onGenerateBlog}
            disabled={!lessons}
          >
            Generate share pack (MD + JSONL)
          </button>
        </div>
      </form>
    </div>
  );
}
