"use client";

import { Proyecto, EstadoProyecto } from "@/types/proyecto";
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent } from "react";
import { API_URL } from "@/constants/Api";

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Proyecto | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProjectForm({ open, onOpenChange, project, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    nombre: project?.nombre || "",
    tipo_estudio: project?.tipo_estudio || "",
    descripcion: project?.descripcion || "",
    estado: project?.estado || "planificacion",
    fecha_inicio: project?.fecha_inicio?.toString().split('T')[0] || "",
    fecha_fin: project?.fecha_fin?.toString().split('T')[0] || "",
    progreso: project?.progreso?.toString() || "0",
    investigadores: project?.proyecto_colaboradores?.map(c => c.nombre_externo).join(", ") || ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.imagen ? `${API_URL}/uploads/${project.imagen}` : null
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    
    // Agregar campos básicos
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataObj.append(key, value);
      }
    });

    // Agregar imagen si hay una nueva
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formDataObj.append('imagen', fileInput.files[0]);
    } else if (imagePreview && !imagePreview.includes(API_URL)) {
      // Si hay una imagen previa pero no es de la API (es una nueva)
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      formDataObj.append('imagen', blob, 'imagen-proyecto.png');
    }

    await onSubmit(formDataObj);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del Proyecto</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo_estudio">Tipo de Estudio</Label>
                <Input
                  id="tipo_estudio"
                  name="tipo_estudio"
                  value={formData.tipo_estudio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleSelectChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planificacion">Planificación</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                <Input
                  id="fecha_inicio"
                  name="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fecha_fin">Fecha Fin</Label>
                <Input
                  id="fecha_fin"
                  name="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progreso">Progreso (%)</Label>
              <Input
                id="progreso"
                name="progreso"
                type="number"
                min="0"
                max="100"
                value={formData.progreso}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investigadores">Investigadores</Label>
              <Input
                id="investigadores"
                name="investigadores"
                value={formData.investigadores}
                onChange={handleChange}
                placeholder="Nombres de investigadores separados por comas"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imagen">Imagen del Proyecto</Label>
              <Input
                id="imagen"
                name="imagen"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Vista previa:</p>
                  <img 
                    src={imagePreview} 
                    alt="Vista previa de la imagen" 
                    className="h-40 object-contain rounded border"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {project ? "Actualizar Proyecto" : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}