import { API_URL } from "../constants/Api";
import { AreaInvestigacion } from "../types"; // Ajusta el import según tu estructura

// Obtener todas las áreas de investigación
export const fetchAreasInvestigacion = async () => {
  const res = await fetch(`${API_URL}/areas`);
  if (!res.ok) throw new Error("Error al obtener áreas de investigación");
  return await res.json();
};

// Obtener un área por ID
export const getAreaInvestigacionById = async (id: number) => {
  const res = await fetch(`${API_URL}/areas/${id}`);
  if (!res.ok) throw new Error("Error al obtener el área de investigación");
  return await res.json();
};

// Crear nueva área
export const addAreaInvestigacion = async (areaData: Omit<AreaInvestigacion, "ID">) => {
  const res = await fetch(`${API_URL}/areas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(areaData),
  });
  if (!res.ok) throw new Error("Error al crear área de investigación");
  return await res.json();
};

// Actualizar área
export const updateAreaInvestigacion = async (id: number, areaData: Partial<AreaInvestigacion>) => {
  const res = await fetch(`${API_URL}/areas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(areaData),
  });
  if (!res.ok) throw new Error("Error al actualizar área de investigación");
  return await res.json();
};

// Eliminar área
export const deleteAreaInvestigacion = async (id: number) => {
  const res = await fetch(`${API_URL}/areas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar área de investigación");
  return await res.json();
};