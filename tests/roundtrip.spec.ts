import { expect, test, type Page } from "@playwright/test";

const notice = (page: Page) => page.locator("p.notice[role='status']");

test("handoff zip restores workspace state after mutation", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByText("2 of 10 stages")).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export handoff ZIP" }).click(),
  ]);

  const handoffPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(handoffPath);

  await page.getByRole("button", { name: "Advance stage" }).click();
  await expect(page.getByText("3 of 10 stages")).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles(handoffPath);

  await expect(notice(page)).toContainText("Platform import loaded");
  await expect(page.getByText("2 of 10 stages")).toBeVisible();
});

test("buyer packet export downloads as a separate zip", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate buyer packet ZIP" }).click(),
  ]);

  const buyerPacketPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(buyerPacketPath);

  expect(download.suggestedFilename()).toContain("buyer-packet");
});

test("release readiness packet downloads as a separate zip", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);

  const packetPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(packetPath);

  expect(download.suggestedFilename()).toContain("release-readiness-packet");
});

test("release readiness packet can be imported for review", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);

  const packetPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(packetPath);

  await page.getByTestId("release-artifact-input").setInputFiles(packetPath);

  await expect(notice(page)).toContainText("artifact imported for review");
  await expect(page.getByText("Buyer-Facing Readiness Packet")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1 stored" })).toBeVisible();
});

test("release artifact review history survives handoff export and import", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [readinessDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);
  const readinessPath = testInfo.outputPath(readinessDownload.suggestedFilename());
  await readinessDownload.saveAs(readinessPath);

  await page.getByTestId("release-artifact-input").setInputFiles(readinessPath);
  await expect(page.getByRole("heading", { name: "1 stored" })).toBeVisible();

  await page.locator(".topbar-nav").getByRole("button", { name: "Workspace" }).click();
  const [handoffDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export handoff ZIP" }).click(),
  ]);
  const handoffPath = testInfo.outputPath(handoffDownload.suggestedFilename());
  await handoffDownload.saveAs(handoffPath);

  await page.getByRole("button", { name: /Go to Workspace/i }).click();
  await page.getByRole("button", { name: "Reset seeded state" }).click();
  await page.locator('input[type="file"]').first().setInputFiles(handoffPath);
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();
  await expect(page.getByRole("heading", { name: "1 stored" })).toBeVisible();
});

test("release artifact review history can be cleared for the current opportunity", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [readinessDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);
  const readinessPath = testInfo.outputPath(readinessDownload.suggestedFilename());
  await readinessDownload.saveAs(readinessPath);

  await page.getByTestId("release-artifact-input").setInputFiles(readinessPath);
  await expect(page.getByRole("heading", { name: "1 stored" })).toBeVisible();

  await page.getByRole("button", { name: "Clear review history" }).click();
  await expect(page.getByRole("heading", { name: "0 stored" })).toBeVisible();
});

test("release artifact review history can be filtered", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [readinessDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);
  const readinessPath = testInfo.outputPath(readinessDownload.suggestedFilename());
  await readinessDownload.saveAs(readinessPath);

  await page.getByTestId("release-artifact-input").setInputFiles(readinessPath);
  await expect(page.getByRole("heading", { name: "1 stored" })).toBeVisible();

  await page.getByRole("textbox", { name: "Search stored reviews" }).fill("Buyer-Facing");
  await expect(page.getByText("Showing 1 of 1 stored review")).toBeVisible();

  await page.getByRole("textbox", { name: "Search stored reviews" }).fill("no-match-term");
  await expect(page.getByText("No matching reviews")).toBeVisible();
});

test("pinned release artifact reviews sort to the top", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  const [readinessDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Generate readiness packet ZIP" }).click(),
  ]);
  const readinessPath = testInfo.outputPath(readinessDownload.suggestedFilename());
  await readinessDownload.saveAs(readinessPath);

  const [summaryDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download release summary JSON" }).click(),
  ]);
  const summaryPath = testInfo.outputPath(summaryDownload.suggestedFilename());
  await summaryDownload.saveAs(summaryPath);

  await page.getByTestId("release-artifact-input").setInputFiles(readinessPath);
  await page.getByTestId("release-artifact-input").setInputFiles(summaryPath);
  await expect(page.getByRole("heading", { name: "2 stored" })).toBeVisible();

  await page.getByRole("button", { name: "Pin review" }).first().click();

  const history = page.getByTestId("release-review-history");
  await expect(history.locator('[data-testid^="release-review-item-"]').first()).toContainText(
    "Pinned",
  );
});
