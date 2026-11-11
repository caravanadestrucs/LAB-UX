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
    
    //Agegar un console log para mostrar la 
    // ruta que en la que se esta
    console.log("Ruta actual: ", pathname)

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
            <div className=" mx-auto max-w-7x1 px-4 sm:px-6 lg:px-8">
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
                                <Button variant="ghost" className=" hover:bg-gray-100 hover:text-gray-700">
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
                        className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname === item.path
                            ? "bg-primary/10 text-gray-700 bg-gray-100"
                            : " hover:bg-gray-100 hover:text-gray-700",
                        )}
                        >
                        {item.name}
                        </Link>
                    )
                    ))}
                        <Button asChild className="ml-4 bg-black text-white hover:bg-gray-800">
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
                            <span className="sr-only">Abrir Menù</span>
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
                                    <AccordionTrigger>
                                        <Link
                                            key={`link-${item.name}`}
                                            href={item.path}
                                            className={cn(
                                                "block rounded-md px-3 py-2 text-base font-medium",
                                                pathname === item.path
                                                ? "bg-primary/10 text-gray-700 bg-gray-100"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-70",
                                            )}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div key="proyectos" className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium",
                                            pathname === `${item.path}/proyectos`
                                            ? "bg-primary/10 text-gray-700 bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-70",
                                        )}>
                                            <Link href={`${item.path}/proyectos`}>Proyectos</Link>
                                        </div>
                                        <div key="metodologias" className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium",
                                            pathname === `${item.path}/metodologias`
                                            ? "bg-primary/10 text-gray-700 bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-70",
                                        )}>
                                            <Link href={`${item.path}/metodologias`}>Metodologías</Link>
                                        </div>
                                        <div key="glosario" className={cn(
                                            "block rounded-md px-3 py-2 text-base font-medium",
                                            pathname === `${item.path}/glosario`
                                            ? "bg-primary/10 text-gray-700 bg-gray-100"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-70",
                                        )}>
                                            <Link href={`${item.path}/glosario`}>Glosario</Link>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ): (
                            <Link
                            key={item.name}
                            href={item.path}
                            className={cn(
                                "block rounded-md px-3 py-2 text-base font-medium",
                                pathname === item.path
                                ? "bg-primary/10 text-gray-700 bg-gray-100"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-70",
                            )}
                            onClick={() => setMobileOpen(false)}
                            >
                                {item.name}
                            </Link>
                        )
                        ))}
                        <div className="pt-2">
                            <Button asChild className="w-full justify-center bg-black text-white hover:bg-gray-800">
                                <Link href="public/login" onClick={() => setMobileOpen(false)}>
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