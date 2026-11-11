"use client"

import { useState } from "react";
import { CalendarIcon, ClockIcon, MapPinIcon, ArrowRightIcon} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { NoticiaDialog } from "./components/dialogNoticia";
import { EventoDialog } from "./components/dialogEvento";
import { ProximoEventoDialog } from "./components/dialogProximoEvento";
import { EventoNoticia } from "@/types";
import { proximosEventos, noticias, eventos } from "@/constants/data";

export default function DifusionPage() {
  const [selectedNoticia, setSelectedNoticia] = useState<EventoNoticia | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<EventoNoticia | null>(null);
  const [selectedProximoEvento, setSelectedProximoEvento] = useState<EventoNoticia | null>(null);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna izquierda (más grande) - Noticias y Eventos */}
        <div className="lg:col-span-2 space-y-16">
          {/* Sección de Noticias */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Noticias Destacadas</h2>
            <div className="space-y-12">
              {noticias.map((noticia, index) => (
                <div key={noticia.ID} className="group">
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
          </section>

          {/* Sección de Eventos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Eventos Recientes</h2>
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
                          {evento.fecha ? new Date(evento.fecha).toLocaleString() : ""}
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
