// Endpoint-centralization tests (HU07 + rule "no hardcodear URLs").
// ENDPOINTS.SOPORTE must be built from API_URL — never localhost:5000.
import { describe, it, expect } from "vitest";
import { ENDPOINTS } from "@/config/endpoints";
import { API_URL } from "@/constants/Api";

describe("ENDPOINTS centralization", () => {
  it("SOPORTE is built from API_URL (HU07 contacto posts here)", () => {
    expect(ENDPOINTS.SOPORTE).toBe(`${API_URL}/soporte`);
  });

  it("no endpoint points at localhost:5000", () => {
    expect(JSON.stringify(ENDPOINTS)).not.toContain("localhost:5000");
    expect(JSON.stringify(ENDPOINTS)).not.toContain("localhost");
  });

  it("USUARIOS routes are built from API_URL", () => {
    expect(ENDPOINTS.USUARIOS.BASE).toBe(`${API_URL}/usuarios`);
    expect(ENDPOINTS.USUARIOS.LOGIN).toBe(`${API_URL}/usuarios/login`);
    expect(ENDPOINTS.USUARIOS.BY_ID(7)).toBe(`${API_URL}/usuarios/7`);
  });
});
