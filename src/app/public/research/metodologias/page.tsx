"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchMetodologiasPruebas } from "@/services/metodologiaPrueba"
import { API_URL } from "@/constants/Api"
import type { MetodologiaPrueba } from "@/types"

function resolveImagen(imagen?: string | null): string {
  if (!imagen) return "/placeholder.svg"
  if (imagen.startsWith("http") || imagen.startsWith("/") || imagen.startsWith("blob:") || imagen.startsWith("data:")) {
    return imagen
  }
  return `${API_URL}/uploads/${imagen}`
}

export default function MetodologiasPage() {
  const [items, setItems] = useState<MetodologiaPrueba[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMetodologiasPruebas()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las metodologías")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const tiposPruebas = items.filter((item) => item.tipo === "prueba")
  const metodologias = items.filter((item) => item.tipo !== "prueba")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Metodologías y Tipos de Pruebas</h1>
          <p className="text-muted-foreground max-w-2xl">
            Conoce las metodologías y tipos de pruebas que utilizamos en nuestros procesos de investigación.
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading ? "Cargando metodologías..." : `${items.length} resultado${items.length !== 1 ? "s" : ""} encontrado${items.length !== 1 ? "s" : ""}`}
        </div>

        {error && (
          <div className="bg-destructive/15 p-4 rounded-md border border-destructive">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={loadItems}>
              Reintentar
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-8" aria-hidden="true">
            <div className="grid md:grid-cols-2 gap-8 items-center animate-pulse">
              <div className="space-y-3">
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>
              <div className="aspect-video rounded-lg bg-muted" />
            </div>
            <div className="columns-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="break-inside-avoid mb-6 overflow-hidden animate-pulse">
                  <CardHeader>
                    <div className="h-5 w-2/3 rounded bg-muted" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-4 w-full rounded bg-muted mb-2" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : items.length === 0 && !error ? (
          <p className="text-muted-foreground text-center py-12">No se encontraron metodologías ni pruebas.</p>
        ) : (
          <>
            {/* Sección de Tipos de Pruebas */}
            <section className="space-y-8 mb-12">
              <h2 className="text-2xl font-semibold border-b pb-2">Tipos de Pruebas</h2>

              {tiposPruebas.length === 0 ? (
                <p className="text-muted-foreground">No hay tipos de pruebas disponibles.</p>
              ) : (
                tiposPruebas.map((tipo, index) => (
                  <div key={tipo.ID ?? index} className="grid md:grid-cols-2 gap-8 items-center">
                    <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                      <h3 className="text-xl font-medium mb-3">{tipo.nombre}</h3>
                      {tipo.descripcion && <p className="text-muted-foreground mb-4">{tipo.descripcion}</p>}
                      {(tipo.caracteristicas?.length ?? 0) > 0 && (
                        <ul className="list-disc pl-5 space-y-1">
                          {tipo.caracteristicas.map((caracteristica) => (
                            <li key={caracteristica.ID} className="text-sm">
                              {caracteristica.caracteristica}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div
                      className={`relative aspect-video rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}
                    >
                      <Image src={resolveImagen(tipo.imagen)} alt={tipo.nombre} fill className="object-cover" />
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Sección de Metodologías estilo Pinterest */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-2">Metodologías de Investigación</h2>

              {metodologias.length === 0 ? (
                <p className="text-muted-foreground">No hay metodologías disponibles.</p>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {metodologias.map((metodologia, index) => {
                    const heightClass =
                      index % 3 === 0
                        ? "h-auto aspect-[4/5]"
                        : index % 3 === 1
                          ? "h-auto aspect-[4/6]"
                          : "h-auto aspect-[4/4]"
                    return (
                      <Card key={metodologia.ID ?? index} className={`${heightClass} break-inside-avoid mb-6 overflow-hidden`}>
                        <CardHeader className="bg-gradient-to-br">
                          <CardTitle>{metodologia.nombre}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          {metodologia.descripcion && (
                            <p className="text-sm text-muted-foreground mb-4">{metodologia.descripcion}</p>
                          )}
                          {(metodologia.caracteristicas?.length ?? 0) > 0 && (
                            <>
                              <h4 className="font-medium mb-2 text-sm">Aplicaciones:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {metodologia.caracteristicas.map((caracteristica) => (
                                  <li key={caracteristica.ID} className="text-xs">
                                    {caracteristica.caracteristica}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
