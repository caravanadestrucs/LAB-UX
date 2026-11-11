"use client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { metodologias, tiposPruebas } from "@/constants/data"

export default function MetodologiasPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Metodologías y Tipos de Pruebas</h1>
          <p className="text-muted-foreground max-w-2xl">
            Conoce las metodologías y tipos de pruebas que utilizamos en nuestros procesos de investigación.
          </p>
        </div>

        {/* Sección de Tipos de Pruebas */}
        <section className="space-y-8 mb-12">
          <h2 className="text-2xl font-semibold border-b pb-2">Tipos de Pruebas</h2>

          {tiposPruebas.map((tipo, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                <h3 className="text-xl font-medium mb-3">{tipo.nombre}</h3>
                <p className="text-muted-foreground mb-4">{tipo.descripcion}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {tipo.caracteristicas.map((caracteristica, i) => (
                    <li key={i} className="text-sm">
                      {caracteristica}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`relative aspect-video rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <Image src={tipo.imagen || "/placeholder.svg"} alt={tipo.nombre} fill className="object-cover" />
              </div>
            </div>
          ))}
        </section>

        {/* Sección de Metodologías estilo Pinterest */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Metodologías de Investigación</h2>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {metodologias.map((metodologia, index) => {
              // Determinar altura aleatoria para efecto Pinterest
              const heightClass =
                index % 3 === 0
                  ? "h-auto aspect-[4/5]"
                  : index % 3 === 1
                    ? "h-auto aspect-[4/6]"
                    : "h-auto aspect-[4/4]"
              return (
                <Card key={index} className={`${heightClass} break-inside-avoid mb-6 overflow-hidden`}>
                  <CardHeader className="bg-gradient-to-br">
                    <CardTitle>{metodologia.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">{metodologia.descripcion}</p>
                    <h4 className="font-medium mb-2 text-sm">Aplicaciones:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {metodologia.aplicaciones.map((aplicacion, i) => (
                        <li key={i} className="text-xs">
                          {aplicacion}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
