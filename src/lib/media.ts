import { API_URL } from "@/constants/Api";

export type MediaKind =
  | "contenido"
  | "eventos"
  | "materiales"
  | "guias"
  | "tutoriales"
  | "usuarios"
  | "metodologias"
  | "proyectos";

const PREFIX: Record<MediaKind, string> = {
  contenido: "/uploads/contenido",
  eventos: "/uploads/eventos",
  materiales: "/uploads/materiales_evento",
  guias: "/uploads/guias",
  tutoriales: "/uploads/tutoriales",
  usuarios: "/uploads",
  metodologias: "/uploads",
  proyectos: "/uploads/proyectos",
};

export function getMediaUrl(kind: MediaKind, filename?: string | null): string {
  if (!filename) return "/placeholder.svg";
  if (
    filename.startsWith("http") ||
    filename.startsWith("blob:") ||
    filename.startsWith("/") ||
    filename.startsWith("data:")
  )
    return filename;
  return `${API_URL}${PREFIX[kind]}/${filename}`;
}

export function getAvatarUrl(avatarPath?: string | File | null): string | undefined {
  if (!avatarPath) return undefined;
  if (avatarPath instanceof File) return URL.createObjectURL(avatarPath);
  return getMediaUrl("usuarios", avatarPath);
}
