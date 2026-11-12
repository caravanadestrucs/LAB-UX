'use client';
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LayoutNormal from "./layoutNormal";
import LayoutAdmin from "./layoutAdmin";
import { getUsuarioActual, cerrarSesion } from "../hooks/islogin";
// Guard server-side real: src/middleware.ts (verifica cookie httpOnly `authToken`).
// Este check client-side queda solo como fallback para UX (ej. ocultar flash).

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutSwitcher = ({ children }: LayoutProps) => {
  const [usuario, setUsuario] = useState(null);
  const pathname: string = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    const user = getUsuarioActual();
    setUsuario(user);
    if (pathname.startsWith("/admin") && !user) {
      router.replace("/");
    }
  }, [pathname]);

  const handleLogout = () => {
    cerrarSesion();
    setUsuario(null);
    window.location.href = "/";
  };

  if (usuario && pathname.startsWith("/admin")) {
    return <LayoutAdmin>{children}</LayoutAdmin>;
  }
  if (pathname.startsWith("/admin")) {
    // Sin usuario no se monta el layout admin (evita flash de UI privada).
    // El guard real es server-side: src/middleware.ts verifica la cookie
    // httpOnly `authToken` y redirige; aquí solo se evita el parpadeo + replace.
    return null;
  }
  return <LayoutNormal>{children}</LayoutNormal>;
};

export default LayoutSwitcher;
