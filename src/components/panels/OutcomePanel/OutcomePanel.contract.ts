export interface OutcomeMetadata {
  outcome_id: string;
  opportunity_id: string;
  resolution: "awarded" | "denied" | "withdrawn";
  lessons_learned: string;
  market_intelligence: string;
  content_potential: "low" | "medium" | "high";
  blog_article_generated: boolean;
  updated_at: string;
}

export interface OutcomePanelProps {
  opportunityId: string;
  existingOutcome?: OutcomeMetadata;
  onSubmit: (outcome: Omit<OutcomeMetadata, "outcome_id" | "updated_at" | "blog_article_generated">) => void;
  onGenerateBlog: () => void;
}
