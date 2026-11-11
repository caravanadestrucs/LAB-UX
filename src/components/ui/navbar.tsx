"use client"

import { useState, useEffect } from "react";
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenuCheckboxItemProps} from "@radix-ui/react-dropdown-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem
  } from "@/components/ui/dropdown-menu"
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { navbarItems, siteName } from "@/constants/navbar"

//navbar items
import { getUsuarioActual} from "@/hooks/islogin"; // o desde donde lo tengas






type Checked = DropdownMenuCheckboxItemProps["checked"]
export function Navbar() {
    const [mobileMenuOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
      const user = getUsuarioActual();
      setUsuario(user);
    }, []);
    
    return(
        <nav className=" shadow-sm sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    {/*Logo del sitio */}
                    <div className="flex items-center">
                         {/*Primer elemento, el home */}
                        <Link href={navbarItems[0].path} className="flex items-center">
                            <span className="text-xl font-bold  ">
                                {siteName}
                            </span>
                        </Link>
                    </div>
                    {/* Enlaces de navegación version desktop */}
                    <div className="hidden md:flex
                    md:items-center md:space-x-4">
                    {navbarItems.map((item) => (
                    item.name.toLowerCase() === "investigación" ? (
                        <DropdownMenu key={item.name}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="transition-colors hover:bg-accent hover:text-accent-foreground">
                                {item.name}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                <Link href={`${item.path}/proyectos`}>Proyectos</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                <Link href={`${item.path}/metodologias`}>Metodologías</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                <Link href={`${item.path}/glosario`}>Glosario</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                        key={item.name}
                        href={item.path}
                        aria-current={pathname === item.path ? "page" : undefined}
                        className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none",
                            pathname === item.path
                            ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                            : " hover:bg-accent hover:text-accent-foreground",
                        )}
                        >
                        {item.name}
                        </Link>
                    )
                    ))}
                        <Button asChild className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href="/public/login">Iniciar Sesión</Link>
                        </Button>
                        

                    </div>
                    {/* Boton del menu movil */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen
                            (!mobileMenuOpen)}      
                            aria-expanded={mobileMenuOpen}
                            className="text-gray-700"
                        >
                            <span className="sr-only">Abrir menú</span>
                            {mobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>
            {/* Menu movil */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navbarItems.map((item) => (
                        item.name.toLowerCase() === "investigación" ? (
                            <Accordion type="single" collapsible className="w-full" key={`accordion-${item.name}`}>
                                <AccordionItem value={item.name} key={`accordion-item-${item.name}`}>
                                    <AccordionTrigger className={cn(
                                                "rounded-md px-3 py-2 text-base font-medium transition-colors motion-reduce:transition-none",
                                                pathname === item.path
                                                ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                                                : "text-gray-700 hover:bg-accent hover:text-accent-foreground",
                                            )}>
                                        <span aria-current={pathname === item.path ? "page" : undefined}>{item.name}</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Link key="proyectos" href={`${item.path}/proyectos`} aria-current={pathname === `${item.path}/proyectos` ? "page" : undefined} className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium transition-colors motion-reduce:transition-none",
                                            pathname === `${item.path}/proyectos`
                                            ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                                            : "text-gray-700 hover:bg-accent hover:text-accent-foreground",
                                        )} onClick={() => setMobileOpen(false)}>
                                            Proyectos
                                        </Link>
                                        <Link key="metodologias" href={`${item.path}/metodologias`} aria-current={pathname === `${item.path}/metodologias` ? "page" : undefined} className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium transition-colors motion-reduce:transition-none",
                                            pathname === `${item.path}/metodologias`
                                            ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                                            : "text-gray-700 hover:bg-accent hover:text-accent-foreground",
                                        )} onClick={() => setMobileOpen(false)}>
                                            Metodologías
                                        </Link>
                                        <Link key="glosario" href={`${item.path}/glosario`} aria-current={pathname === `${item.path}/glosario` ? "page" : undefined} className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium transition-colors motion-reduce:transition-none",
                                            pathname === `${item.path}/glosario`
                                            ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                                            : "text-gray-700 hover:bg-accent hover:text-accent-foreground",
                                        )} onClick={() => setMobileOpen(false)}>
                                            Glosario
                                        </Link>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ): (
                            <Link
                            key={item.name}
                            href={item.path}
                            aria-current={pathname === item.path ? "page" : undefined}
                            className={cn(
                                "block rounded-md px-3 py-2 text-base font-medium transition-colors motion-reduce:transition-none",
                                pathname === item.path
                                ? "bg-primary/10 text-foreground underline decoration-[#0E7490] decoration-2 underline-offset-4"
                                : "text-gray-700 hover:bg-accent hover:text-accent-foreground",
                            )}
                            onClick={() => setMobileOpen(false)}
                            >
                                {item.name}
                            </Link>
                        )
                        ))}
                        <div className="pt-2">
                            <Button asChild className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/public/login" onClick={() => setMobileOpen(false)}>
                                Iniciar Sesión
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}