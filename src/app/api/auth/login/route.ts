import { NextResponse } from "next/server";
import { SignJWT, decodeJwt } from "jose";
import { API_URL } from "@/constants/Api";

/**
 * POST /api/auth/login — proxy al backend + emite cookies de sesión.
 *
 * Flujo:
 * 1. Reenvía { email, password } al backend (`POST ${API_URL}/usuarios/login`).
 *    Si el backend está caído → 502 con mensaje accionable (no rompe el login
 *    existente: el FE muestra el error y el usuario puede reintentar).
 * 2. Si el backend ya devuelve token JWT, se reutiliza tal cual como cookie
 *    `authToken` httpOnly. NOTA: ese token lo firmó el backend; aquí solo se
 *    decodifica (sin verificar firma) para extraer id/rol destinados a la
 *    cookie `usuario` de display. Se asume secreto JWT compartido con el
 *    backend para que el middleware (`jwtVerify` + JWT_SECRET) lo acepte.
 * 3. Si el backend devuelve usuario con tipo_usuario pero sin token, se firma
 *    un JWT propio (HS256, payload { id, tipo_usuario }, exp 7d) con JWT_SECRET.
 * 4. La cookie `usuario` (no httpOnly, solo display) lleva únicamente
 *    { ID, nombre, apellido, correo, tipo_usuario }. Nunca password ni token.
 */

type BackendUsuario = {
  ID?: number;
  id?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  email?: string;
  tipo_usuario?: string;
  password?: string;
  [k: string]: unknown;
};

type SafeUsuario = {
  ID?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  tipo_usuario?: string;
};

function buildSafeUsuario(source: BackendUsuario | null): SafeUsuario | null {
  if (!source) return null;
  const safe: SafeUsuario = {};
  const id = source.ID ?? source.id;
  if (typeof id === "number") safe.ID = id;
  if (typeof source.nombre === "string") safe.nombre = source.nombre;
  if (typeof source.apellido === "string") safe.apellido = source.apellido;
  const correo = source.correo ?? source.email;
  if (typeof correo === "string") safe.correo = correo;
  if (typeof source.tipo_usuario === "string") safe.tipo_usuario = source.tipo_usuario;
  return safe;
}

export async function POST(req: Request) {
  let body: { email: string; password: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Body inválido" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Faltan credenciales" }, { status: 400 });
  }

  let data: {
    token?: unknown;
    authToken?: unknown;
    usuario?: BackendUsuario;
    data?: { token?: unknown; usuario?: BackendUsuario };
    success?: boolean;
    message?: string;
    error?: string;
  };
  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    data = await res.json();

    if (!res.ok || data.success === false) {
      return NextResponse.json(data, { status: res.status || 401 });
    }
  } catch (err) {
    console.error("POST /api/auth/login proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Error de conexión con el backend. Intentá de nuevo en unos minutos." },
      { status: 502 }
    );
  }

  const backendToken =
    typeof data.token === "string" && data.token.length > 0
      ? data.token
      : typeof data.authToken === "string" && data.authToken.length > 0
        ? data.authToken
        : typeof data.data?.token === "string" && data.data.token.length > 0
          ? data.data.token
          : null;

  const backendUsuario: BackendUsuario | null =
    (data.usuario as BackendUsuario | undefined) ??
    (data.data?.usuario as BackendUsuario | undefined) ??
    null;

  let authToken: string | null = backendToken;
  let safeUsuario: SafeUsuario | null = buildSafeUsuario(backendUsuario);

  if (!authToken) {
    // El backend no emitió token: firmamos uno propio si hay rol válido.
    const tipo = backendUsuario?.tipo_usuario;
    const id = backendUsuario?.ID ?? backendUsuario?.id;
    if (!backendUsuario || typeof tipo !== "string") {
      return NextResponse.json(
        { success: false, error: "El backend no devolvió token ni rol de usuario." },
        { status: 502 }
      );
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("POST /api/auth/login: JWT_SECRET no configurado");
      return NextResponse.json(
        { success: false, error: "Sesión no disponible (configuración incompleta). Contactá al administrador." },
        { status: 500 }
      );
    }
    authToken = await new SignJWT({ id, tipo_usuario: tipo })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));
  } else if (!safeUsuario?.tipo_usuario) {
    // Token del backend sin objeto usuario: decodificamos (SIN verificar firma,
    // solo para display) a fin de poblar la cookie `usuario`. La autenticación
    // real la decide el middleware con `jwtVerify`.
    try {
      const decoded = decodeJwt(authToken) as { id?: number; tipo_usuario?: string };
      safeUsuario = {
        ...(typeof decoded.id === "number" ? { ID: decoded.id } : {}),
        ...(typeof decoded.tipo_usuario === "string" ? { tipo_usuario: decoded.tipo_usuario } : {}),
      };
    } catch {
      safeUsuario = null;
    }
  }

  const response = NextResponse.json({ success: true, usuario: safeUsuario });

  response.cookies.set("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Cookie de display (no httpOnly): sin password, sin token.
  if (safeUsuario) {
    response.cookies.set("usuario", JSON.stringify(safeUsuario), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return response;
}
