"use client";

import { Proyecto } from "@/types/proyecto";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { getMediaUrl } from "@/lib/media";

interface ProjectCardProps {
  projects: Proyecto[];
  loading: boolean;
  onEdit: (project: Proyecto) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({ projects, loading, onEdit, onDelete }: ProjectCardProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Cargando proyectos...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">No se encontraron proyectos</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.ID} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{project.nombre}</CardTitle>
            <Badge 
              variant={
                project.estado === 'completado' ? 'default' :
                project.estado === 'en_progreso' ? 'default' :
                project.estado === 'cancelado' ? 'destructive' : 'secondary'
              }
              className="self-start mt-2"
            >
              {project.estado}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {formatDate(project.fecha_inicio)} - {formatDate(project.fecha_fin)}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            {project.imagen && (
              <img
                src={
                  typeof project.imagen === "string"
                    ? getMediaUrl("proyectos", project.imagen)
                    : URL.createObjectURL(project.imagen)
                }
                alt={project.nombre}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <p className="text-sm line-clamp-3">{project.descripcion}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(project.ID)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}