import { chromium } from "@playwright/test";

/**
 * Global setup for Playwright tests
 * Runs once before all test files
 */
async function globalSetup() {
  console.log("🚀 Starting global test setup...");

  // Use localhost in all environments (webServer handles starting the dev server)
  const baseURL = "http://localhost:8000";

  console.log(`📍 Testing against: ${baseURL}`);

  // Launch a browser to verify the site is accessible
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log("🌐 Verifying website accessibility...");

    // Navigate to the homepage with a generous timeout
    await page.goto(baseURL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Verify basic page elements are loaded
    await page.waitForSelector("h1", { timeout: 10000 });
    await page.waitForSelector(".nav-menu", { timeout: 10000 });

    // Check that the title contains expected text
    const title = await page.title();
    if (!title.includes("Synkope")) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Verify content is loaded from JSON (content management system works)
    const heroTitle = await page.textContent("h1");
    if (!heroTitle || heroTitle.trim().length === 0) {
      console.warn("⚠️  Warning: Hero title appears to be empty, content loader might not be working");
    }

    // Check that external resources are loading
    const logoImage = page.locator(".logo-image");
    await logoImage.waitFor({ state: "visible", timeout: 5000 });

    console.log("✅ Website accessibility check passed");

    // Set global test data that can be used across tests
    process.env.PLAYWRIGHT_BASE_URL = baseURL;
    process.env.PLAYWRIGHT_SETUP_COMPLETE = "true";

    // Verify external fonts are loading (important for visual tests)
    const response = await page
      .goto("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700", {
        timeout: 10000,
      })
      .catch(() => null);

    if (response && response.ok()) {
      console.log("✅ External fonts accessibility verified");
    } else {
      console.warn("⚠️  Warning: External fonts may not be loading properly");
    }
  } catch (error) {
    console.error("❌ Global setup failed:", error.message);
    console.error("💡 Make sure the server is running. Playwright should auto-start it via webServer config.");
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }

  console.log("🎉 Global setup completed successfully");

  return {
    baseURL,
    setupTime: new Date().toISOString(),
  };
}

export default globalSetup;
