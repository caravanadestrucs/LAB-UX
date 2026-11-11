// Middleware auth-guard tests (HU08).
// Current contract: httpOnly cookie `authToken` exists, but middleware only
// checks `!!token` — no jwtVerify, no RBAC. These tests lock the real
// behavior: redirects work, signature verification does NOT happen.
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

function req(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(`http://localhost:3000${path}`, { headers });
}

describe("middleware auth guard (HU08)", () => {
  it("redirects /admin to / when no authToken cookie is present", () => {
    const res = middleware(req("/admin/usuarios"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("lets /admin through when any authToken cookie is present", () => {
    const res = middleware(req("/admin/usuarios", "authToken=whatever"));
    expect(res.status).toBe(200);
  });

  it("redirects /public/login to /admin when already authenticated", () => {
    const res = middleware(req("/public/login", "authToken=whatever"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/admin");
  });

  it("lets anonymous users reach /public/login", () => {
    const res = middleware(req("/public/login"));
    expect(res.status).toBe(200);
  });

  it("documents the RBAC gap: any token passes, role is never checked (HU10-13)", () => {
    // A forged/opaque token with no role claim still clears the guard.
    // Expected: 307 to / for non-admin roles once RBAC lands.
    const res = middleware(req("/admin/usuarios", "authToken=forged-no-role"));
    expect(res.status).toBe(200);
  });
});
