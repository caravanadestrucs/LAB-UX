"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { XIcon, CalendarIcon, MapPinIcon, UserIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Evento, EventoAreaInvestigacion } from "@/types/eventoNoticia";
import { getUserById } from "@/services";

export function EventoDialog({
  evento,
  onClose,
}: {
  evento: Evento | null;
  onClose: () => void;
}) {
    const [nombreAutor, setNombreAutor] = useState<string | null>(null);
    const [cargandoAutor, setCargandoAutor] = useState(false);
    useEffect(() => {
        const obtenerAutor = async () => {
          if (evento?.ID_usuario) {
            try {
              setCargandoAutor(true);
              const usuario = await getUserById(evento.ID_usuario);
              setNombreAutor(usuario.nombre);
            } catch (error) {
              console.error("Error al obtener autor:", error);
              setNombreAutor(null);
            } finally {
              setCargandoAutor(false);
            }
          }
        };
         obtenerAutor();
  }, [evento]);

  return (
    <Dialog open={evento !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{evento?.titulo}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            
            <span className="text-sm text-muted-foreground">
              {evento?.fecha ? new Date(evento.fecha).toLocaleDateString() : ""}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>

        {evento?.imagen && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
            <Image
              src={evento.imagen}
              alt={evento.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Descripción del evento</h3>
          <p>{evento?.descripcion}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Fecha y hora</p>
                <p className="text-sm text-muted-foreground">
                  {evento?.fecha ? new Date(evento.fecha).toLocaleString() : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-sm text-muted-foreground">
                  {evento?.lugar  || "Por definir"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Organizador</p>
                <p className="text-sm text-muted-foreground">
                  {(nombreAutor || cargandoAutor) && (
                    cargandoAutor ? (
                      <span>Cargando...</span>
                    ) : (
                      nombreAutor
                    )
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <TagIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">[Area de Investigacion</p>
                <p className="text-sm text-muted-foreground">
                  {evento?.areas_investigacion && evento.areas_investigacion.length > 0
                    ? evento.areas_investigacion.map((area: EventoAreaInvestigacion) => area.ID_area).join(", ")
                    : "No especificada"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Agregar al calendario</Button>
          <Button>Inscribirse al evento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}