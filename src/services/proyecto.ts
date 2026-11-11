"use client"
import { Proyecto, EstadoProyecto, ProyectoAreaInvestigacion, ProyectoColaborador } from "@/types/proyecto";
import { API_URL } from "@/constants/Api";

// Configuración común para fetch
const fetchConfig = {
  baseUrl: API_URL,
  getHeaders: () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
  }),
};

// Operaciones CRUD básicas
export const fetchProyectos = async (
  search: string = '',
  estado?: EstadoProyecto,
  sortBy: string = 'fecha_inicio',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<Proyecto[]> => {
  const params = new URLSearchParams();
  if (search) params.append("q", search);
  if (estado) params.append("estado", estado);
  params.append("sortBy", sortBy);
  params.append("sortOrder", sortOrder);

  try {
    const response = await fetch(`${API_URL}/proyectos?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching proyectos:", error);
    throw error;
  }
};

export const getProyectoById = async (id: number): Promise<Proyecto> => {
  const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${id}`);
  return handleResponse(response);
};

export const createProyecto = async (proyectoData: FormData): Promise<Proyecto> => {
  proyectoData.append("fecha_creacion", new Date().toISOString());
  
  const response = await fetch(`${fetchConfig.baseUrl}/proyectos`, {
    method: "POST",
    headers: {
      "Authorization": fetchConfig.getHeaders().Authorization
    },
    body: proyectoData,
  });
  return handleResponse(response);
};

export const updateProyecto = async (id: number, proyectoData: FormData): Promise<Proyecto> => {
  proyectoData.append("fecha_actualizacion", new Date().toISOString());
  
  const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": fetchConfig.getHeaders().Authorization
    },
    body: proyectoData,
  });
  return handleResponse(response);
};

export const deleteProyecto = async (id: number): Promise<void> => {
  const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${id}`, {
    method: "DELETE",
    headers: fetchConfig.getHeaders(),
  });
  await handleResponse(response);
};



// Gestión de áreas de investigación
export const manageProyectoAreas = {
  add: async (data: ProyectoAreaInvestigacion): Promise<ProyectoAreaInvestigacion> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/areas-investigacion`, {
      method: "POST",
      headers: fetchConfig.getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  remove: async (proyectoId: number, areaId: number): Promise<void> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${proyectoId}/areas-investigacion/${areaId}`, {
      method: "DELETE",
      headers: fetchConfig.getHeaders(),
    });
    await handleResponse(response);
  },
  
  getByProyecto: async (proyectoId: number): Promise<ProyectoAreaInvestigacion[]> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${proyectoId}/areas-investigacion`);
    return handleResponse(response);
  }
};

// Gestión de colaboradores
export const manageProyectoColaboradores = {
  add: async (data: Omit<ProyectoColaborador, 'ID'>): Promise<ProyectoColaborador> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/colaboradores`, {
      method: "POST",
      headers: fetchConfig.getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (proyectoId: number, colaboradorId: number, data: Partial<ProyectoColaborador>): Promise<ProyectoColaborador> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${proyectoId}/colaboradores/${colaboradorId}`, {
      method: "PUT",
      headers: fetchConfig.getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  remove: async (proyectoId: number, colaboradorId: number): Promise<void> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${proyectoId}/colaboradores/${colaboradorId}`, {
      method: "DELETE",
      headers: fetchConfig.getHeaders(),
    });
    await handleResponse(response);
  },
  
  getByProyecto: async (proyectoId: number): Promise<ProyectoColaborador[]> => {
    const response = await fetch(`${fetchConfig.baseUrl}/proyectos/${proyectoId}/colaboradores`);
    return handleResponse(response);
  }
};

// Helper para manejar respuestas
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la solicitud");
  }
  return response.json();
}
// services/proyectoService.ts

export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/proyectos`);
    return response.ok;
  } catch (error) {
    console.error("Error conectando al backend:", error);
    return false;
  }
};