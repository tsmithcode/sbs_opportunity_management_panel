import { expect, test } from "@playwright/test";

test.describe("Performance Regression Tests", () => {
  test("initial app load time < 3s", async ({ page: _page }) => {
    // Navigate to the root URL and measure the time to load
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`Initial app load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test("workspace render time < 500ms after mock data load", async ({ page: _page }) => {
    // Navigate to the login page
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Click "Load mock bag" and measure render time
    const startTime = Date.now();
    await page.getByRole("button", { name: "Load mock bag" }).click();
    await page.waitForURL(/#workspace/);
    await page.waitForLoadState("domcontentloaded"); // Ensure DOM is ready

    // Await for a significant element in the workspace to be visible to ensure rendering
    await expect(page.locator("h1")).toContainText("money cockpit", { timeout: 10_000 });
    const endTime = Date.now();
    const renderTime = endTime - startTime;

    console.log(`Workspace render time after mock data load: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(500); // 500 milliseconds
  });
});
