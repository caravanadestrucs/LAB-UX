// @vitest-environment node
// Middleware auth-guard tests (HU08 + RBAC jose).
// Real contract: httpOnly cookie `authToken` verified with jose jwtVerify
// (HS256 + JWT_SECRET). RBAC: /admin/usuarios solo admin,
// resto /admin/* solo admin|profesor.
import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { middleware } from "@/middleware";

const TEST_SECRET = "test-secret";

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

function req(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(`http://localhost:3000${path}`, { headers });
}

async function makeToken(
  tipo_usuario: string,
  opts?: { secret?: string; expired?: boolean },
): Promise<string> {
  const secret = new TextEncoder().encode(opts?.secret ?? TEST_SECRET);
  const now = Math.floor(Date.now() / 1000);
  const builder = new SignJWT({ id: 1, tipo_usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now);
  if (opts?.expired) {
    builder.setExpirationTime(now - 3600);
  } else {
    builder.setExpirationTime(now + 3600);
  }
  return builder.sign(secret);
}

function cookieFor(token: string) {
  return `authToken=${token}`;
}

describe("middleware auth guard (HU08 + RBAC jose)", () => {
  it("redirects /admin to / when no authToken cookie is present", async () => {
    const res = await middleware(req("/admin/usuarios"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("redirects /admin to / when token signature is invalid", async () => {
    const bad = await makeToken("admin", { secret: "wrong-secret" });
    const res = await middleware(req("/admin/usuarios", cookieFor(bad)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("redirects /admin to / when token is opaque garbage", async () => {
    const res = await middleware(req("/admin/usuarios", "authToken=whatever"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("redirects alumno from /admin/usuarios to /admin/inicio", async () => {
    const token = await makeToken("alumno");
    const res = await middleware(req("/admin/usuarios", cookieFor(token)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/admin/inicio");
  });

  it("redirects profesor from /admin/usuarios to /admin/inicio", async () => {
    const token = await makeToken("profesor");
    const res = await middleware(req("/admin/usuarios", cookieFor(token)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/admin/inicio");
  });

  it("lets admin reach /admin/usuarios", async () => {
    const token = await makeToken("admin");
    const res = await middleware(req("/admin/usuarios", cookieFor(token)));
    expect(res.status).toBe(200);
  });

  it("redirects alumno from generic /admin/* to /", async () => {
    const token = await makeToken("alumno");
    const res = await middleware(req("/admin/inicio", cookieFor(token)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });

  it("lets profesor reach generic /admin/*", async () => {
    const token = await makeToken("profesor");
    const res = await middleware(req("/admin/inicio", cookieFor(token)));
    expect(res.status).toBe(200);
  });

  it("redirects /public/login to /admin/inicio when already authenticated", async () => {
    const token = await makeToken("admin");
    const res = await middleware(req("/public/login", cookieFor(token)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/admin/inicio");
  });

  it("lets anonymous users reach /public/login", async () => {
    const res = await middleware(req("/public/login"));
    expect(res.status).toBe(200);
  });

  it("redirects expired token on /admin to /", async () => {
    const token = await makeToken("admin", { expired: true });
    const res = await middleware(req("/admin/inicio", cookieFor(token)));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  });
});
