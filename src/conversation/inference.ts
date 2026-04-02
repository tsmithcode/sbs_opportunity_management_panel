import { SignalIntakePayload } from "../components/pages/SignalIntake/SignalIntakePage.contract";

export function extractRoleTitle(text: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const titledLine = lines.find((line) =>
    /\b(engineer|manager|designer|architect|specialist|developer|analyst|director|lead|consultant|recruiter|coordinator)\b/i.test(
      line,
    ),
  );

  if (titledLine) {
    return titledLine.slice(0, 80);
  }

  const roleMatch = text.match(
    /\b(?:role|position|opportunity|opening)\s*(?:for|as)?\s*:?[\s-]*([A-Z][A-Za-z0-9,&/()\- ]{4,80})/i,
  );

  return roleMatch?.[1]?.trim() ?? "";
}

export function inferCompanyFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const [first] = host.split(".");
    return first ? first.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "";
  } catch {
    return "";
  }
}

export function extractEmails(text: string) {
  return Array.from(
    new Set(Array.from(text.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi), (match) => match[0])),
  );
}

export function extractCompanies(text: string) {
  return Array.from(
    new Set(
      Array.from(
        text.matchAll(/\b(?:at|with|from|joining|role at|opportunity with)\s+([A-Z][A-Za-z0-9&.\- ]{2,40})\b/g),
        (match) => (match[1] ?? "").trim(),
      ).filter(Boolean),
    ),
  );
}

export function summarizeSignalText(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) {
    return "Imported signal";
  }
  return compact.length > 180 ? `${compact.slice(0, 177)}...` : compact;
}

export function getSignalArtifactType(signalType: SignalIntakePayload["signalType"]) {
  switch (signalType) {
    case "recruiter_email":
      return "message" as const;
    case "job_link":
    case "job_text":
      return "job_description" as const;
    case "transcript":
      return "debrief" as const;
    case "note":
    default:
      return "note" as const;
  }
}

export function getSignalSourceLabel(signal: SignalIntakePayload) {
  switch (signal.signalType) {
    case "recruiter_email":
      return "Recruiter email intake";
    case "job_link":
      return signal.signalUrl || "Job link intake";
    case "job_text":
      return "Job description intake";
    case "transcript":
      return "Interview transcript intake";
    case "note":
    default:
      return "Quick note intake";
  }
}
