"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Evento } from "@/types/eventoNoticia";
import { useEventos } from "./hooks/useEventos";
import { useAreas } from "./hooks/useAreas";
import { EventoForm } from "./components/EventoForm";
import { EventoEditDialog } from "./components/EventoEditDialog";
import { AsistentesDialog } from "./components/AsistentesDialog";
import { EventoViews } from "./components/EventoViews";
import { EVENT_TYPES, toDatetimeLocal } from "./components/utils";

export default function EventosPasadosPage() {
  const { toast } = useToast();
  const { eventos, search, setSearch, filterTipo, setFilterTipo, loadEventos, createEvento, editEvento, removeEvento } = useEventos();
  const { areas } = useAreas();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);
  const [asistentesOpen, setAsistentesOpen] = useState(false);
  const [eventoAsistentes, setEventoAsistentes] = useState<Evento | null>(null);

  const handleCreate = async (fd: FormData) => {
    try {
      const nuevo = await createEvento(fd);
      setEventoToEdit(nuevo);
      // normalize fecha for edit dialog
      if (nuevo.fecha) nuevo.fecha = toDatetimeLocal(nuevo.fecha);
      setAddOpen(false);
      setEditOpen(true);
      toast({ title: "Evento creado", description: "Ahora agrega áreas y materiales.", variant: "default" } as unknown as Parameters<typeof toast>[0]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo agregar el evento.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleEdit = async (id: number, fd: FormData) => {
    try {
      await editEvento(id, fd);
      setEditOpen(false);
      setEventoToEdit(null);
      toast({ title: "Evento actualizado", description: "El evento fue actualizado correctamente.", variant: "default" } as unknown as Parameters<typeof toast>[0]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar el evento.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!eventoToDelete?.ID) return;
    try {
      await removeEvento(eventoToDelete.ID);
      setDeleteOpen(false);
      setEventoToDelete(null);
      toast({ title: "Evento eliminado", description: "El evento fue eliminado correctamente.", variant: "default" } as unknown as Parameters<typeof toast>[0]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar el evento.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const openEdit = (evento: Evento) => {
    setEventoToEdit(evento);
    setEditOpen(true);
  };

  const openAsistentes = (evento: Evento) => {
    setEventoAsistentes(evento);
    setAsistentesOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Eventos y Noticias</h2>
        <EventoForm open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar eventos/noticias..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterTipo} onValueChange={(v) => setFilterTipo(v as typeof filterTipo)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EventoViews eventos={eventos} onEdit={openEdit} onDelete={(e) => { setEventoToDelete(e); setDeleteOpen(true); }} onAsistentes={openAsistentes} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar evento?</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventoEditDialog evento={eventoToEdit} open={editOpen} onOpenChange={setEditOpen} areas={areas} onSubmit={handleEdit} onMaterialsChanged={loadEventos} />
      <AsistentesDialog evento={eventoAsistentes} open={asistentesOpen} onOpenChange={setAsistentesOpen} />
      <Toaster />
    </div>
  );
}
