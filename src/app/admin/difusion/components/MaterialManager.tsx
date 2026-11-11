"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addMaterialToEvento, removeMaterialFromEvento } from "@/services/eventoNoticia";
import { Evento } from "@/types/eventoNoticia";
import { MATERIAL_TYPES } from "./utils";

type Props = {
  evento: Evento | null;
  onChanged: () => void;
};

export function MaterialManager({ evento, onChanged }: Props) {
  const { toast } = useToast();
  const [draft, setDraft] = useState<{ tipo: string; nombre: string; archivo: File | null }>({
    tipo: "",
    nombre: "",
    archivo: null,
  });
  const [loading, setLoading] = useState(false);

  const getIcon = (type: string) => <FileText className="h-4 w-4 mr-2" />;

  const handleAdd = async () => {
    if (!evento?.ID || !draft.tipo || !draft.nombre || !draft.archivo) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("tipo", draft.tipo);
      fd.append("nombre", draft.nombre);
      fd.append("archivo", draft.archivo);
      await addMaterialToEvento(evento.ID, fd);
      toast({ title: "Material agregado", description: "El material fue agregado correctamente.", variant: "default" } as unknown as Parameters<typeof toast>[0]);
      setDraft({ tipo: "", nombre: "", archivo: null });
      onChanged();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo agregar el material.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (materialId: number) => {
    if (!evento?.ID) return;
    setLoading(true);
    try {
      await removeMaterialFromEvento(evento.ID, materialId);
      toast({ title: "Material eliminado", description: "El material fue eliminado correctamente.", variant: "default" } as unknown as Parameters<typeof toast>[0]);
      onChanged();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar el material.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <Label>Materiales del Evento</Label>
      <div className="border rounded-md p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="material-tipo">Tipo</Label>
            <select
              value={draft.tipo}
              onChange={(e) => setDraft({ ...draft, tipo: e.target.value })}
              className="border rounded px-2 py-1"
            >
              <option value="">Tipo</option>
              {MATERIAL_TYPES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-nombre">Nombre</Label>
            <Input value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} placeholder="Nombre del material" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="material-archivo">Archivo</Label>
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) setDraft({ ...draft, archivo: e.target.files[0] });
              }}
            />
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={handleAdd} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Material
        </Button>
        {evento?.materiales && evento.materiales.length > 0 && (
          <ul className="mt-2 space-y-1">
            {evento.materiales.map((mat, idx) => (
              <li key={mat.ID ?? idx} className="flex items-center justify-between border rounded px-2 py-1">
                <span className="flex items-center">
                  {getIcon(mat.tipo)} {mat.nombre}
                </span>
                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemove(mat.ID!)} disabled={loading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
