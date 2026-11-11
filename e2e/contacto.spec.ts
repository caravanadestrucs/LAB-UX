// Smoke: contacto form posts to ENDPOINTS.SOPORTE (HU07, partial).
// Route is mocked so it passes with or without the backend up.
import { test, expect } from "@playwright/test";

test.describe("contacto (HU07)", () => {
  test("submit posts to SOPORTE and shows success", async ({ page }) => {
    await test.step("mock the SOPORTE endpoint", async () => {
      await page.route("**/soporte", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ mensaje: "Solicitud enviada con éxito." }),
        });
      });
    });

    await test.step("open support and switch to contacto tab", async () => {
      await page.goto("/public/support");
      await page.getByRole("tab", { name: /contacto/i }).click();
    });

    await test.step("fill and submit the form", async () => {
      await page.getByLabel(/nombre/i).fill("Usuario E2E");
      await page.getByLabel(/correo|email/i).fill("e2e@test.com");
      await page.getByLabel(/asunto/i).fill("Consulta E2E");
      await page.getByLabel(/mensaje/i).fill("Mensaje de prueba E2E.");
      await page.getByRole("button", { name: /enviar solicitud/i }).click();
    });

    await test.step("assert success feedback", async () => {
      await expect(page.getByText(/solicitud enviada/i).first()).toBeVisible({
        timeout: 10000,
      });
    });
  });
});
