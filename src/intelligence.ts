import type {
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  ExtractedSignalSet,
  Opportunity,
  SourceArtifact,
  User,
} from "./types";
import { createId, nowIso } from "./workflow";

const EMPTY_SIGNALS: ExtractedSignalSet = {
  names: [],
  emails: [],
  phones: [],
  companies: [],
  locations: [],
  dates: [],
  times: [],
  interviews: [],
  contingencies: [],
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function collectMatches(text: string, pattern: RegExp): string[] {
  return unique(Array.from(text.matchAll(pattern), (match) => match[0]));
}

function collectCapture(text: string, pattern: RegExp): string[] {
  return unique(
    Array.from(text.matchAll(pattern), (match) => match[1] ?? "").filter(Boolean),
  );
}

export function extractSignalsFromText(
  text: string,
  fallbackCompany?: string,
): ExtractedSignalSet {
  if (!text.trim()) {
    return {
      ...EMPTY_SIGNALS,
      companies: fallbackCompany ? [fallbackCompany] : [],
    };
  }

  const emails = collectMatches(
    text,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  );
  const phones = collectMatches(
    text,
    /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g,
  );
  const dates = collectMatches(
    text,
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[a-z]*\s+\d{1,2},?\s+\d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/gi,
  );
  const times = collectMatches(
    text,
    /\b\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm)\b/g,
  );
  const names = unique([
    ...collectCapture(text, /(?:Thanks|Regards|Sincerely|Best|From)\s*,?\s*\n([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/g),
    ...collectCapture(text, /\b(?:with|from|by|contact|recruiter|manager)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g),
  ]);
  const companies = unique([
    ...(fallbackCompany ? [fallbackCompany] : []),
    ...collectCapture(text, /\b(?:at|with|from|joining|role at|opportunity with)\s+([A-Z][A-Za-z0-9&.\- ]{2,40})\b/g),
  ]);
  const locations = unique([
    ...collectMatches(text, /\b(?:Remote|Hybrid|On-site)\b/gi),
    ...collectMatches(text, /\b[A-Z][a-z]+,\s?[A-Z]{2}\b/g),
  ]);
  const interviews = unique(
    text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) =>
        /\b(interview|panel|recruiter|screen|onsite|on-site|hiring manager|debrief)\b/i.test(
          line,
        ),
      ),
    );
  const contingencies = unique(
    text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) =>
        /\b(contingency|backup|follow-up|if needed|reschedule|availability|reference check)\b/i.test(
          line,
        ),
      ),
    );

  return {
    names,
    emails,
    phones,
    companies,
    locations,
    dates,
    times,
    interviews,
    contingencies,
  };
}

export function mergeSignalSets(signalSets: ExtractedSignalSet[]): ExtractedSignalSet {
  return signalSets.reduce<ExtractedSignalSet>(
    (acc, current) => ({
      names: unique([...acc.names, ...current.names]),
      emails: unique([...acc.emails, ...current.emails]),
      phones: unique([...acc.phones, ...current.phones]),
      companies: unique([...acc.companies, ...current.companies]),
      locations: unique([...acc.locations, ...current.locations]),
      dates: unique([...acc.dates, ...current.dates]),
      times: unique([...acc.times, ...current.times]),
      interviews: unique([...acc.interviews, ...current.interviews]),
      contingencies: unique([...acc.contingencies, ...current.contingencies]),
    }),
    EMPTY_SIGNALS,
  );
}

function bulletOrFallback(values: string[], fallback: string): string {
  return values.length ? values.join(", ") : fallback;
}

export function generateCandidateStory(input: {
  user?: User;
  opportunity: Opportunity;
  profile?: CandidateProfile;
  artifacts: SourceArtifact[];
  correspondence: CorrespondenceItem[];
}): Omit<CandidateStory, "story_id" | "updated_at"> {
  const aggregatedSignals = mergeSignalSets([
    ...input.artifacts.map((artifact) => artifact.extracted_signals ?? EMPTY_SIGNALS),
    ...input.correspondence.map((item) => item.extracted_signals ?? EMPTY_SIGNALS),
  ]);

  const title = `${input.user?.full_name || "Candidate"} story for ${input.opportunity.company_name}`;
  const summary = `${input.opportunity.role_title} narrative built from lifecycle evidence, structured signals, and profile context.`;
  const who = input.profile?.experience_level || input.user?.current_role || "a professional in transition";
  const what = input.profile?.skills_summary || "translating prior experience into a clearer next-step story";
  const why =
    input.opportunity.opportunity_source
      ? `This opportunity matters because it connects through ${input.opportunity.opportunity_source} and aligns to the target role of ${input.opportunity.role_title}.`
      : `This opportunity matters because it is a concrete path toward ${input.opportunity.role_title}.`;
  const where = bulletOrFallback(
    aggregatedSignals.locations.length ? aggregatedSignals.locations : [input.opportunity.location_type],
    "the settings where this opportunity is expected to operate",
  );
  const when = bulletOrFallback(
    [...aggregatedSignals.dates, ...aggregatedSignals.times],
    "upcoming milestones are still being clarified",
  );
  const how = input.profile?.domain_strengths || "through evidence-backed communication, practical delivery, and steady follow-through";
  const gaps = input.profile?.declared_gaps || "No major gaps have been declared yet.";
  const proofPoints = bulletOrFallback(
    aggregatedSignals.companies.length
      ? aggregatedSignals.companies.map((company) => `Experience or signal linked to ${company}`)
      : input.artifacts.slice(0, 3).map((artifact) => artifact.source_label),
    "More proof points should be added through artifacts, correspondence, and debrief notes.",
  );
  const interviewCues = bulletOrFallback(
    aggregatedSignals.interviews,
    "No interview-specific signals captured yet.",
  );

  const markdown = `# ${title}

## Story Summary
${summary}

## Who
I am ${who}. My current narrative shows that I bring ${what}.

## What
I am pursuing the ${input.opportunity.role_title} opportunity at ${input.opportunity.company_name} with a focus on clear, supportable evidence rather than generic claims.

## Why
${why}

## Where
I create value in ${where}.

## When
The current timeline signals include ${when}.

## How
I communicate and execute by leaning on ${how}.

## Proof Points
${proofPoints}

## Gaps To Address
${gaps}

## Interview And Outreach Cues
${interviewCues}

## Structured Signals
- Names: ${bulletOrFallback(aggregatedSignals.names, "None captured")}
- Emails: ${bulletOrFallback(aggregatedSignals.emails, "None captured")}
- Phones: ${bulletOrFallback(aggregatedSignals.phones, "None captured")}
- Companies: ${bulletOrFallback(aggregatedSignals.companies, "None captured")}
- Locations: ${bulletOrFallback(aggregatedSignals.locations, "None captured")}
- Contingencies: ${bulletOrFallback(aggregatedSignals.contingencies, "None captured")}
`;

  return {
    opportunity_id: input.opportunity.opportunity_id,
    title,
    summary,
    markdown,
    status: "review",
    source_artifact_ids: input.artifacts.map((artifact) => artifact.artifact_id),
    source_correspondence_ids: input.correspondence.map((item) => item.correspondence_id),
  };
}

export function createCandidateStoryRecord(
  story: Omit<CandidateStory, "story_id" | "updated_at">,
): CandidateStory {
  return {
    story_id: createId("story"),
    updated_at: nowIso(),
    ...story,
  };
}
