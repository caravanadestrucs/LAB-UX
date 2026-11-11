

import { useState, useEffect } from "react";
import { getUsuarioActual, cerrarSesion } from "@/hooks/islogin"; // o desde donde lo tengas

//navbar items

export interface NavbarItem {
    name: string; //Nombre del enlace
    path: string; //Ruta a la que apunta
}

export const navbarItems: NavbarItem[] = [
    {name: "Inicio", path: "/public"},
    {name: "Equipo", path: "/public/team"},
    {name: "Investigación", path: "/public/research"},
    {name: "Difusión", path: "/public/diffusion"},
    {name: "Soporte y Ayuda", path: "/public/support"},
    
]
export interface SiteName{
    name: string
}
export const siteName = "Lab-UX"
export const routes = {
    name: "Login", path:"public/login"
}