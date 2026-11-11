"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Evento } from "@/types/eventoNoticia";
import { fetchAsistentesEvento } from "@/services/eventoNoticia";

type Props = {
  evento: Evento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AsistentesDialog({ evento, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [asistentes, setAsistentes] = useState<unknown[]>([]);

  useEffect(() => {
    if (!open || !evento?.ID) {
      setAsistentes([]);
      return;
    }
    fetchAsistentesEvento(evento.ID)
      .then(setAsistentes)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "No se pudieron cargar los asistentes.";
        toast({ title: "Error", description: msg, variant: "destructive" });
      });
  }, [open, evento, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asistentes del Evento</DialogTitle>
          <DialogDescription>Lista de asistentes para &quot;{evento?.titulo}&quot;</DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto">
          {asistentes.length === 0 ? (
            <p className="text-muted-foreground">No hay asistentes registrados.</p>
          ) : (
            <ul className="space-y-2">
              {asistentes.map((a: unknown, idx: number) => {
                const r = a as Record<string, string>;
                return (
                  <li key={idx} className="border rounded px-2 py-1">
                    {r.nombre_externo || r.nombre || r.email_externo || r.email || JSON.stringify(a)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
