import { test, expect } from '@playwright/test';

test.describe('Synkope Website - Main Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage with correct title and meta', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Synkope/);

    // Check meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('prosjektledelse');
    expect(metaDescription).toContain('IT-infrastruktur');

    // Check that main content is visible
    await expect(page.locator('h1')).toContainText('Erfarne rådgivere');
    await expect(page.locator('.hero-subtitle')).toBeVisible();
  });

  test('should have working navigation menu', async ({ page }) => {
    // Check navigation links are visible
    await expect(page.locator('.nav-menu')).toBeVisible();
    await expect(page.locator('a[href="#hjem"]')).toBeVisible();
    await expect(page.locator('a[href="#om"]')).toBeVisible();
    await expect(page.locator('a[href="#team"]')).toBeVisible();
    await expect(page.locator('a[href="#tjenester"]')).toBeVisible();
    await expect(page.locator('a[href="#kontakt"]')).toBeVisible();

    // Test navigation clicks
    await page.click('a[href="#om"]');
    await expect(page.locator('#om')).toBeInViewport();

    await page.click('a[href="#team"]');
    await expect(page.locator('#team')).toBeInViewport();

    await page.click('a[href="#tjenester"]');
    await expect(page.locator('#tjenester')).toBeInViewport();

    await page.click('a[href="#kontakt"]');
    await expect(page.locator('#kontakt')).toBeInViewport();
  });

  test('should have working services dropdown', async ({ page }) => {
    // Hover over services dropdown
    await page.hover('.nav-dropdown-toggle');

    // Check dropdown menu appears
    await expect(page.locator('.nav-dropdown-menu')).toBeVisible();

    // Check all service links are present
    await expect(page.locator('a[href="tjenester/ikt-infrastruktur.html"]')).toBeVisible();
    await expect(page.locator('a[href="tjenester/prosjektstyring.html"]')).toBeVisible();
    await expect(page.locator('a[href="tjenester/informasjonssikkerhet.html"]')).toBeVisible();
    await expect(page.locator('a[href="tjenester/emc.html"]')).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    // Check hero section
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();

    // Check about section
    await expect(page.locator('#om')).toBeVisible();
    await expect(page.locator('#about-heading')).toBeVisible();

    // Check services section
    await expect(page.locator('#tjenester')).toBeVisible();
    await expect(page.locator('.services-grid')).toBeVisible();

    // Check team section
    await expect(page.locator('#team')).toBeVisible();
    await expect(page.locator('.team-grid')).toBeVisible();

    // Check contact section
    await expect(page.locator('#kontakt')).toBeVisible();
    await expect(page.locator('#kontaktskjema')).toBeVisible();

    // Check footer
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('should display team members correctly', async ({ page }) => {
    await page.click('a[href="#team"]');

    // Check team member cards are visible
    const teamMembers = page.locator('.team-member');
    await expect(teamMembers).toHaveCount(4);

    // Check specific team members
    await expect(page.locator('text=Andreas Strøm')).toBeVisible();
    await expect(page.locator('text=Irene Driveklepp')).toBeVisible();
    await expect(page.locator('text=Erik Stræde')).toBeVisible();
    await expect(page.locator('text=Torkell Bogstad')).toBeVisible();

    // Check team member images are loaded
    const teamImages = page.locator('.team-photo img');
    await expect(teamImages).toHaveCount(4);

    // Check contact links are present
    await expect(page.locator('a[href="mailto:andreas@synkope.io"]')).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com"]')).toHaveCount(4);
  });

  test('should have working service cards', async ({ page }) => {
    await page.click('a[href="#tjenester"]');

    // Check service cards are visible
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(4);

    // Check service card content
    await expect(page.locator('text=IKT-infrastruktur')).toBeVisible();
    await expect(page.locator('text=Prosjektstyring')).toBeVisible();
    await expect(page.locator('text=Informasjonssikkerhet')).toBeVisible();
    await expect(page.locator('text=Elektromagnetisk kompatibilitet')).toBeVisible();

    // Test service card links
    const iktLink = page.locator('a[href="tjenester/ikt-infrastruktur.html"]');
    await expect(iktLink).toBeVisible();
  });

  test('should validate contact form', async ({ page }) => {
    await page.click('a[href="#kontakt"]');

    // Check form is visible
    await expect(page.locator('#kontaktskjema')).toBeVisible();

    // Check form fields
    await expect(page.locator('#navn')).toBeVisible();
    await expect(page.locator('#epost')).toBeVisible();
    await expect(page.locator('#emne')).toBeVisible();
    await expect(page.locator('#melding')).toBeVisible();

    // Test form validation (HTML5 validation)
    await page.click('button[type="submit"]');

    // Check required field validation
    const nameField = page.locator('#navn');
    await expect(nameField).toHaveAttribute('required');
  });

  test('should be mobile responsive', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, navigation menu should be hidden initially
      await expect(page.locator('.nav-menu')).not.toBeVisible();

      // Check mobile layout
      await expect(page.locator('.hero-container')).toBeVisible();
      await expect(page.locator('.hero-title')).toBeVisible();

      // Check that content stacks vertically on mobile
      const teamGrid = page.locator('.team-grid');
      await teamGrid.scrollIntoViewIfNeeded();
      await expect(teamGrid).toBeVisible();
    }
  });

  test('should have correct footer information', async ({ page }) => {
    // Scroll to footer
    await page.locator('.footer').scrollIntoViewIfNeeded();

    // Check footer content
    await expect(page.locator('text=Synkope AS')).toBeVisible();
    await expect(page.locator('text=Solskinnsveien 6')).toBeVisible();
    await expect(page.locator('text=0376 Oslo')).toBeVisible();
    await expect(page.locator('text=921 125 739')).toBeVisible();
    await expect(page.locator('a[href="mailto:post@synkope.io"]')).toBeVisible();
    await expect(page.locator('text=© 2025 Synkope')).toBeVisible();
  });

  test('should load external resources correctly', async ({ page }) => {
    // Check that external fonts are loaded
    await page.waitForLoadState('networkidle');

    // Check that logo image is loaded
    const logo = page.locator('.logo-image');
    await expect(logo).toBeVisible();

    // Check that team images are loaded
    const teamImages = page.locator('.team-photo img');
    const imageCount = await teamImages.count();

    for (let i = 0; i < imageCount; i++) {
      await expect(teamImages.nth(i)).toBeVisible();
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check ARIA labels
    await expect(page.locator('[aria-label="Main navigation"]')).toBeVisible();
    await expect(page.locator('[aria-labelledby="hero-title"]')).toBeVisible();
    await expect(page.locator('[aria-labelledby="about-heading"]')).toBeVisible();
    await expect(page.locator('[aria-labelledby="team-heading"]')).toBeVisible();
    await expect(page.locator('[aria-labelledby="contact-heading"]')).toBeVisible();

    // Check form accessibility
    await expect(page.locator('label[for="navn"]')).toBeVisible();
    await expect(page.locator('label[for="epost"]')).toBeVisible();
    await expect(page.locator('label[for="emne"]')).toBeVisible();
    await expect(page.locator('label[for="melding"]')).toBeVisible();
  });

  test('should have working smooth scroll navigation', async ({ page }) => {
    // Test smooth scrolling to sections
    await page.click('a[href="#om"]');
    await page.waitForTimeout(500); // Wait for smooth scroll
    await expect(page.locator('#om')).toBeInViewport();

    await page.click('a[href="#team"]');
    await page.waitForTimeout(500);
    await expect(page.locator('#team')).toBeInViewport();

    await page.click('a[href="#kontakt"]');
    await page.waitForTimeout(500);
    await expect(page.locator('#kontakt')).toBeInViewport();
  });
});
