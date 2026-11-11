'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getStatusColor } from "@/lib/utils"
import Image from "next/image"
import { Proyecto, ProyectoColaborador } from "@/types"
import { API_URL } from "@/constants/Api"

function resolveImagen(imagen?: string): string {
  if (!imagen) return "/placeholder.svg"
  if (imagen.startsWith("http") || imagen.startsWith("/") || imagen.startsWith("blob:") || imagen.startsWith("data:")) {
    return imagen
  }
  return `${API_URL}/uploads/proyectos/${imagen}`
}

interface ModalProyectoProps {
  selectedProject: Proyecto | null
  colaboradores?: ProyectoColaborador[]
  onClose: () => void
}

export function ModalProyecto({
  selectedProject,
  colaboradores = [],
  onClose,
}: ModalProyectoProps) {
  if (!selectedProject) return null

  return (
    <Dialog open={!!selectedProject} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{selectedProject.nombre}</DialogTitle>
            <Badge className={getStatusColor(selectedProject.estado)}>
              {selectedProject.estado}
            </Badge>
          </div>
          <DialogDescription>{selectedProject.descripcion}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Imagen principal */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-lg">
              <Image
                alt={selectedProject.nombre || "Imagen del proyecto"}
                src={resolveImagen(selectedProject.imagen)}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <Separator />

          {/* Fechas y progreso */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                Estado del Proyecto
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de inicio:</span>
                  <span className="text-sm font-medium">{selectedProject.fecha_inicio ? String(selectedProject.fecha_inicio) : "No definida"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de fin:</span>
                  <span className="text-sm font-medium">{selectedProject.fecha_fin ? String(selectedProject.fecha_fin) : "No definida"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Progreso:</span>
                  <span className="text-sm font-medium">{selectedProject.progreso ?? 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${selectedProject.progreso ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Colaboradores */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                Colaboradores
              </h3>
              <div className="space-y-3">
                {colaboradores.length === 0 && (
                  <span className="text-sm text-muted-foreground">Sin colaboradores</span>
                )}
                {colaboradores.map((colaborador, index) => {
                  const nombreCompleto = [colaborador.nombre, colaborador.apellido].filter(Boolean).join(" ")
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {nombreCompleto || `Usuario #${colaborador.ID_usuario}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}