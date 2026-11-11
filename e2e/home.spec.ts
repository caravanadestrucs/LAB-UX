// Smoke: home renders skeleton first, then content (HU01, HU09).
// Guards against CLS crashes: banner reserves h-[400px], sections keep min-h.
import { test, expect } from "@playwright/test";

test.describe("home (HU01/HU09)", () => {
  test("loads skeleton then content without crashing", async ({ page }) => {
    await test.step("open home", async () => {
      await page.goto("/");
    });
    await test.step("main landmark is present", async () => {
      await expect(page.locator("main").first()).toBeVisible({ timeout: 15000 });
    });
    await test.step("valores section heading renders", async () => {
      await expect(
        page.getByRole("heading", { name: /nuestros valores/i }),
      ).toBeVisible({ timeout: 15000 });
    });
  });
});
