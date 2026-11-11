"use client";

import { useCallback, useEffect, useState } from "react";
import { Evento, TipoEventoNoticia } from "@/types/eventoNoticia";
import {
  fetchEventosNoticias,
  addEventoNoticia,
  updateEventoNoticia,
  deleteEventoNoticia,
  fetchAsistentesEvento,
} from "@/services/eventoNoticia";
import { useToast } from "@/hooks/use-toast";

export function useEventos() {
  const { toast } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<TipoEventoNoticia | "todos">("todos");

  const loadEventos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEventosNoticias(search, filterTipo);
      setEventos(data);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [search, filterTipo, toast]);

  useEffect(() => {
    loadEventos();
  }, [loadEventos]);

  const createEvento = useCallback(
    async (formData: FormData) => {
      // TODO: ID_usuario hardcode "1" debe venir de auth (getUsuarioActual / JWT)
      if (!formData.get("ID_usuario")) formData.set("ID_usuario", "1");
      const nuevo = await addEventoNoticia(formData as unknown as FormData);
      await loadEventos();
      return nuevo as Evento;
    },
    [loadEventos]
  );

  const editEvento = useCallback(
    async (id: number, formData: FormData) => {
      if (!formData.get("ID_usuario")) formData.set("ID_usuario", "1");
      const updated = await updateEventoNoticia(id, formData as unknown as FormData);
      await loadEventos();
      return updated as Evento;
    },
    [loadEventos]
  );

  const removeEvento = useCallback(
    async (id: number) => {
      await deleteEventoNoticia(id);
      await loadEventos();
    },
    [loadEventos]
  );

  const loadAsistentes = useCallback(async (eventoId: number) => {
    return fetchAsistentesEvento(eventoId);
  }, []);

  return {
    eventos,
    loading,
    search,
    setSearch,
    filterTipo,
    setFilterTipo,
    loadEventos,
    createEvento,
    editEvento,
    removeEvento,
    loadAsistentes,
  };
}
