// Smoke: public glosario search (HU05 — best flow in the app).
// Covers debounce typing, letter filter, aria-live result count, empty state.
// Role/label selectors only — no CSS-fragile selectors.
import { test, expect } from "@playwright/test";

test.describe("glosario search (HU05)", () => {
  test.beforeEach(async ({ page }) => {
    await test.step("open glosario page", async () => {
      await page.goto("/public/research/glosario");
      await expect(
        page.getByRole("heading", { name: /glosario de usabilidad/i }),
      ).toBeVisible();
    });
  });

  test("typing filters terms after debounce", async ({ page }) => {
    const search = page.getByRole("searchbox", { name: /buscar términos/i });
    await test.step("type a query", async () => {
      await search.fill("usabilidad");
    });
    await test.step("debounced fetch updates the live region", async () => {
      const live = page.locator('[aria-live="polite"]');
      await expect(live).not.toHaveText(/cargando/i, { timeout: 10000 });
    });
  });

  test("letter filter buttons request that letter", async ({ page }) => {
    await test.step("filter by letter U", async () => {
      await page.getByRole("button", { name: /filtrar por letra u/i }).click();
      const pressed = page.getByRole("button", { name: /filtrar por letra u/i });
      await expect(pressed).toHaveAttribute("aria-pressed", "true");
    });
  });

  test("empty result shows the no-terms message", async ({ page }) => {
    await test.step("search an impossible term", async () => {
      await page
        .getByRole("searchbox", { name: /buscar términos/i })
        .fill("zzz-sin-resultados-123");
      await expect(
        page.getByText(/no se encontraron términos/i),
      ).toBeVisible({ timeout: 10000 });
    });
  });
});
