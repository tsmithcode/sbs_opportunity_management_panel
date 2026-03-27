import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const outputDir = path.join(cwd, "output", "release");
const generatedAt = new Date().toISOString();

const summary = {
  generatedAt,
  product: "Monyawn",
  phase: "Release artifacts and automated verification summary export",
  localChecks: [
    "npm run build",
    "npm run smoke",
    "npm run roundtrip",
    "npm run verify",
    "npm run smoke:cross-browser",
  ],
  ciChecks: [
    "GitHub Actions verify workflow runs npm run verify.",
    "GitHub Actions verify workflow runs cross-browser smoke on chromium, firefox, and webkit.",
  ],
  coverage: [
    "Production build verification",
    "Chromium smoke verification for guided, admin, and About surfaces",
    "Chromium round-trip verification for handoff ZIP and buyer packet ZIP",
    "Cross-browser smoke verification for chromium, firefox, and webkit",
  ],
  knownLimits: [
    "Round-trip verification remains Chromium-only.",
    "Verification status is exported as repo and CI artifacts rather than a hosted dashboard.",
  ],
  expertOwners: [
    "CI / Release Automation Lead",
    "Browser Compatibility Lead",
    "QA / Reliability Lead",
    "Engineering Lead",
    "Release Manager",
    "Benchmarking And Evaluation Lead",
  ],
  generatedFiles: [
    "output/release/verification-summary.json",
    "output/release/verification-summary.md",
  ],
};

const markdown = `# Verification Summary

Generated: \`${generatedAt}\`

## Summary
Monyawn release verification is scripted, automated, and exportable.

## Local Checks
${summary.localChecks.map((item) => `- \`${item}\``).join("\n")}

## CI Checks
${summary.ciChecks.map((item) => `- ${item}`).join("\n")}

## Coverage
${summary.coverage.map((item) => `- ${item}`).join("\n")}

## Known Limits
${summary.knownLimits.map((item) => `- ${item}`).join("\n")}

## Expert Owners
${summary.expertOwners.map((item) => `- \`${item}\``).join("\n")}
`;

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "verification-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(path.join(outputDir, "verification-summary.md"), `${markdown}\n`, "utf8");

process.stdout.write(
  `Wrote release artifacts:\n- output/release/verification-summary.json\n- output/release/verification-summary.md\n`,
);
