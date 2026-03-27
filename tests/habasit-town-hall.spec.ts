import { expect, test, type Download, type Page } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import JSZip from "jszip";

const artifactRoot = path.resolve("output/playwright/habasit-town-hall");

function notice(page: Page) {
  return page.locator("p.notice[role='status']");
}

function ensureDir(pass: "web" | "mobile") {
  const dir = path.join(artifactRoot, pass);
  mkdirSync(dir, { recursive: true });
  return dir;
}

async function saveDownload(download: Download, pass: "web" | "mobile", preferredName: string) {
  const filePath = path.join(ensureDir(pass), preferredName);
  await download.saveAs(filePath);
  return filePath;
}

async function screenshot(page: Page, pass: "web" | "mobile", name: string, fullPage = false) {
  await page.screenshot({
    path: path.join(ensureDir(pass), name),
    fullPage,
  });
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

async function selectHabasitWorkspace(page: Page, roleTitle: string, userName: string) {
  const toolbar = page.locator(".desktop-toolbar");
  await toolbar.getByLabel("Account").selectOption({ label: "Habasit America - Suwanee 30 Day Sample" });
  await toolbar.getByLabel("User").selectOption({ label: userName });
  await toolbar.getByLabel("Opportunity").selectOption({ label: `Habasit America • ${roleTitle}` });
  await expect(page.getByRole("heading", { name: `Habasit America • ${roleTitle}` })).toBeVisible();
}

async function addTownHallArtifact(page: Page, label: string, note: string) {
  const artifactForm = page.locator("form").filter({
    has: page.getByRole("heading", { name: "4. Document intake and management" }),
  });
  await artifactForm.getByLabel("Artifact type").selectOption("note");
  await artifactForm.getByLabel("Source label").fill(label);
  await artifactForm.getByLabel("Evidence note").fill("CEO town hall live proof");
  await artifactForm.getByLabel("Content summary").fill(note);
  await artifactForm.getByRole("button", { name: "Add artifact" }).click();
  await expect(notice(page)).toContainText("Artifact recorded");
}

async function exportWorkspace(page: Page, pass: "web" | "mobile", name: string) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export handoff ZIP" }).click(),
  ]);
  return saveDownload(download, pass, name);
}

async function importWorkspace(page: Page, zipPath: string) {
  await page.getByRole("button", { name: "Reset seeded state" }).click();
  await page.getByTestId("workspace-import-input").setInputFiles(zipPath);
  await expect(notice(page)).toContainText("Platform import loaded");
}

async function expectHabasitZip(filePath: string) {
  const zip = await JSZip.loadAsync(readFileSync(filePath));
  const fileNames = Object.keys(zip.files);
  expect(fileNames).toContain("session.json");
  expect(fileNames).toContain("manifest.json");
  expect(fileNames.some((name) => name.startsWith("candidate-story/"))).toBeTruthy();
  expect(fileNames.some((name) => name.startsWith("pdf/") && name.endsWith(".pdf"))).toBeTruthy();

  const session = JSON.parse(await zip.file("session.json")!.async("string")) as {
    accounts: Array<{ account_name: string }>;
    opportunities: Array<{ company_name: string; role_title: string }>;
    sensitiveSupportProfiles: Array<{ categories: string[]; include_in_export: boolean }>;
    events: unknown[];
  };

  expect(
    session.accounts.some(
      (account) => account.account_name === "Habasit America - Suwanee 30 Day Sample",
    ),
  ).toBeTruthy();
  expect(
    session.opportunities.filter((opportunity) => opportunity.company_name === "Habasit America").length,
  ).toBeGreaterThanOrEqual(3);
  expect(session.events.length).toBeGreaterThan(0);
  expect(
    session.sensitiveSupportProfiles.some(
      (profile) => profile.include_in_export && profile.categories.includes("layoff"),
    ),
  ).toBeTruthy();
}

test.describe("Habasit America 30 day town hall proof", () => {
  test("web pass captures the Habasit sample and survives export/import", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 1440, height: 1100 });

    await resetWorkspace(page);
    await selectHabasitWorkspace(
      page,
      "Application Engineer, Conveyor Solutions",
      "Ava Coleman",
    );
    await screenshot(page, "web", "01-habasit-web-overview.png");

    await addTownHallArtifact(
      page,
      "CEO desktop pass note",
      "Desktop pass confirms Habasit sample data is legible, exportable, and materially closer to a product workspace than a demo surface.",
    );

    const zipPath = await exportWorkspace(page, "web", "habasit-web-pass.zip");
    await expectHabasitZip(zipPath);

    await importWorkspace(page, zipPath);
    await selectHabasitWorkspace(
      page,
      "Application Engineer, Conveyor Solutions",
      "Ava Coleman",
    );
    await page.getByRole("button", { name: "Admin and governance" }).click();
    await expect(page.getByTestId("admin-desktop-overview")).toBeVisible();
    await screenshot(page, "web", "02-habasit-web-admin.png");
  });

  test("mobile pass captures the Habasit sample and preserves support boundaries", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 430, height: 932 });

    await resetWorkspace(page);
    await selectHabasitWorkspace(
      page,
      "Fabrication Technician, Timing Belt Operations",
      "Darius Reed",
    );
    await screenshot(page, "mobile", "01-habasit-mobile-overview.png");

    await expect(page.getByRole("heading", { name: "3 paths enabled" })).toBeVisible();

    const zipPath = await exportWorkspace(page, "mobile", "habasit-mobile-pass.zip");
    await expectHabasitZip(zipPath);

    await importWorkspace(page, zipPath);
    await selectHabasitWorkspace(
      page,
      "Customer Operations And Continuous Improvement Lead",
      "Melissa Grant",
    );
    await page.getByRole("button", { name: "Admin and governance" }).click();
    await expect(page.getByTestId("admin-desktop-overview")).toBeVisible();
    await screenshot(page, "mobile", "02-habasit-mobile-admin.png");
  });
});
