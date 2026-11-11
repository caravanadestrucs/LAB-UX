"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon, ClockIcon, MapPinIcon, UserIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Evento } from "@/types/eventoNoticia";

export function ProximoEventoDialog({
  evento,
  onClose,
}: {
  evento: Evento | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={evento !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{evento?.titulo}</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>

        <div className="bg-muted/30 rounded-lg p-6 mb-6 border">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-md flex flex-col items-center justify-center">
              <span className="text-2xl font-bold leading-none">
                {(evento?.fecha ? new Date(evento.fecha).getDate() : "")}
              </span>
              <span className="text-xs uppercase text-muted-foreground">
                {(evento?.fecha ? new Date(evento.fecha).toLocaleString('default', { month: 'short' }) : "")}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-medium">{evento?.titulo}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <ClockIcon className="mr-1.5 h-4 w-4" />
                {evento?.fecha ? new Date(evento.fecha).toLocaleString() : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm mb-2">
            <MapPinIcon className="mr-1.5 h-4 w-4" />
            <span className="font-medium">Ubicación:</span>
            <span className="ml-1">{evento?.lugar || "Por definir"}</span>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-medium">Descripción del evento</h4>
            <p>{evento?.descripcion}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detalles adicionales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-muted rounded-md p-2 mr-3">
                <TagIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mt-4">
            <p className="text-sm font-medium">Nota importante</p>
            <p className="text-sm text-muted-foreground">
              {evento?.materiales && evento.materiales.length > 0
                ? evento.materiales.map((material) => material.nombre).join(", ")
                : "La inscripción es gratuita pero los cupos son limitados. Se recomienda llegar 15 minutos antes del inicio del evento."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Agregar al calendario</Button>
          <Button>Inscribirse ahora</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}