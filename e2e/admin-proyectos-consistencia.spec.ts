// Consistency audit: public proyectos (HU03) vs admin proyectos (HU12).
// Public page renders mock `proyectos` from constants/data; admin CRUD hits
// the real API. Until HU03 is wired to fetchProyectos, this stays fixme.
import { test, expect } from "@playwright/test";

test.describe("proyectos public-vs-admin consistency (HU03 vs HU12)", () => {
  test("public page renders project cards (mock data, current state)", async ({
    page,
  }) => {
    await test.step("open public proyectos", async () => {
      await page.goto("/public/research/proyectos");
      await expect(
        page.getByRole("heading", { name: /proyectos de investigación/i }),
      ).toBeVisible();
    });
  });

  test.fixme(
    "HU03: public proyectos must fetch from API like admin HU12 " +
      "(today: mock constants/data, diverges from API shape " +
      "proyecto_areas_investigacion vs areas_investigacion)",
    async () => {},
  );
});
