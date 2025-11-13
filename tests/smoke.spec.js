import { test, expect } from "@playwright/test";

test.describe("Smoke Tests - Critical Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage successfully", async ({ page }) => {
    // Check page loads and has correct title
    await expect(page).toHaveTitle(/Synkope/);

    // Check main heading is visible
    await expect(page.locator("h1")).toContainText("Erfarne rådgivere");

    // Check hero section loads
    await expect(page.locator(".hero")).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    // Check navigation menu is visible
    await expect(page.locator(".nav-menu")).toBeVisible();

    // Test one navigation link works
    await page.click('a[href="#om"]');
    await expect(page.locator("#om")).toBeInViewport();
  });

  test("should display all main sections", async ({ page }) => {
    // Verify critical sections exist
    await expect(page.locator("#om")).toBeVisible();
    await expect(page.locator("#team")).toBeVisible();
    await expect(page.locator("#tjenester")).toBeVisible();
    await expect(page.locator("#kontakt")).toBeVisible();
  });

  test("should display team members from JSON", async ({ page }) => {
    await page.click('a[href="#team"]');

    // Check team members are loaded (not showing "Loading...")
    const teamMembers = page.locator(".team-member");
    await expect(teamMembers).toHaveCount(4);

    // Wait for content to load from JSON
    const firstMemberDesc = page.locator(".team-member").first().locator(".team-info p");
    await expect(firstMemberDesc).not.toHaveText("Loading...", { timeout: 10000 });
  });

  test("should load without console errors", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Allow some known errors but fail on critical ones
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("404") &&
        !error.includes("X-Frame-Options") &&
        !error.includes("Content Security Policy") &&
        !error.includes("frame-ancestors") &&
        !error.includes("TLS handshake"),
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
