"use client";

import { useEffect, useState } from "react";
import { fetchAreasInvestigacion } from "@/services/areainvestigacion";

export function useAreas() {
  const [areas, setAreas] = useState<{ ID: number; nombre: string }[]>([]);

  useEffect(() => {
    fetchAreasInvestigacion()
      .then((data) => setAreas(Array.isArray(data) ? data : []))
      .catch(() => setAreas([]));
  }, []);

  return { areas };
}
