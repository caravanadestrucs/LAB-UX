import { TipoEventoNoticia } from "@/types/eventoNoticia";

export const EVENT_TYPES: { value: TipoEventoNoticia; label: string; badge: string }[] = [
  { value: "evento", label: "Evento", badge: "bg-blue-500" },
  { value: "noticia", label: "Noticia", badge: "bg-green-500" },
  { value: "proximo_evento", label: "Próximo Evento", badge: "bg-purple-500" },
];

export const MATERIAL_TYPES = [
  { value: "presentation", label: "Presentación" },
  { value: "document", label: "Documento" },
  { value: "video", label: "Video" },
];

export function toDatetimeLocal(dateString: string): string {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateString)) return dateString.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
    const [date, time] = dateString.split(" ");
    return `${date}T${time.slice(0, 5)}`;
  }
  const d = new Date(dateString);
  if (!isNaN(d.getTime())) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return "";
}
