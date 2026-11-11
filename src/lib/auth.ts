/**
 * Auth helpers — verificación JWT real con `jose` (edge + node safe).
 * El middleware y los Route Handlers usan este módulo como fuente de verdad.
 * Falla cerrado: sin JWT_SECRET o firma inválida → null.
 */

import { jwtVerify } from "jose";

export type JwtPayload = {
  id?: number;
  email?: string;
  tipo_usuario?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
};

const ALLOWED_ROLES = ["admin", "profesor", "alumno"] as const;
export type AllowedRole = (typeof ALLOWED_ROLES)[number];

/**
 * Verifica la firma del JWT con JWT_SECRET (HS256).
 * @returns payload si la firma es válida y no expiró, null si no.
 */
export async function verifyToken(token: string | undefined | null): Promise<JwtPayload | null> {
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null | undefined): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}

/**
 * Extrae el rol desde un payload ya verificado.
 * @returns "admin" | "profesor" | "alumno", o null si el rol falta o no es válido.
 */
export function getRoleFromToken(payload: JwtPayload | null | undefined): AllowedRole | null {
  const role = payload?.tipo_usuario;
  if (typeof role === "string" && (ALLOWED_ROLES as readonly string[]).includes(role)) {
    return role as AllowedRole;
  }
  return null;
}
