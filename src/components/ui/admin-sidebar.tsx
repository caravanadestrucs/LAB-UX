"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  Home,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Settings,
  Users,
  HelpCircle,
  Calendar,
  Newspaper,
  BookOpen,
  FileQuestion,
  Mail,
  FileTextIcon as FileText2,
  ChevronDown,
  LogOut
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import  ModeToggle  from "@/components/ui/mode-toggle"


//navbar items
import { getUsuarioActual, cerrarSesion } from "@/hooks/islogin"; // o desde donde lo tengas


export function AdminSidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  const [mobileMenuOpen, setMobileOpen] = useState(false)
      const [usuario, setUsuario] = useState<any>(null);
  
      useEffect(() => {
        const user = getUsuarioActual();
        setUsuario(user);
      }, []);
      
      const handleLogout = () => {
        cerrarSesion();
        setUsuario(null);
        // Opcional: redireccionar
        window.location.href = "/";
      };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Logo" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Panel Administrador</span>
            <span className="text-xs text-muted-foreground">v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Panel de Control</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <FileText className="mr-2 h-4 w-4" />
                Gestión de Contenidos
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/inicio")}>
                      <Link href="/admin/inicio">
                        <Home className="h-4 w-4" />
                        <span>Inicio</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/misionVision")}>
                      <Link href="/admin/misionVision">
                        <FileText className="h-4 w-4" />
                        <span>Misión y Visión</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                Gestión de Investigación
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/proyectos")}>
                      <Link href="/admin/proyectos">
                        <FileText2 className="h-4 w-4" />
                        <span>Proyectos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/pruebasMetodologias")}>
                      <Link href="/admin/pruebasMetodologias">
                        <BookOpen className="h-4 w-4" />
                        <span>Pruebas y Metodología</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/glosario")}>
                      <Link href="/admin/glosario">
                        <BookOpen className="h-4 w-4" />
                        <span>Glosario de Usabilidad</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <Megaphone className="mr-2 h-4 w-4" />
                Gestión de Difusión
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/difusion/")}>
                      <Link href="/admin/difusion/">
                        <Calendar className="h-4 w-4" />
                        <span>Eventos y Noticias</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
          
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Gestión de Soporte
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/preguntasFrecuentes")}>
                      <Link href="/admin/preguntasFrecuentes">
                        <FileQuestion className="h-4 w-4" />
                        <span>Preguntas Frecuentes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/contacto")}>
                      <Link href="/admin/contacto">
                        <Mail className="h-4 w-4" />
                        <span>Contacto</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/guias")}>
                      <Link href="/admin/guias">
                        <FileText className="h-4 w-4" />
                        <span>Guías y Tutoriales</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/usuarios")}>
              <Link href="/admin/usuarios">
                <Users className="h-4 w-4" />
                <span>Gestión de Usuarios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/configuracion")}>
              <Link href="/admin/configuracion">
                <Settings className="h-4 w-4" />
                <span>Configuración del Sitio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/configuracion")}>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left">
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">admin@ejemplo.com</span>
            </div>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

