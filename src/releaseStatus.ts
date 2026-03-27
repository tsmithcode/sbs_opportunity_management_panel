export const releaseStatus = {
  summary:
    "Release verification is scripted, automated, and visible. Local verification and CI both run the same build and browser gates, with desktop and mobile end-to-end proof on Chromium.",
  lastValidatedPhase: "Desktop and mobile proof with release-status surfacing",
  localChecks: [
    "npm run build",
    "npm run smoke",
    "npm run desktop:e2e",
    "npm run mobile:e2e",
    "npm run roundtrip",
    "npm run verify",
    "npm run smoke:cross-browser",
  ],
  ciChecks: [
    "GitHub Actions verify workflow runs npm run verify on push, pull request, and manual dispatch.",
    "GitHub Actions cross-browser smoke matrix runs chromium, firefox, and webkit.",
  ],
  currentCoverage: [
    "Production build verification",
    "Chromium smoke verification for guided, admin, and About surfaces",
    "Chromium desktop end-to-end proof for three realistic opportunity scenarios",
    "Chromium mobile end-to-end proof for the same three realistic opportunity scenarios",
    "Chromium round-trip verification for handoff ZIP and buyer packet ZIP",
    "Cross-browser smoke verification for chromium, firefox, and webkit",
  ],
  currentLimits: [
    "Desktop and mobile end-to-end proof are Chromium-only.",
    "Round-trip export/import verification remains Chromium-only.",
    "CI result status is surfaced through repo docs and workflow files, not a hosted dashboard.",
  ],
  expertOwners: [
    "Desktop Experience Director",
    "Mobile Experience Lead",
    "E2E Proof Lead",
    "Data Pipeline Validation Lead",
    "Visual QA Lead",
    "Responsive QA Lead",
    "CI / Release Automation Lead",
    "Browser Compatibility Lead",
    "QA / Reliability Lead",
    "Engineering Lead",
    "Release Manager",
  ],
} as const;
