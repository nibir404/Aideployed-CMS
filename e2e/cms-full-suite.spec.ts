import { test, expect } from "@playwright/test";

test.describe("AI Deployed CMS - Full E2E Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1. Dashboard: renders metrics, intake stream, and navigation", async ({ page }) => {
    await expect(page).toHaveTitle(/AI Deployed/i);
    await expect(page.locator("h2").first()).toContainText("Operations & Editorial CMS");

    // Check metric cards with unambiguous locators
    await expect(page.locator("span:has-text('Page Sections')")).toBeVisible();
    await expect(page.locator("span:has-text('Platform Modules')").first()).toBeVisible();
    await expect(page.locator("span:has-text('Inbound Inquiries')")).toBeVisible();
    await expect(page.locator("span:has-text('CLI Topics')").first()).toBeVisible();

    // Check quick navigation links
    await expect(page.locator("text=Live Simulator Preview")).toBeVisible();
    await expect(page.locator("text=Visual Page Builder")).toBeVisible();
  });

  test("2. Visual Page Builder: canvas, inline editing, drawers, and save", async ({ page }) => {
    await page.goto("/content");
    await expect(page).toHaveTitle(/AI Deployed/i);

    // Canvas should be visible and render the hero headline
    const canvas = page.locator("main main");
    await expect(canvas).toBeVisible();
    await expect(canvas.locator("h1")).toBeVisible();

    // 1. Test Sections Outline Drawer toggle
    const outlineBtn = page.locator("button:has-text('Sections')");
    await expect(outlineBtn).toBeVisible();
    await outlineBtn.click();
    await expect(page.locator("text=Page Outline")).toBeVisible();
    // Close outline drawer
    const closeOutlineBtn = page.locator("aside:has-text('Page Outline') button").first();
    await closeOutlineBtn.click();
    await expect(page.locator("text=Page Outline")).not.toBeVisible();

    // 2. Test Section Properties Drawer toggle
    const inspectorBtn = page.locator("button[title*='Properties']");
    await inspectorBtn.click();
    await expect(page.locator("text=Section Properties")).toBeVisible();
    // Close inspector drawer
    const closeInspectorBtn = page.locator("aside:has-text('Section Properties') button").first();
    await closeInspectorBtn.click();
    await expect(page.locator("text=Section Properties")).not.toBeVisible();

    // 3. Test Theme Toggle on Canvas (Dark / Light)
    const themeToggleBtn = page.locator("button[title*='preview theme']");
    await expect(themeToggleBtn).toBeVisible();
    await themeToggleBtn.click();

    // 4. Test Viewport Switcher
    const viewportContainer = page.locator("[data-testid='canvas-viewport-container']");
    const mobileViewportBtn = page.locator("button[title='Mobile View']");
    await mobileViewportBtn.click();
    await expect(viewportContainer).toHaveClass(/max-w-\[390px\]/);

    const desktopViewportBtn = page.locator("button[title='Desktop View']");
    await desktopViewportBtn.click();
    await expect(viewportContainer).toHaveClass(/w-full/);

    // 5. Test Inline WYSIWYG Editing on Canvas
    const editableHeadline = canvas.locator("h1 [title*='Click to edit']").first();
    if (await editableHeadline.isVisible()) {
      await editableHeadline.click();
      const input = canvas.locator("h1 input, h1 textarea").first();
      await expect(input).toBeVisible();
      const dynamicHeadline = `Embed with your team ${Date.now()}`;
      await input.fill(dynamicHeadline);
      await input.press("Enter");
      // Check that unsaved badge appears
      await expect(page.locator("text=Unsaved")).toBeVisible();
    }

    // 6. Test Save Button
    const saveBtn = page.locator("button:has-text('Save')");
    await saveBtn.click();
    await expect(page.locator("text=Saved")).toBeVisible();
  });

  test("3. Platform Studio: switch modules and test mock card output", async ({ page }) => {
    await page.goto("/platform");
    await expect(page).toHaveTitle(/AI Deployed/i);
    await expect(page.locator("text=Platform Architecture").first()).toBeVisible();

    // Verify 7 platform anchors list is visible
    await expect(page.locator("text=Platform Anchors").first()).toBeVisible();

    // Click module button
    const testModuleBtn = page.locator("button:has-text('test')").first();
    if (await testModuleBtn.isVisible()) {
      await testModuleBtn.click();
      await expect(page.locator("input[value*='Test'], input[value*='Verify']").first()).toBeVisible();
    }
  });

  test("4. FAQ Manager: search, category filtering, and modal dialog", async ({ page }) => {
    await page.goto("/faqs");
    await expect(page).toHaveTitle(/AI Deployed/i);

    // Search input
    const searchInput = page.locator("input[placeholder*='Search questions']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("what");
    await expect(page.locator(".card-surface").first()).toBeVisible();
    await searchInput.clear();

    // Open Add FAQ Modal
    const addFaqBtn = page.locator("button:has-text('Add FAQ')");
    await addFaqBtn.click();
    await expect(page.locator("text=Create New FAQ")).toBeVisible();

    // Close Modal
    const cancelBtn = page.locator("button:has-text('Cancel')");
    await cancelBtn.click();
    await expect(page.locator("text=Create New FAQ")).not.toBeVisible();
  });

  test("5. Inbound Leads CRM: view dossier and status workflows", async ({ page }) => {
    await page.goto("/leads");
    await expect(page).toHaveTitle(/AI Deployed/i);

    // Verify search and filter controls
    await expect(page.locator("input[placeholder*='Search leads']")).toBeVisible();
    await expect(page.locator("text=Lead Dossier")).toBeVisible();

    // Check triage notes textarea
    const notesArea = page.locator("textarea[placeholder*='triage notes']");
    await expect(notesArea).toBeVisible();
  });

  test("6. CLI Knowledge Studio: offline matcher simulation", async ({ page }) => {
    await page.goto("/cli-knowledge");
    await expect(page).toHaveTitle(/AI Deployed/i);

    // Check CLI Topics list
    await expect(page.locator("text=CLI Topics").first()).toBeVisible();
    await expect(page.locator("text=CLI Simulator Sandbox")).toBeVisible();

    // Test simulation query
    const testBtn = page.locator("button:has-text('Test')");
    await testBtn.click();
    await expect(page.locator("text=Match:")).toBeVisible();
  });

  test("7. Live Simulator Preview: renders component stack", async ({ page }) => {
    await page.goto("/preview");
    await expect(page).toHaveTitle(/AI Deployed/i);
    await expect(page.locator("text=Live Content Component Stack")).toBeVisible();
  });

  test("8. Responsive Layout: mobile drawer opens and closes cleanly", async ({ page }) => {
    // Set small mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // On mobile, the desktop sidebar should be hidden
    await expect(page.locator("aside.hidden.lg\\:flex")).not.toBeVisible();

    // Hamburger button should be visible in header
    const menuBtn = page.locator("button[aria-label='Open Navigation Menu']");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Mobile slide-over drawer should be visible
    const mobileDrawer = page.locator(".fixed.inset-0.z-50");
    await expect(mobileDrawer).toBeVisible();
    await expect(mobileDrawer.locator("text=Visual Builder")).toBeVisible();

    // Click backdrop to close
    const backdrop = page.locator(".fixed.inset-0.bg-black\\/60");
    await backdrop.click({ position: { x: 350, y: 100 } });
    await expect(mobileDrawer).not.toBeVisible();
  });
});
