/**
 * Client-side session helpers.
 * Fuente de verdad del guard: src/middleware.ts (cookie httpOnly `authToken`,
 * verificada server-side con jose). Este módulo solo expone datos de display
 * desde la cookie `usuario` (no httpOnly, sin password ni token).
 */

export type SessionRole = "admin" | "profesor" | "alumno";

export const getAuthTokenFromCookie = (name = "authToken"): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

/** Lee la sesión desde la cookie `usuario`. Retorna null si falta o es inválida. */
export const getUsuarioActual = () => {
  if (typeof window === "undefined") return null;
  try {
    const cookie = getAuthTokenFromCookie("usuario");
    if (!cookie) return null;
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
};

/** Rol de display (admin|profesor|alumno) o null. El guard real es el middleware. */
export const getAuthRole = (): SessionRole | null => {
  const role = getUsuarioActual()?.tipo_usuario;
  if (role === "admin" || role === "profesor" || role === "alumno") return role;
  return null;
};

export const cerrarSesion = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Backend inalcanzable: igual se limpia el estado local.
  }
  try {
    // Limpieza legacy: sesiones anteriores guardaban copia en localStorage.
    localStorage.removeItem("usuario");
    localStorage.removeItem("authToken");
  } catch {
    // Storage bloqueado (SSR/privado): nada que limpiar.
  }
  try {
    // La cookie `authToken` (httpOnly) la limpia el server; aquí solo la de display.
    document.cookie = "usuario=; Max-Age=0; path=/";
  } catch {
    // Sin document (SSR): nada que limpiar.
  }
};
