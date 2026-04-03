import { expect, test } from "@playwright/test";

test("login page loads with brand message and local entry CTA", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  await expect(
    page.getByRole("heading", {
      name: "We finna get to the monyan, no cap. You hear me.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Run it local" })).toBeVisible();
});

test("guided workspace loads with core lifecycle controls", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Run it local" }).click();
  await page.getByRole("button", { name: "My bag" }).click();

  await expect(page.locator("h1")).toContainText("money cockpit", { timeout: 15_000 });
  await expect(page.getByRole("button", { name: /Export the ZIP/i })).toBeVisible();
  await expect(page.getByLabel("Switch Play")).toBeVisible();
});

test("admin mode exposes enterprise controls and buyer packet generation", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Run it local" }).click();
  await page.getByRole("button", { name: "My bag" }).click();
  await page.getByRole("button", { name: "ADMIN", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Boss controls" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Roles and access" })).toBeVisible();
});

test("about page exposes direction and downloadable resume", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Run it local" }).click();
  await page.getByRole("button", { name: "Rules" }).click();

  await expect(
    page.getByRole("heading", {
      name: "This is the money lane. No cap, no corporate zombie talk.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Monyawn helps you chase opportunities with clear proof, clear words, and a path to the bag.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification vibes" })).toBeVisible();

  const resumeLink = page.getByRole("link", { name: "Download Thomas Smith Resume" });
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute("href", "/thomas-smith-architect-resume.pdf");
});

test("conversation page exposes accessible tabs and edit dialog behavior", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.getByRole("button", { name: "Run it local" }).click();
  await page.getByRole("button", { name: "Drop first move" }).click();
  await expect(page).toHaveURL(/#proof-drop/);

  await expect(page.getByRole("tablist")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Data Entry", selected: true })).toBeVisible();
  await page.getByRole("tab", { name: "Journey" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Where you are");
  await page.getByRole("tab", { name: "Data Entry" }).click();

  await page.getByRole("radio", { name: /Quick note/i }).click();
  await page
    .getByRole("textbox", { name: "Paste the message, role text, transcript, or notes." })
    .fill("Recruiter note about a senior controls engineer role at Nova Robotics.");
  await page.getByRole("button", { name: "Save and keep moving" }).click();

  const editButton = page.getByRole("button", { name: "Edit" }).first();
  await editButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(editButton).toBeFocused();
});

test("stage advance is blocked by checkpoint enforcement", async ({ page }) => {
  // Load mock data and navigate to workspace
  await page.goto("/");
  await page.getByRole("button", { name: "Load mock bag" }).click();
  await page.waitForURL(/#workspace/);

  // Set the AI flag to true to enable AI checkpoints if not already
  await page.evaluate(() => {
    // This is a workaround for setting env vars in Playwright tests if not already done via config
    // In a real scenario, this would be set via test environment configuration
    (window as any).VITE_FLAG_OPENAI = "true";
  });

  // Attempt to advance stage (this should trigger a checkpoint and block)
  // The 'Level up the play' button is designed to advance the stage
  const advanceButton = page.getByRole("button", { name: "Level up the play" });
  await advanceButton.click();

  // Expect an error notice indicating the block
  await expect(page.getByRole("status", { name: /error/i })).toBeVisible();
  await expect(page.getByRole("status", { name: /error/i })).toContainText(
    /Stage advance blocked/i,
  );

  // Assert that the stage has not visually changed (e.g., still "INTAKE_STARTED" or initial stage)
  // This might require inspecting the stage display in the UI
  await expect(page.locator(".text-sm.font-semibold.text-brand-ink").first()).not.toContainText(
    /INTAKE_COMPLETE/i,
  );
});

test("AI story generation works when flag is enabled", async ({ page }) => {
  // Load mock data and navigate to workspace
  await page.goto("/");
  await page.getByRole("button", { name: "Load mock bag" }).click();
  await page.waitForURL(/#workspace/);

  // Ensure AI flag is enabled (via .env.example or test config)
  // For this test, we assume VITE_FLAG_OPENAI is true in the test environment
  // If not, it would need to be mocked or set before the test runs.

  // Click the 'Coaching' tab to reveal the AI generation button
  await page.getByRole("option", { name: "5. Moves" }).click(); // Selects the coaching step

  // Click the 'Generate with AI' button
  const generateAIButton = page.getByRole("button", { name: "Generate with AI" });
  await expect(generateAIButton).toBeVisible();
  await generateAIButton.click();

  // Expect a success notice
  await expect(page.getByRole("status", { name: /success/i })).toBeVisible();
  await expect(page.getByRole("status", { name: /success/i })).toContainText(
    /AI generated a new candidate story!/i,
  );

  // Optionally, verify that a new story entry is visible (might need to inspect state or UI)
  // For now, relying on the success notice. A more robust test would inspect the story content.
});
