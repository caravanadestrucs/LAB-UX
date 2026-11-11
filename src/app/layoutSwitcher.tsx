'use client';
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LayoutNormal from "./layoutNormal";
import LayoutAdmin from "./layoutAdmin";
import { getUsuarioActual, cerrarSesion } from "../hooks/islogin";

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
    return <LayoutAdmin>{children}</LayoutAdmin>;
  }
  return <LayoutNormal>{children}</LayoutNormal>;
};

export default LayoutSwitcher;
