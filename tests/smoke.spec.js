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
    // Check navigation container exists (nav-menu might be hidden on mobile)
    const navMenu = page.locator(".nav-menu");
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // On mobile, nav-menu is intentionally hidden (no hamburger menu in current design)
      // Just verify the navigation structure exists in DOM
      await expect(navMenu).toBeAttached();

      // Test that sections are accessible directly without navigation
      await page.goto("/#om");
      await expect(page.locator("#om")).toBeInViewport();
    } else {
      // On desktop, nav-menu should be visible
      await expect(navMenu).toBeVisible();
      await page.click('a[href="#om"]');
      await expect(page.locator("#om")).toBeInViewport();
    }
  });

  test("should display all main sections", async ({ page }) => {
    // Verify critical sections exist
    await expect(page.locator("#om")).toBeVisible();
    await expect(page.locator("#team")).toBeVisible();
    await expect(page.locator("#tjenester")).toBeVisible();
    await expect(page.locator("#kontakt")).toBeVisible();
  });

  test("should display team members from JSON", async ({ page, browserName }) => {
    // Skip this test on webkit due to known issue with loading local resources
    // Webkit in Playwright has issues with fetch/XHR to local dev server
    test.skip(browserName === "webkit", "Webkit has issues loading JSON from local server in test environment");
    // Navigate to team section - use goto with hash for more reliable navigation
    await page.goto("/#team");
    await page.waitForSelector("#team", { state: "visible" });

    // Wait for team members to be present in DOM
    const teamMembers = page.locator(".team-member");
    await teamMembers.first().waitFor({ state: "visible", timeout: 15000 });

    // Check we have the expected number of team members
    await expect(teamMembers).toHaveCount(4);

    // Wait for content to load from JSON by checking all team member descriptions
    // Some browsers (especially webkit/Safari) can be slower to load JSON
    const firstMemberDesc = page.locator(".team-member").first().locator(".team-info p");

    // Wait for the JSON content to actually load - retry with polling
    await expect(async () => {
      const text = await firstMemberDesc.textContent();
      expect(text).not.toBe("Loading...");
      expect(text.trim().length).toBeGreaterThan(10);
    }).toPass({ timeout: 20000, intervals: [500, 1000, 2000] });
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
        !error.includes("TLS handshake") &&
        !error.includes("TLS error") &&
        !error.includes("secure connection to fail"),
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
