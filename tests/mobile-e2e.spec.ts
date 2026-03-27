import { expect, test, type Download, type Page } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import { desktopE2EScenarios, type DesktopE2EScenario } from "./fixtures/desktop-e2e/scenarios";

const mobileOutputRoot = path.resolve("output/playwright/mobile-e2e");

function notice(page: Page) {
  return page.locator("p.notice[role='status']");
}

test.use({
  viewport: { width: 430, height: 932 },
  isMobile: true,
  hasTouch: true,
});

function ensureScenarioDir(id: string) {
  const dir = path.join(mobileOutputRoot, id);
  mkdirSync(dir, { recursive: true });
  return dir;
}

async function screenshot(page: Page, scenarioId: string, name: string) {
  const dir = ensureScenarioDir(scenarioId);
  await page.screenshot({
    path: path.join(dir, name),
    fullPage: false,
  });
}

async function saveDownload(download: Download, scenarioId: string, preferredName?: string) {
  const dir = ensureScenarioDir(scenarioId);
  const filePath = path.join(dir, preferredName ?? download.suggestedFilename());
  await download.saveAs(filePath);
  return filePath;
}

async function loadZip(filePath: string) {
  return JSZip.loadAsync(readFileSync(filePath));
}

async function resetWorkspace(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Reset seeded state" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Opportunity platform operations, not just a demo wizard.",
    }),
  ).toBeVisible();
}

async function fillBaseRecords(page: Page, scenario: DesktopE2EScenario) {
  const accountForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "1. Account setup" }),
  });
  await accountForm.getByLabel("Account name").fill(scenario.persona.accountName);
  await accountForm.getByRole("button", { name: "Create account" }).click();

  const userForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "2. User onboarding" }),
  });
  await userForm.getByLabel("Full name").fill(scenario.persona.fullName);
  await userForm.getByLabel("Email").fill(scenario.persona.email);
  await userForm.getByLabel("Current role").fill(scenario.persona.currentRole);
  await userForm.getByLabel("Target role family").fill(scenario.persona.targetRoleFamily);
  await userForm.getByLabel("Accessibility needs").fill(scenario.persona.accessibilityNeeds);
  await userForm.getByRole("button", { name: "Create user" }).click();

  const opportunityForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "3. Opportunity intake" }),
  });
  await opportunityForm.getByLabel("Company name").fill(scenario.posting.company);
  await opportunityForm.getByLabel("Role title").fill(scenario.posting.roleTitle);
  await opportunityForm.getByLabel("Opportunity source").fill(scenario.posting.source);
  await opportunityForm.getByLabel("Posting URL").fill(scenario.posting.url);
  await opportunityForm.getByLabel("Employment type").fill(scenario.posting.employmentType);
  await opportunityForm.getByLabel("Location type").fill(scenario.posting.locationType);
  await opportunityForm.getByRole("button", { name: "Create opportunity" }).click();
  await expect(notice(page)).toContainText("Opportunity created");
}

async function addArtifacts(page: Page, scenario: DesktopE2EScenario) {
  const artifactForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "4. Document intake and management" }),
  });
  for (const artifact of scenario.artifacts) {
    await artifactForm.getByLabel("Artifact type").selectOption(artifact.type);
    await artifactForm.getByLabel("Source label").fill(artifact.label);
    await artifactForm.getByLabel("Evidence note").fill(artifact.evidenceNote);
    await artifactForm.getByLabel("Content summary").fill(artifact.contentSummary);
    await artifactForm.getByRole("button", { name: "Add artifact" }).click();
  }
}

async function fillProfile(page: Page, scenario: DesktopE2EScenario) {
  const profileForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "5. Candidate profile confirmation" }),
  });
  await profileForm.getByLabel("Skills summary").fill(scenario.profile.skillsSummary);
  await profileForm.getByLabel("Experience level").fill(scenario.profile.experienceLevel);
  await profileForm.getByLabel("Domain strengths").fill(scenario.profile.domainStrengths);
  await profileForm.getByLabel("Declared gaps").fill(scenario.profile.declaredGaps);
  await profileForm.getByRole("button", { name: "Save profile" }).click();
}

async function addCorrespondence(page: Page, scenario: DesktopE2EScenario) {
  const correspondenceForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "6. Correspondence operations" }),
  });
  await correspondenceForm.getByLabel("Channel").selectOption(scenario.correspondence.channel);
  await correspondenceForm.getByLabel("Subject").fill(scenario.correspondence.subject);
  await correspondenceForm.getByLabel("Body").fill(scenario.correspondence.body);
  await correspondenceForm.getByRole("button", { name: "Create correspondence draft" }).click();
}

async function configureSupport(page: Page, scenario: DesktopE2EScenario) {
  if (!scenario.support) {
    return;
  }

  const supportForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "Optional sensitive support path" }),
  });

  await supportForm
    .getByRole("checkbox", { name: "Enable local-only support guidance for this opportunity" })
    .check();

  for (const category of scenario.support.categories) {
    const label =
      category === "criminal_history"
        ? "Criminal history support"
        : category === "reentry"
          ? "Re-entry support"
          : category === "background_concern"
            ? "Background concern support"
            : category === "layoff"
              ? "Layoff support"
              : category === "fired"
                ? "Termination recovery support"
                : "Abrupt exit support";
    await supportForm.getByRole("checkbox", { name: label }).check();
  }

  await supportForm.getByLabel("Private notes").fill(scenario.support.notes);
  await supportForm
    .getByLabel("Encouragement and practical next-step plan")
    .fill(scenario.support.encouragementPlan);
  if (scenario.support.includeInExport) {
    await supportForm
      .getByRole("checkbox", { name: "Include this support profile in ZIP export" })
      .check();
  }
  await supportForm.getByRole("button", { name: "Save support settings" }).click();
}

