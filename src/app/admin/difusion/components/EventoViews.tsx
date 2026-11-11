"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Edit, ExternalLink, FileText, Trash2, Users, Video } from "lucide-react";
import { Evento } from "@/types/eventoNoticia";
import { API_URL } from "@/constants/Api";
import { EVENT_TYPES } from "./utils";

type Props = {
  eventos: Evento[];
  onEdit: (e: Evento) => void;
  onDelete: (e: Evento) => void;
  onAsistentes: (e: Evento) => void;
};

function getTypeBadge(type: string) {
  const found = EVENT_TYPES.find((t) => t.value === type);
  return <Badge className={found?.badge}>{found?.label || type}</Badge>;
}

function getMaterialIcon(type: string) {
  if (type === "video") return <Video className="h-4 w-4 mr-2" />;
  return <FileText className="h-4 w-4 mr-2" />;
}

export function EventoViews({ eventos, onEdit, onDelete, onAsistentes }: Props) {
  return (
    <Tabs defaultValue="grid" className="space-y-4">
      <TabsList>
        <TabsTrigger value="grid">Vista de Tarjetas</TabsTrigger>
        <TabsTrigger value="list">Vista de Lista</TabsTrigger>
      </TabsList>

      <TabsContent value="grid" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((event) => (
            <Card key={event.ID} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={event.imagen ? `${API_URL}/uploads/eventos/${event.imagen}` : "/placeholder.svg"}
                  alt={event.titulo}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.titulo}</CardTitle>
                  {getTypeBadge(event.tipo)}
                </div>
                <CardDescription>{event.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.fecha}</span>
                  </div>
                  <div>
                    <span className="font-medium">Lugar:</span> {event.lugar}
                  </div>
                  <div>
                    <span className="font-medium">Materiales:</span>
                    <ul className="mt-1 space-y-1">
                      {event.materiales?.map((material, index) => (
                        <li key={index} className="flex items-center">
                          {getMaterialIcon(material.tipo)}
                          <a
                            href={material.archivo ? `${API_URL}/uploads/materiales_evento/${material.archivo}` : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            {material.nombre}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  {event.tipo !== "noticia" && (
                    <Button variant="outline" size="sm" onClick={() => onAsistentes(event)}>
                      <Users className="mr-2 h-4 w-4" />
                      Asistentes
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => onEdit(event)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={() => onDelete(event)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="list">
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Evento</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Tipo</th>
                  <th className="text-left p-4">Lugar</th>
                  <th className="text-left p-4">Materiales</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((event) => (
                  <tr key={event.ID} className="border-b">
                    <td className="p-4">
                      <div className="font-medium">{event.titulo}</div>
                      <div className="text-sm text-muted-foreground">{event.descripcion.substring(0, 60)}...</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.fecha}</span>
                      </div>
                    </td>
                    <td className="p-4">{getTypeBadge(event.tipo)}</td>
                    <td className="p-4">{event.lugar}</td>
                    <td className="p-4">
                      <div className="flex space-x-1">
                        {event.materiales?.map((material, index) => (
                          <a
                            key={index}
                            href={material.archivo ? `/uploads/materiales_evento/${material.archivo}` : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={material.nombre}
                            className="p-1 rounded-md hover:bg-muted"
                          >
                            {getMaterialIcon(material.tipo)}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="destructive" size="icon" onClick={() => onDelete(event)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
