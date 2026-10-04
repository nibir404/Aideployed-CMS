import { test, expect } from "@playwright/test";

test("CMS Dashboard loads and displays navigation and metrics", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/AI Deployed/i);
  await expect(page.locator("h2")).toContainText("Operations & Editorial CMS");
  await expect(page.locator("text=Page Sections")).toBeVisible();
});
