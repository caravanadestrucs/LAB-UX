import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completado":
    case "activo":
      return "bg-green-100 text-green-800"
    case "en progreso":
    case "en curso":
      return "bg-[#0E7490]/10 text-[#0E7490]"
    case "planificado":
      return "bg-[#CA8A04]/15 text-[#CA8A04]"
    case "en pausa":
      return "bg-orange-100 text-orange-800"
    case "cancelado":
    case "inactivo":
      return "bg-red-100 text-red-800"
    default:
      return "bg-[#F1F5F9] text-[#0F1E33]"
  }
}