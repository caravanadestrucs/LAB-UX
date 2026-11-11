// services/glosarioService.ts
"use client";
import { Glosario } from "../types";
import { API_URL } from "../constants/Api";

export const fetchTerminos = async (
  queryString: string = '',
  options?: { signal?: AbortSignal },
) => {
  const response = await fetch(`${API_URL}/glosario${queryString}`, {
    signal: options?.signal,
  });
  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.terminos)) {
    return data.terminos;
  }
  return [];
};

export const getTerminoById = async (id: number) => {
  const res = await fetch(`${API_URL}/glosario${id}`);
  if (!res.ok) {
    throw new Error("No se pudo obtener el término del glosario");
  }
  return await res.json();
};

export const addTermino = async (terminoData: Omit<Glosario, 'ID' | 'fecha_creacion'>) => {
  const usuario = localStorage.getItem('usuario');
  const ID_usuario = usuario ? JSON.parse(usuario).ID : null;
  const bodyData = {
    ...terminoData,
    fecha_creacion: getMySQLDateTimeString(new Date()),
    ID_usuario: ID_usuario
  };
  console.log("Body que se enviará:", bodyData); // <-- Aquí ves lo que envías

  try {
    const res = await fetch(`${API_URL}/glosario`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Error al crear término: " + errorData.error || errorData.message);
      throw new Error(errorData.message || "Error al crear término");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en addTermino:", error);
    throw error;
  }
};

export const updateTermino = async (id: number, terminoData: Partial<Glosario>) => {
  const res = await fetch(`${API_URL}/glosario/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(terminoData),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar término");
  }

  return await res.json();
};

export const deleteTermino = async (id: number) => {
  const res = await fetch(`${API_URL}/glosario/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al eliminar término");
  }
};

// Búsqueda especializada por letra inicial
export const fetchTerminosByLetra = async (letra: string) => {
  const res = await fetch(`${API_URL}/glosario/letra/${letra}`);
  if (!res.ok) {
    throw new Error("Error al buscar términos por letra");
  }
  return await res.json();
};

// Búsqueda de términos más recientes
export const fetchTerminosRecientes = async (limit: number = 5) => {
  const res = await fetch(`${API_URL}/glosario/recientes?limit=${limit}`);
  if (!res.ok) {
    throw new Error("Error al obtener términos recientes");
  }
  return await res.json();
};

function getMySQLDateTimeString(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}
