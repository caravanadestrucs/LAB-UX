import { PreguntaFrecuente } from "@/types/preguntaFrecuente"
import { API_URL } from "../constants/Api";

export async function fetchPreguntasFrecuentes(): Promise<PreguntaFrecuente[]> {
  const res = await fetch(`${API_URL}/preguntasfrecuentes`)
  if (!res.ok) throw new Error("Error al obtener preguntas frecuentes")
  return res.json()
}

export async function addPreguntaFrecuente(data: Omit<PreguntaFrecuente, "ID" | "fecha_creacion" | "fecha_actualizacion">) {
  const res = await fetch(`${API_URL}/preguntasfrecuentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al agregar pregunta frecuente")
  return res.json()
}

export async function updatePreguntaFrecuente(id: number, data: Partial<PreguntaFrecuente>) {
  const res = await fetch(`${API_URL}/preguntasfrecuentes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar pregunta frecuente")
  return res.json()
}

export async function deletePreguntaFrecuente(id: number) {
  const res = await fetch(`${API_URL}/preguntasfrecuentes/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar pregunta frecuente")
  return res.json()
}