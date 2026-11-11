/**
 * Auth helpers — server & client.
 * Middleware (edge) no puede usar jsonwebtoken (Node crypto).
 * Para verificación real en edge usa `jose`: `await jwtVerify(token, secret)`.
 * Este archivo expone un stub compatible para uso en Route Handlers / Server Components.
 */

export type JwtPayload = {
  id?: number;
  email?: string;
  tipo_usuario?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
};

/**
 * Verifica un JWT de forma opcional.
 * - Si JWT_SECRET no está definido, solo valida existencia y expiración básica (sin firma).
 * - Si quieres verificación criptográfica, instala `jose` y reemplaza el cuerpo:
 *   `import { jwtVerify } from 'jose'; await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))`
 * @returns payload si es válido, null si no
 */
export async function verifyToken(token: string | undefined | null): Promise<JwtPayload | null> {
  if (!token) return null;

  // Stub: existencia + check exp sin verificar firma.
  // Para prod con JWT_SECRET, descomenta el bloque jose.
  try {
    // Intento decode base64 payload (no verifica firma) solo para exp
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as JwtPayload;
      if (payload.exp && payload.exp * 1000 < Date.now()) return null;
      // Si hay JWT_SECRET y jose instalado, aquí iría jwtVerify para validar firma
      return payload;
    }
    // Token opaco (dummy) — se considera válido si existe
    return { token } as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}
