'use client'

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { proyectos,  } from "@/constants/data"
import { useProjects } from "@/hooks/useProjects"
import { ModalProyecto } from "./components/modalProyecto"

export default function ProyectosPage() {  
  const {
    selectedProject,
    openProjectModal,
    closeProjectModal,
  } = useProjects()

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Proyectos de Investigación</h1>
          <p className="text-muted-foreground max-w-2xl">
            Descubre nuestros proyectos de investigación en el campo de la usabilidad y experiencia de usuario.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
              onClick={() => openProjectModal(proyecto)}
            >
              <div className="aspect-video relative">
                <Image
                  src={proyecto.imagen || "/placeholder.svg"}
                  alt={proyecto.nombre || "Imagen del proyecto"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={proyecto.estado}>
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
                  {proyecto.proyecto_areas_investigacion 
                    ? proyecto.proyecto_areas_investigacion.map((area, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800">
                          {area.ID_area}
                        </Badge>
                      ))
                    : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ModalProyecto
        selectedProject={selectedProject}
        onClose={closeProjectModal}
      />
    </div>
  )
}