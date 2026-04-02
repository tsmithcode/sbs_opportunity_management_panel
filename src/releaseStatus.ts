export const releaseStatus = {
  summary:
    "Proof is scripted, fast, and worth the cost. Local and CI run the same high-ROI gates so we can ship fast without paying for fake confidence.",
  lastValidatedPhase: "Lean unit + Chromium verify stack",
  localChecks: [
    "npm run build",
    "npm run test:unit",
    "npm run test:smoke",
    "npm run test:integration",
    "npm run verify",
  ],
  ciChecks: [
    "GitHub Actions static-checks job runs build + unit tests.",
    "GitHub Actions browser-checks job runs Chromium smoke + focused integration tests.",
    "GitHub Actions deploy job publishes to GitHub Pages on main after verify passes.",
  ],
  currentCoverage: [
    "Production build check",
    "Unit coverage for workflow logic, integrity checks, completion scoring, and package utilities",
    "Chromium smoke for login, workspace, admin, and About",
    "Chromium integration for ZIP export/import restore",
    "Chromium integration for admin proof import flow",
  ],
  currentLimits: [
    "Browser proof is Chromium-only by design to keep the gate fast and cheap.",
    "There is no backend/API contract layer because the app is still local-first and browser-only.",
    "Manual non-Chromium checks should only be run when a UI change justifies them.",
  ],
  expertOwners: [
    "Test Pyramid Lead",
    "Unit Coverage Lead",
    "Browser ROI Lead",
    "CI / Release Lead",
    "Static Quality Lead",
    "QA / Reliability Lead",
    "Engineering Lead",
  ],
} as const;
