import { GuiaTutorial, GuiaRecurso, GuiaAreaInvestigacion } from "@/types";
import { API_URL } from "../constants/Api";


// --- GUÍAS ---
export const fetchGuias = async (params?: Record<string, string | number>) => {
  const url = new URL(`${API_URL}/guias`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("No se pudieron obtener las guías");
  return await res.json() as GuiaTutorial[];
};

export const getGuiaById = async (id: number) => {
  const res = await fetch(`${API_URL}/guias/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener la guía");
  return await res.json() as GuiaTutorial;
};

export const createGuia = async (data: FormData) => {
  const res = await fetch(`${API_URL}/guias`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Error al crear la guía");
  return await res.json();
};

export const updateGuia = async (id: number, data: FormData) => {
  const res = await fetch(`${API_URL}/guias/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) throw new Error("Error al actualizar la guía");
  return await res.json();
};

export const deleteGuia = async (id: number) => {
  const res = await fetch(`${API_URL}/guias/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la guía");
  return await res.json();
};

// --- RECURSOS ---
export const fetchRecursosGuia = async (id: number) => {
  const res = await fetch(`${API_URL}/guias/${id}/recursos`);
  if (!res.ok) throw new Error("No se pudieron obtener los recursos");
  return await res.json() as GuiaRecurso[];
};

export const addRecursoToGuia = async (
  id: number,
  recurso: Partial<GuiaRecurso>,
  archivo?: File
) => {
  const formData = new FormData();
  Object.entries(recurso as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  if (archivo) {
    formData.delete("recurso");
    formData.append("recurso", archivo);
  }
  const res = await fetch(`${API_URL}/guias/${id}/recursos`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al agregar el recurso");
  return await res.json();
};

export const deleteRecursoFromGuia = async (id: number, id_recurso: number) => {
  const res = await fetch(`${API_URL}/guias/${id}/recursos/${id_recurso}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el recurso");
  return await res.json();
};

// --- ÁREAS DE INVESTIGACIÓN ---
export const fetchAreasGuia = async (id: number) => {
  const res = await fetch(`${API_URL}/guias/${id}/areas-investigacion`);
  if (!res.ok) throw new Error("No se pudieron obtener las áreas");
  return await res.json() as GuiaAreaInvestigacion[];
};

export const addAreaToGuia = async (id: number, id_area: number) => {
  const res = await fetch(`${API_URL}/guias/${id}/areas-investigacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ID_area: id_area }),
  });
  if (!res.ok) throw new Error("Error al agregar el área");
  return await res.json();
};

export const deleteAreaFromGuia = async (id: number, id_area: number) => {
  const res = await fetch(`${API_URL}/guias/${id}/areas-investigacion/${id_area}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el área");
  return await res.json();
};