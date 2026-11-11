"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addAreaToEvento, removeAreaFromEvento } from "@/services/eventoNoticia";
import { Evento, TipoEventoNoticia } from "@/types/eventoNoticia";
import { EVENT_TYPES, toDatetimeLocal } from "./utils";
import { MaterialManager } from "./MaterialManager";

type EditFormState = {
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  tipo: TipoEventoNoticia;
  imagen: File | null;
  areas_investigacion: number[];
};

type Props = {
  evento: Evento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areas: { ID: number; nombre: string }[];
  onSubmit: (id: number, formData: FormData) => Promise<void>;
  onMaterialsChanged: () => void;
};

export function EventoEditDialog({ evento, open, onOpenChange, areas, onSubmit, onMaterialsChanged }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<EditFormState>({
    titulo: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    tipo: "evento",
    imagen: null,
    areas_investigacion: [],
  });

  useEffect(() => {
    if (evento && open) {
      setForm({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: toDatetimeLocal(evento.fecha),
        lugar: evento.lugar,
        tipo: evento.tipo,
        imagen: null,
        areas_investigacion: evento.areas_investigacion?.map((a: unknown) => {
          const r = a as Record<string, number>;
          return r.ID_area ?? r.ID ?? 0;
        }) ?? [],
      });
    }
  }, [evento, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!evento?.ID) return;
    const fd = new FormData();
    fd.append("titulo", form.titulo);
    fd.append("descripcion", form.descripcion);
    fd.append("fecha", form.fecha);
    fd.append("lugar", form.lugar);
    fd.append("tipo", form.tipo);
    fd.append("fecha_actualizacion", new Date().toISOString().slice(0, 19).replace("T", " "));
    // TODO: ID_usuario hardcode debe venir de auth
    fd.append("ID_usuario", "1");
    if (form.imagen) fd.append("imagen", form.imagen);
    // áreas se manejan vía endpoint separado, pero mantenemos compat si el backend las lee de FormData
    form.areas_investigacion.forEach((id, idx) => fd.append(`areas_investigacion[${idx}]`, String(id)));
    await onSubmit(evento.ID, fd);
  };

  const toggleArea = async (areaId: number, checked: boolean) => {
    if (!evento?.ID) return;
    try {
      if (checked) {
        await removeAreaFromEvento(evento.ID, areaId);
        setForm((prev) => ({ ...prev, areas_investigacion: prev.areas_investigacion.filter((a) => a !== areaId) }));
      } else {
        await addAreaToEvento({ ID_area: areaId, ID_evento: evento.ID } as unknown as Parameters<typeof addAreaToEvento>[0]);
        setForm((prev) => ({ ...prev, areas_investigacion: [...prev.areas_investigacion, areaId] }));
      }
      toast({
        title: "Áreas actualizadas",
        description: checked ? "Área eliminada correctamente." : "Área agregada correctamente.",
        variant: "default",
      } as unknown as Parameters<typeof toast>[0]);
      onMaterialsChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo actualizar el área.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento o Noticia</DialogTitle>
          <DialogDescription>Modifica la información del evento o noticia, agrega áreas y materiales.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="edit-titulo">Título</Label>
            <Input id="edit-titulo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-descripcion">Descripción</Label>
            <Textarea id="edit-descripcion" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-fecha">Fecha</Label>
              <Input id="edit-fecha" type="datetime-local" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tipo">Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as TipoEventoNoticia })}>
                <SelectTrigger id="edit-tipo">
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-lugar">Lugar</Label>
            <Input id="edit-lugar" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-imagen">Imagen</Label>
            <Input id="edit-imagen" type="file" accept="image/*" onChange={(e) => setForm({ ...form, imagen: e.target.files?.[0] || null })} />
          </div>

          <div className="grid gap-2">
            <Label>Áreas de Investigación</Label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => {
                const checked = form.areas_investigacion.includes(area.ID);
                return (
                  <label key={area.ID} className="flex items-center gap-1">
                    <input type="checkbox" checked={checked} onChange={() => toggleArea(area.ID, checked)} />
                    {area.nombre}
                  </label>
                );
              })}
            </div>
          </div>

          <MaterialManager evento={evento} onChanged={onMaterialsChanged} />

          <DialogFooter>
            <Button type="submit">Actualizar Evento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
