// services/metodologiaPruebaService.ts
"use client";
import { MetodologiaPrueba, MetodologiaCaracteristica, TipoMetodologiaPrueba } from "@/types";
import { API_URL } from "../constants/Api";

export const fetchMetodologiasPruebas = async (
  search: string = '',
  filterTipo: TipoMetodologiaPrueba | 'todos' = 'todos'
) => {
  const params = new URLSearchParams();
  if (search) params.append("q", search);
  if (filterTipo !== 'todos') params.append("tipo", filterTipo);

  const response = await fetch(`${API_URL}/public/research/metodologias?${params.toString()}`);
  const data = await response.json();
  
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.metodologiasPruebas)) {
    return data.metodologiasPruebas;
  }
  return [];
};

export const getMetodologiaPruebaById = async (id: number) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/${id}`);
  if (!res.ok) {
    throw new Error("No se pudo obtener la metodología/prueba");
  }
  return await res.json();
};

// Construye FormData multipart (sin Content-Type manual: el navegador fija el
// boundary). Archivos (File/Blob) se adjuntan directo; arreglos/objetos como
// JSON; escalares como string. Nunca base64 en JSON.
const appendToFormData = (formData: FormData, data: Record<string, unknown>) => {
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
};

export const addMetodologiaPrueba = async (
  metodologiaData: Omit<MetodologiaPrueba, 'ID' | 'fecha_creacion' | 'caracteristicas'>,
  imagenFile?: File
) => {
  try {
    const formData = new FormData();
    appendToFormData(formData, metodologiaData as Record<string, unknown>);
    formData.append("fecha_creacion", new Date().toISOString());
    if (imagenFile) {
      formData.delete("imagen");
      formData.append("imagen", imagenFile);
    }
    const res = await fetch(`${API_URL}/public/research/metodologias`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al crear metodología/prueba");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en addMetodologiaPrueba:", error);
    throw error;
  }
};

export const updateMetodologiaPrueba = async (
  id: number,
  metodologiaData: Partial<MetodologiaPrueba>,
  imagenFile?: File
) => {
  const formData = new FormData();
  appendToFormData(formData, metodologiaData as Record<string, unknown>);
  if (imagenFile) {
    formData.delete("imagen");
    formData.append("imagen", imagenFile);
  }
  const res = await fetch(`${API_URL}/public/research/metodologias/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar metodología/prueba");
  }

  return await res.json();
};

export const deleteMetodologiaPrueba = async (id: number) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al eliminar metodología/prueba");
  }
};

// Servicios para características
export const addCaracteristica = async (caracteristicaData: Omit<MetodologiaCaracteristica, 'ID'>) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/caracteristicas`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(caracteristicaData),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al agregar característica");
  }

  return await res.json();
};

export const updateCaracteristica = async (id: number, caracteristicaData: Partial<MetodologiaCaracteristica>) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/caracteristicas/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(caracteristicaData),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar característica");
  }

  return await res.json();
};

export const deleteCaracteristica = async (id: number) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/caracteristicas/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al eliminar característica");
  }
};

// Servicios especializados
export const fetchByTipo = async (tipo: TipoMetodologiaPrueba) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/tipo/${tipo}`);
  if (!res.ok) {
    throw new Error("Error al obtener metodologías/pruebas por tipo");
  }
  return await res.json();
};

export const fetchCaracteristicasByMetodologia = async (idMetodologia: number) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/${idMetodologia}/caracteristicas`);
  if (!res.ok) {
    throw new Error("Error al obtener características");
  }
  return await res.json();
};