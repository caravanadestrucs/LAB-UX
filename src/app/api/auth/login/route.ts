import { NextResponse } from "next/server";
import { API_URL } from "@/constants/Api";

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

  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      return NextResponse.json(data, { status: res.status || 401 });
    }

    const token: string = data.token || data.authToken || data.data?.token || "dummy";

    const response = NextResponse.json({ success: true, usuario: data.usuario ?? data.data?.usuario ?? data });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Cookie no httpOnly para que el client pueda mostrar datos de usuario sin exponer el token
    const usuario = data.usuario ?? data.data?.usuario;
    if (usuario) {
      response.cookies.set("usuario", JSON.stringify(usuario), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("POST /api/auth/login proxy error:", err);
    return NextResponse.json({ success: false, error: "Error de conexión con backend" }, { status: 502 });
  }
}
