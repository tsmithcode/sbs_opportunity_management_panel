import { expect, test } from "@playwright/test";

test("landing page loads with brand message and CTA", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.getByRole("heading", {
      name: "Landing $100k-$300k+ roles should feel like a yawn.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Start my pursuit" })).toBeVisible();
});

test("guided workspace loads with core lifecycle controls", async ({ page }) => {
  await page.goto("/#workspace");
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.getByRole("heading", {
      name: "Opportunity platform operations, not just a demo wizard.",
    }),
  ).toBeVisible({ timeout: 15_000 });

  await expect(page.getByRole("button", { name: "Export handoff ZIP" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Import ZIP or JSON" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Opportunity" })).toBeVisible();
  await expect(page.getByText("Current operating context")).toBeVisible();
  await expect(page.getByTestId("desktop-opportunity-cockpit")).toBeVisible();
  await expect(page.getByText("Operational summary")).toBeVisible();
});

test("admin mode exposes enterprise controls and buyer packet generation", async ({ page }) => {
  await page.goto("/#workspace");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Admin and governance API, policy, and account controls" }).click();

  await expect(page.getByRole("heading", { name: "Enterprise control profile" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entitlements and admin controls" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate buyer packet ZIP" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run integrity check" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Integrity summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Release status" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Import release/readiness artifact" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate readiness packet ZIP" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download readiness packet MD" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear review history" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Search stored reviews" })).toBeVisible();
  await expect(page.getByText("Review history", { exact: true })).toBeVisible();
  await expect(page.getByText("Admin / Governance")).toBeVisible();
});

test("about page exposes direction and downloadable resume", async ({ page }) => {
  await page.goto("/#about");
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.getByRole("heading", {
      name: "A local-first platform built to help people move with clarity.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Monyawn exists to help users pursue opportunities with stronger judgment, better narrative clarity, and a calmer operating system for complex decisions.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Release confidence" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download release summary MD" })).toBeVisible();
  const resumeLink = page.getByRole("link", { name: "Download Thomas Smith Resume" });
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute("href", "/thomas-smith-architect-resume.pdf");
});
