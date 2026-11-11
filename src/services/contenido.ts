import { ContenidoSitio } from "@/types/contenidoSitio";
import { API_URL } from "../constants/Api";

// Obtener todos los contenidos con filtros dinámicos (tipo, búsqueda, estado, etc.)
export const fetchContenidos = async (params?: Record<string, string | number | undefined>): Promise<ContenidoSitio[]> => {
  let query = "";
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") searchParams.append(key, String(value));
    });
    query = `?${searchParams.toString()}`;
  }
  const res = await fetch(`${API_URL}/contenido${query}`);
  if (!res.ok) throw new Error("Error al obtener los contenidos");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
};

// Obtener un contenido por ID
export const fetchContenidoById = async (id: number): Promise<ContenidoSitio> => {
  const res = await fetch(`${API_URL}/contenido/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener el contenido");
  const data = await res.json();
  return data.data || data;
};

// Crear un nuevo contenido (con imagen)
export const addContenido = async (
  contenido: Omit<ContenidoSitio, "ID" | "fecha_creacion" | "fecha_actualizacion">,
  imagenFile?: File
) => {
  const formData = new FormData();
  Object.entries(contenido).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (imagenFile) {
    formData.append("imagen", imagenFile);
  }
  const res = await fetch(`${API_URL}/contenido`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al crear contenido");
  }
  return await res.json();
};

// Actualizar un contenido existente (con imagen)
export const updateContenido = async (
  id: number,
  contenido: Partial<ContenidoSitio>,
  imagenFile?: File
) => {
  const formData = new FormData();
  Object.entries(contenido).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (imagenFile) {
    formData.append("imagen", imagenFile);
  }
  const res = await fetch(`${API_URL}/contenido/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al actualizar contenido");
  }
  return await res.json();
};

// Eliminar un contenido
export const deleteContenido = async (id: number) => {
  const res = await fetch(`${API_URL}/contenido/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al eliminar contenido");
  }
  return await res.json();
};