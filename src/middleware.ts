import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Guard RBAC real (edge-safe).
 * Verifica la firma del JWT `authToken` con `jose` + JWT_SECRET.
 * Sin token o firma inválida/expirada → no hay rol válido.
 *
 * Reglas:
 * - /admin/* sin token válido → redirect "/"
 * - /public/login con token válido → redirect "/admin/inicio"
 * - /admin/usuarios* solo tipo_usuario === "admin" → sino redirect "/admin/inicio"
 * - resto /admin/* solo admin|profesor → alumno (u otro rol) redirect "/"
 *
 * Nota: falla cerrado. Sin JWT_SECRET no se puede verificar firma,
 * por lo que todo token se considera inválido (ver .env.example).
 */

type VerifiedSession = { valid: boolean; role: string | null };

async function getVerifiedSession(token: string | undefined): Promise<VerifiedSession> {
  if (!token) return { valid: false, role: null };
  const secret = process.env.JWT_SECRET;
  if (!secret) return { valid: false, role: null };
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = (payload as { tipo_usuario?: unknown }).tipo_usuario;
    if (typeof role !== "string" || role.length === 0) return { valid: false, role: null };
    return { valid: true, role };
  } catch {
    return { valid: false, role: null };
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLogin = pathname === "/public/login";

  const { valid, role } = await getVerifiedSession(token);

  if (isAdminRoute && !valid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLogin && valid) {
    return NextResponse.redirect(new URL("/admin/inicio", req.url));
  }

  if (isAdminRoute && valid) {
    if (pathname === "/admin/usuarios" || pathname.startsWith("/admin/usuarios/")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/admin/inicio", req.url));
      }
      return NextResponse.next();
    }
    if (role !== "admin" && role !== "profesor") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/public/login"],
};
