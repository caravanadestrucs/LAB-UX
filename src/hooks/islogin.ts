/**
 * TODO(auth): migrado a cookies httpOnly (middleware + /api/auth/login).
 * Este archivo se mantiene como fallback client-side hasta completar la migración.
 * No confiar solo en localStorage: el guard real es src/middleware.ts (server-side).
 * @deprecated usar cookies httpOnly; localStorage será eliminado en próximo sprint
 */
export const getUsuarioActual = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("usuario");
    if (stored) return JSON.parse(stored);
    // Fallback: intenta leer cookie `usuario` (no httpOnly) si localStorage vacío
    const cookie = getAuthTokenFromCookie("usuario");
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie));
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const getAuthTokenFromCookie = (name = "authToken"): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const cerrarSesion = async () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("authToken");
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Silencia error de logout — local ya limpio
  }
};
