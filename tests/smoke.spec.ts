import { expect, test } from "@playwright/test";

test("login page loads with brand message and local entry CTA", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.getByRole("heading", {
      name: "Opportunity management that feels calm from the first click.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue locally" })).toBeVisible();
});

test("guided workspace loads with core lifecycle controls", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "Workspace" }).click();

  await expect(page.locator("h1")).toContainText("Operational cockpit", { timeout: 15_000 });
  await expect(page.getByRole("button", { name: /Export ZIP/i })).toBeVisible();
  await expect(page.getByLabel("Switch Opportunity")).toBeVisible();
});

test("admin mode exposes enterprise controls and buyer packet generation", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "Workspace" }).click();
  await page.getByRole("button", { name: "ADMIN", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Enterprise control profile" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entitlements and admin controls" })).toBeVisible();
});

test("about page exposes direction and downloadable resume", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "About" }).click();

  await expect(
    page.getByRole("heading", {
      name: "A product brief, release posture, and expert panel in one disciplined page.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Monyawn exists to help users pursue opportunities with stronger judgment, better narrative clarity, and a calmer system for complex decisions.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification posture" })).toBeVisible();

  const resumeLink = page.getByRole("link", { name: "Download Thomas Smith Resume" });
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute("href", "/thomas-smith-architect-resume.pdf");
});
