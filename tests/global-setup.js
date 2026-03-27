/**
 * Global setup for Playwright tests.
 *
 * The webServer config in playwright.config.js handles starting the dev server
 * and waiting until it is ready before any test runs. There is no need to
 * launch a separate browser here for pre-flight checks — that just adds
 * overhead and an extra external network request.
 *
 * This file is kept as a no-op so the globalSetup reference in the config
 * remains valid and can be extended later if genuine global setup is needed
 * (e.g. seeding a database, writing auth state to disk).
 */
async function globalSetup() {
  // intentionally empty
}

export default globalSetup;
