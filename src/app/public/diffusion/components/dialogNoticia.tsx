"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Evento } from "@/types/eventoNoticia";
import { getUserById } from "@/services";

export function NoticiaDialog({
  noticia,
  onClose,
}: {
  noticia: Evento | null;
  onClose: () => void;
}) {
  const [nombreAutor, setNombreAutor] = useState<string | null>(null);
  const [cargandoAutor, setCargandoAutor] = useState(false);

  useEffect(() => {
    const obtenerAutor = async () => {
      if (noticia?.ID_usuario) {
        try {
          setCargandoAutor(true);
          const usuario = await getUserById(noticia.ID_usuario);
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
  }, [noticia]);

  return (
    <Dialog open={!!noticia} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{noticia?.titulo}</DialogTitle>
          <DialogDescription className="text-sm">
            {noticia?.fecha ? new Date(noticia.fecha).toLocaleDateString() : ""}
          </DialogDescription>
        </DialogHeader>

        {noticia?.imagen && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
            <Image
              src={noticia.imagen}
              alt={noticia.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <p>{noticia?.descripcion}</p>

          {(nombreAutor || cargandoAutor) && (
            <div className="flex items-center mt-6 pt-6 border-t">
              <div className="bg-muted rounded-full p-2 mr-3">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Autor</p>
                {cargandoAutor ? (
                  <p className="text-sm text-muted-foreground">Cargando...</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{nombreAutor}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button>Compartir noticia</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}