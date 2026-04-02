import { AppState, ExportPackageManifest } from "../types";

export * from "./utils";
export * from "./markdown";
export * from "./pdf";
export * from "./zip";

type ImportSuccess = {
  ok: true;
  state: AppState;
  warning?: string;
};

type ImportFailure = {
  ok: false;
  error: string;
};

export type ImportResult = ImportSuccess | ImportFailure;

export type ReleaseArtifactReview = {
  title: string;
  summary: string;
  sourceName: string;
  entries: string[];
  content: string;
};

type ReleaseArtifactImportResult =
  | {
      ok: true;
      artifact: ReleaseArtifactReview;
    }
  | {
      ok: false;
      error: string;
    };

export async function importStateFromFile(file: File): Promise<ImportResult> {
  try {
    if (file.name.endsWith(".json")) {
      const rawText = await file.text();
      const parsedState = JSON.parse(rawText) as AppState;
      return { ok: true, state: parsedState, warning: "Imported from legacy JSON export." };
    }

    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const sessionFile = zip.file("session.json");
    const manifestFile = zip.file("manifest.json");

    if (!sessionFile || !manifestFile) {
      return {
        ok: false,
        error: "Import failed. ZIP package must contain session.json and manifest.json.",
      };
    }

    const [sessionText, manifestText] = await Promise.all([
      sessionFile.async("string"),
      manifestFile.async("string"),
    ]);

    const parsedState = JSON.parse(sessionText) as AppState;
    const manifest = JSON.parse(manifestText) as ExportPackageManifest;

    const warning =
      manifest.schema_version !== parsedState.schemaVersion
        ? "Imported package schema and session schema differ. Session was loaded using session.json."
        : undefined;

    return { ok: true, state: parsedState, warning };
  } catch {
    return {
      ok: false,
      error: "Import failed. Please provide a valid Monyawn ZIP or legacy JSON export.",
    };
  }
}

export async function importReleaseArtifactForReview(
  file: File,
): Promise<ReleaseArtifactImportResult> {
  try {
    if (file.name.endsWith(".json")) {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      return {
        ok: true,
        artifact: {
          title: "Release summary JSON",
          summary: "Structured verification summary imported for in-app review.",
          sourceName: file.name,
          entries: Object.keys(parsed),
          content: JSON.stringify(parsed, null, 2),
        },
      };
    }

    if (file.name.endsWith(".md")) {
      const rawText = await file.text();
      const lines = rawText.split("\n").filter(Boolean);
      return {
        ok: true,
        artifact: {
          title: lines[0]?.replace(/^#\s+/, "") || "Markdown artifact",
          summary: "Markdown artifact imported for human review in admin mode.",
          sourceName: file.name,
          entries: lines
            .filter((line) => line.startsWith("## ") || line.startsWith("- "))
            .slice(0, 12),
          content: rawText,
        },
      };
    }

    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const readme = zip.file("README.md");
    const releaseSummary = zip.file("release-summary.md");
    const releaseSummaryJson = zip.file("release-summary.json");
    const readinessPacket = zip.file("buyer-readiness-packet.md");

    if (!readme || !releaseSummary || !releaseSummaryJson || !readinessPacket) {
      return {
        ok: false,
        error:
          "Review import failed. ZIP package must contain README.md, release-summary.md, release-summary.json, and buyer-readiness-packet.md.",
      };
    }

    const [readmeText, summaryText, summaryJsonText, readinessText] = await Promise.all([
      readme.async("string"),
      releaseSummary.async("string"),
      releaseSummaryJson.async("string"),
      readinessPacket.async("string"),
    ]);

    const parsedSummary = JSON.parse(summaryJsonText) as Record<string, unknown>;

    return {
      ok: true,
      artifact: {
        title: "Release readiness packet ZIP",
        summary: "Release summary and buyer-facing readiness materials imported for in-app review.",
        sourceName: file.name,
        entries: [
          "README.md",
          "release-summary.md",
          "release-summary.json",
          "buyer-readiness-packet.md",
          ...Object.keys(parsedSummary).slice(0, 6).map((key) => `summary key: ${key}`),
        ],
        content: [readmeText, "", summaryText, "", readinessText].join("\n"),
      },
    };
  } catch {
    return {
      ok: false,
      error:
        "Review import failed. Provide a release readiness ZIP, release summary JSON, or release/readiness Markdown file.",
    };
  }
}
