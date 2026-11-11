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

export const addMetodologiaPrueba = async (metodologiaData: Omit<MetodologiaPrueba, 'ID' | 'fecha_creacion' | 'caracteristicas'>) => {
  try {
    const res = await fetch(`${API_URL}/public/research/metodologias`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        ...metodologiaData,
        fecha_creacion: new Date().toISOString(),
        caracteristicas: [] // Inicializa sin características
      }),
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

export const updateMetodologiaPrueba = async (id: number, metodologiaData: Partial<MetodologiaPrueba>) => {
  const res = await fetch(`${API_URL}/public/research/metodologias/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(metodologiaData),
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