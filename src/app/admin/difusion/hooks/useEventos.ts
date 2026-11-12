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
import { getUsuarioActual } from "@/hooks/islogin";

function getSessionUserId(): number | null {
  const u = getUsuarioActual() as { ID?: unknown; id?: unknown } | null;
  const id = u?.ID ?? u?.id;
  return typeof id === "number" ? id : null;
}

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
      // ID real desde sesión (cookie `usuario`); sin sesión se omite y el
      // backend decide con el JWT httpOnly. Nunca hardcodear "1".
      // TODO: migrar backend a derivar autor desde JWT y no pedir ID_usuario.
      if (!formData.get("ID_usuario")) {
        const sessionId = getSessionUserId();
        if (sessionId !== null) formData.set("ID_usuario", String(sessionId));
      }
      const nuevo = await addEventoNoticia(formData as unknown as FormData);
      await loadEventos();
      return nuevo as Evento;
    },
    [loadEventos]
  );

  const editEvento = useCallback(
    async (id: number, formData: FormData) => {
      // Igual que create: ID real o nada (el backend valida con JWT).
      if (!formData.get("ID_usuario")) {
        const sessionId = getSessionUserId();
        if (sessionId !== null) formData.set("ID_usuario", String(sessionId));
      }
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
