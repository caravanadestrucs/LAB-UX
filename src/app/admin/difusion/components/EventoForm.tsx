"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TipoEventoNoticia } from "@/types/eventoNoticia";
import { getUsuarioActual } from "@/hooks/islogin";
import { EVENT_TYPES } from "./utils";
import { Plus } from "lucide-react";

export type CreateFormState = {
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  tipo: TipoEventoNoticia;
  imagen: File | null;
};

const emptyForm: CreateFormState = {
  titulo: "",
  descripcion: "",
  fecha: "",
  lugar: "",
  tipo: "evento",
  imagen: null,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

export function EventoForm({ open, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<CreateFormState>(emptyForm);

  useEffect(() => {
    if (!open) setForm(emptyForm);
  }, [open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value } as CreateFormState));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setForm((prev) => ({ ...prev, imagen: e.target.files![0] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("titulo", form.titulo);
    fd.append("descripcion", form.descripcion);
    fd.append("fecha", form.fecha);
    fd.append("lugar", form.lugar);
    fd.append("tipo", form.tipo);
    fd.append("fecha_creacion", new Date().toISOString().slice(0, 19).replace("T", " "));
    // ID real desde sesión; sin sesión se omite (el backend valida con JWT).
    // TODO: migrar backend a derivar autor desde JWT y no pedir ID_usuario.
    const session = getUsuarioActual() as { ID?: unknown; id?: unknown } | null;
    const sessionId = session?.ID ?? session?.id;
    if (typeof sessionId === "number") fd.append("ID_usuario", String(sessionId));
    if (form.imagen) fd.append("imagen", form.imagen);
    await onSubmit(fd);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Evento/Noticia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Añadir Evento o Noticia</DialogTitle>
          <DialogDescription>Complete la información para añadir un evento o noticia.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={form.titulo} onChange={handleInputChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" value={form.descripcion} onChange={handleInputChange} rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="datetime-local" value={form.fecha} onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm((prev) => ({ ...prev, tipo: v as TipoEventoNoticia }))}>
                <SelectTrigger id="tipo">
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
            <Label htmlFor="lugar">Lugar</Label>
            <Input id="lugar" value={form.lugar} onChange={handleInputChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagen">Imagen</Label>
            <Input id="imagen" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <DialogFooter>
            <Button type="submit">Añadir Evento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
