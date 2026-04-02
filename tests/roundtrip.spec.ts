import { expect, test, type Page } from "@playwright/test";

const STORAGE_KEY = "monyawn-platform-state-v1";

function notice(page: Page) {
  return page.getByRole("status");
}

async function loadMockWorkspace(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate((storageKey) => {
    window.localStorage.removeItem(storageKey);
    window.location.hash = "login";
  }, STORAGE_KEY);
  await page.reload();
  await page.getByText("Dev tools").click();
  await page.getByRole("button", { name: "Load mock data (dev)" }).click();
  await expect(page.locator("h1")).toContainText("money cockpit", { timeout: 15_000 });
}

test("admin review lane can import a downloaded release summary artifact", async ({
  page,
}, testInfo) => {
  await loadMockWorkspace(page);

  await page.getByRole("button", { name: "ADMIN", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Launch status" })).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download summary JSON" }).click(),
  ]);

  const summaryPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(summaryPath);

  await page.getByTestId("release-artifact-input").setInputFiles(summaryPath);

  await expect(notice(page)).toContainText("artifact imported for review");
  await expect(page.getByText(/Proof history \(1\)/i)).toBeVisible();
});
