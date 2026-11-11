// Smoke: auth guard via httpOnly cookie middleware (HU08).
// Middleware-only redirects — no backend needed, safe without DB.
import { test, expect } from "@playwright/test";

test.describe("auth guard (HU08)", () => {
  test("anonymous /admin/usuarios redirects to /", async ({ page }) => {
    await test.step("visit admin without cookie", async () => {
      await page.goto("/admin/usuarios");
    });
    await test.step("assert redirect to public home", async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test("authenticated user visiting /public/login redirects to /admin", async ({
    page,
    context,
  }) => {
    await test.step("set a dummy authToken cookie", async () => {
      await context.addCookies([
        {
          name: "authToken",
          value: "dummy-e2e-token",
          domain: "localhost",
          path: "/",
        },
      ]);
    });
    await test.step("visit login while authenticated", async () => {
      await page.goto("/public/login");
    });
    await test.step("assert redirect into admin", async () => {
      await expect(page).toHaveURL(/\/admin/);
    });
  });
});
