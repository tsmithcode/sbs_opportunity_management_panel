import { AppState, CandidateStory, Opportunity } from "../../types";
import { nowIso } from "../../workflow";
import { slugify } from "../utils";

export async function buildBlogAssetZip(input: {
  opportunity: Opportunity;
  outcome: AppState["outcomes"][number];
  story?: CandidateStory;
}): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const generatedAt = nowIso();

  const title = input.outcome.resolution === "awarded" 
    ? `Monyawn Success Case Study 🥱: ${input.opportunity.role_title} at ${input.opportunity.company_name}`
    : `Monyawn Market Insights 🥱: Pursuing ${input.opportunity.role_title} at ${input.opportunity.company_name}`;

  const markdownContent = `# ${title}\n\nDate: ${generatedAt}\nResolution: ${input.outcome.resolution.toUpperCase()}\n\n## Overview\n${input.story?.summary || "No narrative summary provided."}\n\n## The Narrative\n${input.story?.markdown || "No detailed narrative provided."}\n\n## Lessons Learned\n${input.outcome.lessons_learned}\n\n## Market Intelligence\n${input.outcome.market_intelligence}\n`;

  const jsonlContent = JSON.stringify({
    timestamp: generatedAt,
    opportunity_id: input.opportunity.opportunity_id,
    company: input.opportunity.company_name,
    role: input.opportunity.role_title,
    resolution: input.outcome.resolution,
    content_potential: input.outcome.content_potential,
    lessons_learned: input.outcome.lessons_learned,
    market_intelligence: input.outcome.market_intelligence,
  }) + "\n";

  zip.file("article.md", markdownContent);
  zip.file("metadata.jsonl", jsonlContent);

  return zip.generateAsync({ type: "blob" });
}

export async function buildSeasonReportZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const generatedAt = nowIso();

  const reportFolder = zip.folder("season-report");
  const jsonlLines: string[] = [];

  for (const outcome of state.outcomes) {
    const opportunity = state.opportunities.find(o => o.opportunity_id === outcome.opportunity_id);
    const story = state.candidateStories.find(s => s.opportunity_id === outcome.opportunity_id);
    
    if (opportunity) {
      const title = outcome.resolution === "awarded" 
        ? `Monyawn Success Case Study 🥱: ${opportunity.role_title} at ${opportunity.company_name}`
        : `Monyawn Market Insights 🥱: Pursuing ${opportunity.role_title} at ${opportunity.company_name}`;

      const markdownContent = `# ${title}\n\nDate: ${outcome.updated_at}\nResolution: ${outcome.resolution.toUpperCase()}\n\n## Overview\n${story?.summary || "No narrative summary provided."}\n\n## The Narrative\n${story?.markdown || "No detailed narrative provided."}\n\n## Lessons Learned\n${outcome.lessons_learned}\n\n## Market Intelligence\n${outcome.market_intelligence}\n`;

      const jsonlEntry = JSON.stringify({
        timestamp: outcome.updated_at,
        opportunity_id: opportunity.opportunity_id,
        company: opportunity.company_name,
        role: opportunity.role_title,
        resolution: outcome.resolution,
        content_potential: outcome.content_potential,
        lessons_learned: outcome.lessons_learned,
        market_intelligence: outcome.market_intelligence,
      });
      
      jsonlLines.push(jsonlEntry);
      
      const fileScope = slugify(opportunity.company_name);
      const fileName = slugify(opportunity.role_title);
      reportFolder?.file(`${fileScope}-${fileName}.md`, markdownContent);
    }
  }

  zip.file("research-lake.jsonl", jsonlLines.join("\n") + "\n");
  zip.file("SUMMARY.md", `# Monyawn Season Report 🥱\n\nGenerated: ${generatedAt}\nTotal Outcomes: ${state.outcomes.length}\n\nThis report aggregates all cataloged outcomes into a research and marketing foundation.`);

  return zip.generateAsync({ type: "blob" });
}
