"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from "./componentes/DeleteConfirmationDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Save, Search, Trash2 } from "lucide-react";
import { 
  MetodologiaPrueba, 
  TipoMetodologiaPrueba,
  MetodologiaCaracteristica 
} from "@/types";
import { 
  fetchMetodologiasPruebas,
  addMetodologiaPrueba,
  updateMetodologiaPrueba,
  deleteMetodologiaPrueba,
  addCaracteristica,
  deleteCaracteristica,
  fetchCaracteristicasByMetodologia, 
  checkBackendConnection
} from "@/services";
import { useToast } from "@/components/hooks/use-toast";
import { API_URL } from "@/constants/Api";

const MAX_IMAGEN_BYTES = 5 * 1024 * 1024; // 5MB

export default function PruebasMetodologiaPage() {
  const { toast } = useToast();
  //eliminar rsto cuando el crud este listo
  const [metodologiasPruebas, setMetodologiasPruebas] = useState<MetodologiaPrueba[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<TipoMetodologiaPrueba | "todos">("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MetodologiaPrueba | null>(null);
  const [caracteristicas, setCaracteristicas] = useState<MetodologiaCaracteristica[]>([]);
  const [newCaracteristica, setNewCaracteristica] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metodologiaPruebaToDelete, setmetodologiaPruebaToDelete] = useState<number | null>(null);
  const [tempCaracteristicas, setTempCaracteristicas] = useState<string[]>([]);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const clearImagenSelection = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImagenFile(null);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Archivo inválido",
        description: "La imagen debe ser un archivo de imagen (PNG, JPG, WEBP…).",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGEN_BYTES) {
      toast({
        title: "Archivo muy pesado",
        description: "La imagen no debe superar los 5MB.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setImagenFile(file);
  };


  // Cargar metodologías/pruebas
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchMetodologiasPruebas(search, filterTipo);
        setMetodologiasPruebas(data);
      } catch (error) {
         toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error desconocido",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [search, filterTipo]);

  // Cargar características cuando se selecciona un ítem
  useEffect(() => {
    if (currentItem?.ID) {
      const loadCaracteristicas = async () => {
        try {
          const data = await fetchCaracteristicasByMetodologia(currentItem.ID);
          setCaracteristicas(data);
        } catch (error) {
           toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Error desconocido",
            variant: "destructive",
          });
        }
      };
      loadCaracteristicas();
    }
  }, [currentItem]);

  const handleSave = async (item: MetodologiaPrueba) => {
    const payload = {
      nombre: item.nombre?.trim() ?? "",
      descripcion: item.descripcion ?? "",
      tipo: item.tipo ?? "metodologia",
    };
    if (!payload.nombre) {
      toast({
        title: "Campo requerido",
        description: "El nombre es obligatorio.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (currentItem?.ID) {
        await updateMetodologiaPrueba(currentItem.ID, payload, imagenFile ?? undefined);
        toast({ title: "Metodología/Prueba actualizada correctamente" });
      } else {
        await addMetodologiaPrueba(payload, imagenFile ?? undefined);
        toast({ title: "Metodología/Prueba creada correctamente" });
      }
      clearImagenSelection();
      setIsDialogOpen(false);
      setCurrentItem(null);
      // Recargar datos
      const data = await fetchMetodologiasPruebas(search, filterTipo);
      setMetodologiasPruebas(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleAddCaracteristica = async () => {
    if (!currentItem?.ID || !newCaracteristica) return;
    
    try {
      await addCaracteristica({
        ID_metodologia: currentItem.ID,
        caracteristica: newCaracteristica
      });
      setNewCaracteristica("");
      // Recargar características
      const data = await fetchCaracteristicasByMetodologia(currentItem.ID);
      setCaracteristicas(data);
      toast({ title: "Característica añadida correctamente" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCaracteristica = async (id: number) => {
    try {
      await deleteCaracteristica(id);
      // Recargar características
      if (currentItem?.ID) {
        const data = await fetchCaracteristicasByMetodologia(currentItem.ID);
        setCaracteristicas(data);
      }
      toast({ title: "Característica eliminada correctamente" });
    } catch (error) {
       toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const getTipoBadge = (tipo: TipoMetodologiaPrueba) => {
    switch (tipo) {
      case "metodologia":
        return <Badge className="bg-green-500">Metodología</Badge>;
      case "prueba":
        return <Badge className="bg-blue-500">Prueba</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };
  // Cargar metodologias pruebas
  const loadMetodologiaPruebas = async () => {
  setLoading(true);
  setError(null);
  try {
    const isBackendUp = await checkBackendConnection();
    if (!isBackendUp) {
      throw new Error("El servidor backend no está disponible");
    }

    const data = await fetchMetodologiasPruebas(
      search, 
      filterTipo === "todos" ? undefined : filterTipo
    );
    setMetodologiasPruebas(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    setError(errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

// Cambia el useEffect:
useEffect(() => {
  loadMetodologiaPruebas();
}, [search, filterTipo]); 

  //Eliminar un registro
  const handleDeleteMetodologiaPrueba = async (id: number) => {
    try {
      await deleteMetodologiaPrueba(id);
      toast({ title: "Proyecto eliminado correctamente" });
      loadMetodologiaPruebas();
    } catch (error) {
       toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setmetodologiaPruebaToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setmetodologiaPruebaToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       {error && (
        <div className="bg-destructive/15 p-4 rounded-md border border-destructive">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={loadMetodologiaPruebas}
          >
            Reintentar
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Metodologías y Pruebas de Investigación</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => {
            clearImagenSelection();
            setCurrentItem(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>
       {/* Filtros */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar metodologías/pruebas..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filterTipo}
          onValueChange={(value) => setFilterTipo(value as TipoMetodologiaPrueba | "todos")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="metodologia">Metodologías</SelectItem>
            <SelectItem value="prueba">Pruebas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-10">Cargando...</div>
        ) : metodologiasPruebas.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No se encontraron metodologías/pruebas
          </div>
        ) : (
          metodologiasPruebas.map((item) => (
            <Card key={item.ID}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.nombre}</CardTitle>
                  {getTipoBadge(item.tipo)}
                </div>
              </CardHeader>
              <CardContent>
                {item.imagen && (
                  <img
                    src={`${API_URL}/uploads/${item.imagen}`}
                    alt={item.nombre}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <p className="text-sm text-muted-foreground">{item.descripcion}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearImagenSelection();
                    setCurrentItem(item);
                    setTempCaracteristicas([]);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => confirmDelete(item.ID)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
              </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Diálogo para editar/crear */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) clearImagenSelection();
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? "Editar Metodología/Prueba" : "Nueva Metodología/Prueba"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={currentItem?.nombre || ""}
                onChange={(e) => setCurrentItem({
                  ...(currentItem || {} as MetodologiaPrueba),
                  nombre: e.target.value
                })}
                placeholder="Nombre de la metodología/prueba"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={currentItem?.descripcion || ""}
                onChange={(e) => setCurrentItem({
                  ...(currentItem || {} as MetodologiaPrueba),
                  descripcion: e.target.value
                })}
                rows={4}
                placeholder="Descripción detallada"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={currentItem?.tipo || "metodologia"}
                onValueChange={(value) => setCurrentItem({
                  ...(currentItem || {} as MetodologiaPrueba),
                  tipo: value as TipoMetodologiaPrueba
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metodologia">Metodología</SelectItem>
                  <SelectItem value="prueba">Prueba</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imagen">Imagen</Label>
              <Input
                id="imagen"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
              />
              {(previewUrl || currentItem?.imagen) && (
                <img
                  src={previewUrl ?? `${API_URL}/uploads/${currentItem?.imagen}`}
                  alt="Preview"
                  className="h-40 object-contain rounded border"
                />
              )}
              <p className="text-xs text-muted-foreground">PNG, JPG o WEBP hasta 5MB.</p>
            </div>

            {/* Características (solo para edición) */}
            {currentItem?.ID && (
              <div className="grid gap-2">
              <Label>Características</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCaracteristica}
                    onChange={(e) => setNewCaracteristica(e.target.value)}
                    placeholder="Nueva característica"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (currentItem?.ID) {
                        handleAddCaracteristica();
                      } else if (newCaracteristica) {
                        setTempCaracteristicas([...tempCaracteristicas, newCaracteristica]);
                        setNewCaracteristica("");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {(currentItem?.ID ? caracteristicas : tempCaracteristicas).map((caract, idx) => (
                  <div
                    key={typeof caract === "string" ? idx : caract.ID}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span>{typeof caract === "string" ? caract : caract.caracteristica}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (currentItem?.ID) {
                          if (typeof caract !== "string" && caract.ID) {
                            handleDeleteCaracteristica(caract.ID);
                          }
                        } else {
                          setTempCaracteristicas(tempCaracteristicas.filter((_, i) => i !== idx));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => {
              if (currentItem) {
                handleSave(currentItem);
              }
            }}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => metodologiaPruebaToDelete && handleDeleteMetodologiaPrueba(metodologiaPruebaToDelete)}
      />
    </div>
  );
}