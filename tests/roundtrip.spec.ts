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
  await page.getByRole("button", { name: "Load mock bag" }).click();
  await page.waitForURL(/#workspace/);
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

test("full lifecycle flow works and exports ZIP", async ({ page }) => {
  await loadMockWorkspace(page);

  // Initial stage should be 'intake_started' or similar, then advance
  const advanceButton = page.getByRole("button", { name: "Level up the play" });
  const stageDisplay = page.locator(".text-sm.font-semibold.text-brand-ink").first();

  // Advance to intake_complete
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible(); // Should not be blocked
  await expect(stageDisplay).toContainText(/INTAKE_COMPLETE/i);

  // Advance to fit_review
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible();
  await expect(stageDisplay).toContainText(/FIT_REVIEW/i);

  // Advance to positioning
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible();
  await expect(stageDisplay).toContainText(/POSITIONING/i);

  // Advance to outreach_ready (might require human review, but should still proceed for this test)
  await advanceButton.click();
  // Expect a human review notice, but not a blocking error
  await expect(notice(page)).toContainText(/human review required/i);
  await expect(stageDisplay).toContainText(/OUTREACH_READY/i);

  // Advance to interview_active
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible();
  await expect(stageDisplay).toContainText(/INTERVIEW_ACTIVE/i);

  // Advance to debrief_captured
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible();
  await expect(stageDisplay).toContainText(/DEBRIEF_CAPTURED/i);

  // Advance to offer_review (might require human review)
  await advanceButton.click();
  await expect(notice(page)).toContainText(/human review required/i);
  await expect(stageDisplay).toContainText(/OFFER_REVIEW/i);

  // Advance to closed_won
  await advanceButton.click();
  await expect(notice(page)).not.toBeVisible();
  await expect(stageDisplay).toContainText(/CLOSED_WON/i);

  // Verify Export the ZIP
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export the ZIP" }).click(),
  ]);

  // Assert that the downloaded file has a .zip extension
  expect(download.suggestedFilename()).toMatch(/\.zip$/);
});
