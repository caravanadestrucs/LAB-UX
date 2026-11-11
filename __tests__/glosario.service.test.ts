// Unit tests for the glosario service (HU05 — best flow in the app).
// Covers: query-string building (?q= & letra=), AbortSignal passthrough,
// and response-shape normalization. Abort-swallowing itself lives in
// src/app/public/research/glosario/page.tsx (tested at E2E level).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchTerminos } from "@/services/glosario";
import { API_URL } from "@/constants/Api";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(data: unknown) {
  return { ok: true, json: async () => data } as Response;
}

describe("fetchTerminos query building (HU05)", () => {
  it("appends ?q= search text to the request URL", async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    await fetchTerminos("?q=usabilidad");
    expect(mockFetch).toHaveBeenCalledOnce();
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toBe(`${API_URL}/glosario?q=usabilidad`);
  });

  it("appends letra= filter to the request URL", async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    await fetchTerminos("?letra=a");
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain("letra=a");
  });

  it("combines q and letra in a single query string", async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    await fetchTerminos("?letra=u&q=ux");
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain("letra=u");
    expect(url).toContain("q=ux");
  });
});

describe("fetchTerminos AbortSignal passthrough (HU05)", () => {
  it("forwards the AbortSignal to fetch so the page can cancel stale requests", async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    const controller = new AbortController();
    await fetchTerminos("?q=ux", { signal: controller.signal });
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect(init.signal).toBe(controller.signal);
  });

  it("surfaces AbortError to the caller (page swallows it without toast)", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    mockFetch.mockRejectedValue(abortError);
    const controller = new AbortController();
    controller.abort();
    await expect(fetchTerminos("?q=ux", { signal: controller.signal })).rejects.toThrowError(
      expect.objectContaining({ name: "AbortError" }),
    );
  });
});

describe("fetchTerminos response normalization (HU05)", () => {
  it("returns a bare array as-is", async () => {
    const rows = [{ termino: "UX", descripcion: "User experience" }];
    mockFetch.mockResolvedValue(jsonResponse(rows));
    await expect(fetchTerminos("")).resolves.toEqual(rows);
  });

  it("unwraps { terminos: [...] } envelopes", async () => {
    const rows = [{ termino: "UX", descripcion: "User experience" }];
    mockFetch.mockResolvedValue(jsonResponse({ terminos: rows }));
    await expect(fetchTerminos("")).resolves.toEqual(rows);
  });

  it("returns [] for unexpected shapes instead of crashing the page", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ data: null }));
    await expect(fetchTerminos("")).resolves.toEqual([]);
  });
});