async function generateStory(page: Page) {
  await page.getByRole("button", { name: "Generate story" }).click();
  await expect(notice(page)).toContainText("Candidate story generated");
}

async function moveToTerminal(page: Page, scenario: DesktopE2EScenario) {
  if (scenario.finalOutcome === "closed_lost") {
    for (let index = 0; index < 7; index += 1) {
      await page.getByRole("button", { name: "Advance stage" }).click();
    }
    await page.getByRole("button", { name: "Close as lost" }).click();
    await expect(notice(page)).toContainText("closed as lost");
    return;
  }

  for (let index = 0; index < 8; index += 1) {
    await page.getByRole("button", { name: "Advance stage" }).click();
  }
}

async function exportWorkspace(page: Page, scenarioId: string, preferredName = "handoff.zip") {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export handoff ZIP" }).click(),
  ]);
  return saveDownload(download, scenarioId, preferredName);
}

async function restoreWorkspace(page: Page, filePath: string, company: string, roleTitle: string) {
  await page.getByRole("button", { name: "Reset seeded state" }).click();
  await page.getByTestId("workspace-import-input").setInputFiles(filePath);
  await expect(notice(page)).toContainText("Platform import loaded");
  await expect(page.getByRole("heading", { name: `${company} • ${roleTitle}` })).toBeVisible();
}

async function expectBaseExportStructure(
  zip: JSZip,
  scenario: DesktopE2EScenario,
  supportIncluded: boolean,
) {
  const fileNames = Object.keys(zip.files);
  expect(fileNames).toContain("session.json");
  expect(fileNames).toContain("manifest.json");
  expect(fileNames).toContain("README.md");
  expect(fileNames).toContain("dictionaries/workflow-glossary.md");
  expect(fileNames.some((name) => name.startsWith("candidate-story/") && name.endsWith(".md"))).toBeTruthy();
  expect(fileNames.some((name) => name.startsWith("pdf/") && name.endsWith(".pdf"))).toBeTruthy();

  const session = JSON.parse(await zip.file("session.json")!.async("string")) as {
    opportunities: Array<{ company_name: string; role_title: string }>;
    candidateStories: Array<{ opportunity_id: string }>;
    tasks: unknown[];
    checkpoints: unknown[];
    correspondence: unknown[];
    events: unknown[];
    sensitiveSupportProfiles: Array<{ include_in_export: boolean; enabled: boolean }>;
  };

  expect(
    session.opportunities.some(
      (opportunity) =>
        opportunity.company_name === scenario.posting.company &&
        opportunity.role_title === scenario.posting.roleTitle,
    ),
  ).toBeTruthy();
  expect(session.candidateStories.length).toBeGreaterThan(0);
  expect(session.tasks.length).toBeGreaterThan(0);
  expect(session.checkpoints.length).toBeGreaterThan(0);
  expect(session.correspondence.length).toBeGreaterThan(0);
  expect(session.events.length).toBeGreaterThan(0);

  const hasSupportFolder = fileNames.some((name) => name.startsWith("support/"));
  expect(hasSupportFolder).toBe(supportIncluded);
  if (supportIncluded) {
    expect(
      session.sensitiveSupportProfiles.some((profile) => profile.enabled && profile.include_in_export),
    ).toBeTruthy();
  } else {
    expect(session.sensitiveSupportProfiles.every((profile) => !profile.include_in_export)).toBeTruthy();
  }
}

test.describe("mobile e2e proof suite", () => {
  for (const scenario of desktopE2EScenarios) {
    test(scenario.title, async ({ page }) => {
      test.setTimeout(300_000);

      await resetWorkspace(page);
      await screenshot(page, scenario.id, "01-mobile-home.png");

      await fillBaseRecords(page, scenario);
      await addArtifacts(page, scenario);
      await fillProfile(page, scenario);
      await addCorrespondence(page, scenario);
      await configureSupport(page, scenario);
      await generateStory(page);

      await screenshot(page, scenario.id, "02-mobile-story.png");

      const defaultExport = await exportWorkspace(page, scenario.id, "handoff-default.zip");
      const defaultZip = await loadZip(defaultExport);
      await expectBaseExportStructure(defaultZip, scenario, Boolean(scenario.support?.includeInExport));

      if (scenario.support && !scenario.support.includeInExport) {
        const supportForm = page.locator("form").filter({
          has: page.getByRole("heading", { name: "Optional sensitive support path" }),
        });
        await supportForm
          .getByRole("checkbox", { name: "Include this support profile in ZIP export" })
          .check();
        await supportForm.getByRole("button", { name: "Save support settings" }).click();
        const supportExport = await exportWorkspace(page, scenario.id, "handoff-with-support.zip");
        const supportZip = await loadZip(supportExport);
        await expectBaseExportStructure(supportZip, scenario, true);
      }

      await moveToTerminal(page, scenario);
      await screenshot(page, scenario.id, "03-mobile-terminal.png");

      const finalExport = await exportWorkspace(page, scenario.id, "handoff-terminal.zip");
      await restoreWorkspace(page, finalExport, scenario.posting.company, scenario.posting.roleTitle);

      await page.getByRole("button", { name: "Admin and governance" }).click();
      await expect(page.getByTestId("admin-desktop-overview")).toBeVisible();
      await screenshot(page, scenario.id, "04-mobile-admin-restored.png");
    });
  }
});
