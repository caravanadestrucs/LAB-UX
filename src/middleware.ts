import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin");

  // Edge runtime: jsonwebtoken uses Node crypto, not available here.
  // Use `jose` (jwtVerify) if JWT verification is needed.
  // Fallback: existence check only. Optionally verify if JWT_SECRET is set.
  // Example with jose (uncomment after `npm i jose`):
  //   import { jwtVerify } from 'jose';
  //   try { await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)) } catch { token = undefined }
  const isValid = !!token;

  if (isAdmin && !isValid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAdmin && isValid && pathname === "/public/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/public/login"],
};
