'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/useProjects"
import { ModalProyecto } from "./components/modalProyecto"
import { fetchProyectos } from "@/services/proyecto"
import { API_URL } from "@/constants/Api"
import { getStatusColor } from "@/lib/utils"
import type { Proyecto } from "@/types/proyecto"

function resolveProyectoImage(imagen?: string): string {
  if (!imagen) return "/placeholder.svg"
  if (imagen.startsWith("http") || imagen.startsWith("/") || imagen.startsWith("blob:") || imagen.startsWith("data:")) {
    return imagen
  }
  return `${API_URL}/uploads/proyectos/${imagen}`
}

export default function ProyectosPage() {
  const {
    selectedProject,
    openProjectModal,
    closeProjectModal,
  } = useProjects()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProyectos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProyectos()
      setProyectos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los proyectos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProyectos()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Proyectos de Investigación</h1>
          <p className="text-muted-foreground max-w-2xl">
            Descubre nuestros proyectos de investigación en el campo de la usabilidad y experiencia de usuario.
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading ? "Cargando proyectos..." : `${proyectos.length} proyecto${proyectos.length !== 1 ? "s" : ""} encontrado${proyectos.length !== 1 ? "s" : ""}`}
        </div>

        {error && (
          <div className="bg-destructive/15 p-4 rounded-md border border-destructive">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={loadProyectos}>
              Reintentar
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full rounded bg-muted mb-2" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : proyectos.length === 0 && !error ? (
          <p className="text-muted-foreground text-center py-12">No se encontraron proyectos.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((proyecto) => (
              <Card
                key={proyecto.ID}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                onClick={() => openProjectModal(proyecto)}
              >
                <div className="aspect-video relative">
                  <Image
                    src={resolveProyectoImage(proyecto.imagen)}
                    alt={proyecto.nombre || "Imagen del proyecto"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(proyecto.estado)}>
                      {proyecto.estado}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{proyecto.nombre}</CardTitle>
                  <CardDescription>{proyecto.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {proyecto.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.areas_investigacion?.map((area) => (
                      <Badge key={area.ID_area} variant="lab">
                        {area.area_nombre || `Área ${area.ID_area}`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ModalProyecto
        selectedProject={selectedProject}
        colaboradores={selectedProject?.colaboradores ?? []}
        onClose={closeProjectModal}
      />
    </div>
  )
}
