"use client"

import { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon, MapPinIcon, ArrowRightIcon} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { NoticiaDialog } from "./components/dialogNoticia";
import { EventoDialog } from "./components/dialogEvento";
import { ProximoEventoDialog } from "./components/dialogProximoEvento";
import type { Evento } from "@/types/eventoNoticia";
import { fetchEventosNoticias } from "@/services/eventoNoticia";
import { API_URL } from "@/constants/Api";

function resolveEventoImage(imagen?: string | null): string {
  if (!imagen) return "/placeholder.svg";
  if (imagen.startsWith("http") || imagen.startsWith("/") || imagen.startsWith("blob:") || imagen.startsWith("data:")) {
    return imagen;
  }
  return `${API_URL}/uploads/eventos/${imagen}`;
}

function normalizeEventos(data: unknown): Evento[] {
  if (!Array.isArray(data)) return [];
  return (data as Evento[]).map((item) => ({
    ...item,
    imagen: resolveEventoImage(item.imagen),
    lugar: item.lugar || "Por definir",
  }));
}

function SkeletonCards() {
  return (
    <div className="space-y-12" aria-hidden="true">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-pulse">
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DifusionPage() {
  const [selectedNoticia, setSelectedNoticia] = useState<Evento | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [selectedProximoEvento, setSelectedProximoEvento] = useState<Evento | null>(null);
  const [noticias, setNoticias] = useState<Evento[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [proximosEventos, setProximosEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDifusion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventosNoticias("", "todos");
      const normalized = normalizeEventos(data);
      setNoticias(normalized.filter((item) => item.tipo === "noticia"));
      setEventos(normalized.filter((item) => item.tipo === "evento"));
      setProximosEventos(normalized.filter((item) => item.tipo === "proximo_evento"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la difusión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDifusion();
  }, []);

  const total = noticias.length + eventos.length + proximosEventos.length;

  return (
    <div className="container mx-auto py-12 px-4">
      <section id="team" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-4 py-1 text-sm">
                Difusión
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explora lo que está sucediendo en Lab-UX</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Un equipo diverso y apasionado de profesionales, educadores y estudiantes comprometidos con la
                excelencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? "Cargando difusión..." : `${total} publicación${total !== 1 ? "es" : ""} encontrada${total !== 1 ? "s" : ""}`}
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md border border-destructive mb-8">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={loadDifusion}>
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna izquierda (más grande) - Noticias y Eventos */}
        <div className="lg:col-span-2 space-y-16">
          {/* Sección de Noticias */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Noticias Destacadas</h2>
            {loading ? (
              <SkeletonCards />
            ) : noticias.length === 0 ? (
              <p className="text-muted-foreground">No hay noticias disponibles.</p>
            ) : (
              <div className="space-y-12">
                {noticias.map((noticia, index) => (
                  <div key={noticia.ID ?? index} className="group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div
                        className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => setSelectedNoticia(noticia)}
                      >
                        <Image
                          src={noticia.imagen || "/placeholder.svg"}
                          alt={noticia.titulo}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-muted-foreground mb-2">
                          {noticia.fecha ? new Date(noticia.fecha).toLocaleDateString() : ""}
                        </div>
                        <h3
                          className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors cursor-pointer"
                          onClick={() => setSelectedNoticia(noticia)}
                        >
                          {noticia.titulo}
                        </h3>
                        <p className="text-muted-foreground mb-4">{noticia.descripcion}</p>
                        <div className="mt-auto">
                          <Button
                            variant="link"
                            className="p-0 h-auto font-medium"
                            onClick={() => setSelectedNoticia(noticia)}
                          >
                            Leer más <ArrowRightIcon className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index < noticias.length - 1 && <Separator className="mt-12" />}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección de Eventos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Eventos Recientes</h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 animate-pulse" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/4 rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : eventos.length === 0 ? (
              <p className="text-muted-foreground">No hay eventos recientes.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {eventos.map((evento) => (
                  <div
                    key={evento.ID}
                    className="flex items-center p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setSelectedEvento(evento)}
                  >
                    <div className="mr-4 flex-shrink-0 w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {evento.fecha ? new Date(evento.fecha).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{evento.titulo}</h3>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Button variant="outline">Ver todos los eventos</Button>
            </div>
          </section>
        </div>

        {/* Columna derecha (más pequeña) - Eventos Próximos */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-muted/30 rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-primary text-primary-foreground p-1.5 rounded-md mr-3">
                <CalendarIcon className="h-5 w-5" />
              </span>
              Próximos Eventos
            </h2>
            {loading ? (
              <div className="space-y-6 animate-pulse" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-14 rounded-md bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : proximosEventos.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay próximos eventos.</p>
            ) : (
              <div className="space-y-6">
                {proximosEventos.map((evento) => (
                  <div
                    key={evento.ID}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProximoEvento(evento)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-14 h-14 bg-background rounded-md border border-border flex flex-col items-center justify-center">
                        <span className="text-lg font-bold leading-none">
                          {(evento.fecha ? new Date(evento.fecha).getDate() : "")}
                        </span>
                        <span className="text-xs uppercase text-muted-foreground">
                          {(evento.fecha ? new Date(evento.fecha).toLocaleString('default', { month: 'short' }) : "")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{evento.titulo}</h3>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <ClockIcon className="mr-1.5 h-3 w-3" />
                            {evento.fecha ? new Date(evento.fecha).toLocaleString() : "Por definir"}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="mr-1.5 h-3 w-3" />
                            {evento.lugar || "Por definir"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Button className="w-full">Ver calendario completo</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogos */}
      <NoticiaDialog
        noticia={selectedNoticia}
        onClose={() => setSelectedNoticia(null)}
      />

      <EventoDialog
        evento={selectedEvento}
        onClose={() => setSelectedEvento(null)}
      />

      <ProximoEventoDialog
        evento={selectedProximoEvento}
        onClose={() => setSelectedProximoEvento(null)}
      />
    </div>
  );
}
