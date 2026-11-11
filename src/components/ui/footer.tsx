//navbar items
"use client"

import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { navbarItems, siteName } from "@/constants/navbar"
import { SiteName } from "@/constants/navbar"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (

    <footer className=" border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-12">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">{siteName}</h3>
            <p className="text-sm font-thin">
              Laboratorio de Usabilidad — Facultad de Tecnología y Ciencias Aplicadas, UNCA.
              Testeamos con personas reales de Catamarca para diseñar tecnología centrada en las personas.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="font-thin hover:text-primary" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
              <Link href="https://facebook.com" className="font-thin hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href="https://instagram.com" className="font-thin hover:text-primary" aria-label="Instagram">

                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold  mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
                {navbarItems.map((item) => (
                    <li key={item.name}>
                    <Link key={item.name}
                     href={item.path} 
                     className="text-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 rounded-sm"
                     >
                      {item.name}
                    </Link>
                  </li>

                ))}
                <li>
                  <Link
                    href="/public/research/metodologias"
                    className="text-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Metodologías
                  </Link>
                </li>
                <li>
                  <Link
                    href="/public/research/glosario"
                    className="text-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 rounded-sm"
                  >
                    Glosario
                  </Link>
                </li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/public/support" className="text-sm  hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/public/support" className="text-sm  hover:text-primary">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/public/support" className="text-sm  hover:text-primary">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contacto</h3>
            <address className="not-italic">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5  mr-2 shrink-0" aria-hidden="true" />
                  <span className="text-sm ">San Fernando del Valle de Catamarca, Catamarca, Argentina</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5  mr-2 shrink-0" aria-hidden="true" />
                  <span className="text-sm">Facultad de Tecnología y Ciencias Aplicadas — UNCA</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5  mr-2 shrink-0" aria-hidden="true" />
                  <a href="mailto:lab-ux@unca.edu.ar" className="text-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 rounded-sm">lab-ux@unca.edu.ar</a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-sm ">© {currentYear} Laboratorio de Usabilidad — Facultad de Tecnología, UNCA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

