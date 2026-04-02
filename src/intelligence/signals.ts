import { ExtractedSignalSet } from "../types";

export const EMPTY_SIGNALS: ExtractedSignalSet = {
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

export function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function collectMatches(text: string, pattern: RegExp): string[] {
  return unique(Array.from(text.matchAll(pattern), (match) => match[0]));
}

export function collectCapture(text: string, pattern: RegExp): string[] {
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
