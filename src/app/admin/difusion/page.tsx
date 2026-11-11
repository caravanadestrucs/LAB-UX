"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Edit,
  ExternalLink,
  FileText,
  Plus,
  Search,
  Trash2,
  Video,
  Users,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster"
import { Evento, TipoEventoNoticia } from "@/types/eventoNoticia";
import {
  addAreaToEvento,
  removeAreaFromEvento,
  fetchEventosNoticias,
  addEventoNoticia,
  deleteEventoNoticia,
  fetchAsistentesEvento,
  updateEventoNoticia,
  addMaterialToEvento,
  removeMaterialFromEvento,
} from "@/services/eventoNoticia";
import { fetchAreasInvestigacion } from "@/services/areainvestigacion";
import { useToast } from "@/components/hooks/use-toast";
import { API_URL } from "@/constants/Api";

const EVENT_TYPES: { value: TipoEventoNoticia; label: string; badge: string }[] = [
  { value: "evento", label: "Evento", badge: "bg-blue-500" },
  { value: "noticia", label: "Noticia", badge: "bg-green-500" },
  { value: "proximo_evento", label: "Próximo Evento", badge: "bg-purple-500" },
];

const MATERIAL_TYPES = [
  { value: "presentation", label: "Presentación" },
  { value: "document", label: "Documento" },
  { value: "video", label: "Video" },
];

export default function EventosPasadosPage() {
  const { toast } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<TipoEventoNoticia | "todos">("todos");

  // Áreas de investigación
  const [areas, setAreas] = useState<{ ID: number; nombre: string }[]>([]);
  useEffect(() => {
    fetchAreasInvestigacion().then(setAreas).catch(() => setAreas([]));
  }, []);

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);

  // Form state
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    tipo: "evento" as TipoEventoNoticia,
    asistentes: [],
    areas_investigacion: [] as number[], // IDs seleccionados
    materiales: [] as { tipo: string; nombre: string; archivo?: File | null }[],
    imagen: null as File | null,
    attendees: 0,
    highlights: "",
  });

  // Estado para editar
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);
  const [editForm, setEditForm] = useState<typeof form>(form);

  // Estado para asistentes
  const [asistentesDialogOpen, setAsistentesDialogOpen] = useState(false);
  const [asistentes, setAsistentes] = useState<any[]>([]);
  const [eventoAsistentes, setEventoAsistentes] = useState<Evento | null>(null);

  // Estado para materiales en edición
  const [materialEditDraft, setMaterialEditDraft] = useState<{ tipo: string; nombre: string; archivo?: File | null }>({
    tipo: "",
    nombre: "",
    archivo: null,
  });
  const [editMaterialsLoading, setEditMaterialsLoading] = useState(false);

  // Cargar eventos
  const loadEventos = async () => {
    setLoading(true);
    try {
      const data = await fetchEventosNoticias(search, filterTipo);
      setEventos(data);
    } catch (e) {
      toast({ title: "Error", description: "No se pudieron cargar los eventos.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterTipo]);

  // Handlers para el formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imagen: e.target.files[0] });
    }
  };

  // Crear evento (solo datos principales)
  const handleAddEvento = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("fecha", form.fecha);
      formData.append("lugar", form.lugar);
      formData.append("tipo", form.tipo);
      formData.append("fecha_creacion", new Date().toISOString().slice(0, 19).replace("T", " "));
      formData.append("ID_usuario", "1"); // Cambia por el usuario real

      if (form.imagen) formData.append("imagen", form.imagen);

      // NO envíes áreas ni materiales aquí

      const nuevoEvento = await addEventoNoticia(formData as any);

      // Abre el modal de edición para agregar áreas y materiales
      setEventoToEdit(nuevoEvento);
      setEditForm({
        ...form,
        ...nuevoEvento,
        imagen: null,
        fecha: toDatetimeLocal(nuevoEvento.fecha),
        materiales: [],
        areas_investigacion: [],
      });
      setAddDialogOpen(false);
      setEditDialogOpen(true);
      toast({ title: "Evento creado", description: "Ahora agrega áreas y materiales.", variant: "success" });
      loadEventos();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo agregar el evento.", variant: "destructive" });
    }
  };

  // Eliminar evento
  const handleDeleteEvento = async () => {
    if (!eventoToDelete) return;
    try {
      await deleteEventoNoticia(eventoToDelete.ID!);
      setDeleteDialogOpen(false);
      setEventoToDelete(null);
      toast({ title: "Evento eliminado", description: "El evento fue eliminado correctamente.", variant: "success" });
      loadEventos();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo eliminar el evento.", variant: "destructive" });
    }
  };

  // Handler para abrir modal de editar
  const openEditDialog = (evento: Evento) => {
    setEventoToEdit(evento);
    setEditForm({
      ...form,
      ...evento,
      imagen: null,
      fecha: toDatetimeLocal(evento.fecha),
      materiales: evento.materiales?.map(m => ({ ...m, archivo: null })) || [],
      areas_investigacion: evento.areas_investigacion?.map((a: any) => a.ID_area || a.ID) || [],
    });
    setEditDialogOpen(true);
  };

  // Handler para editar evento (puedes dejarlo igual)
  const handleEditEvento = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventoToEdit) return;
    try {
      const formData = new FormData();
      formData.append("titulo", editForm.titulo);
      formData.append("descripcion", editForm.descripcion);
      formData.append("fecha", editForm.fecha);
      formData.append("lugar", editForm.lugar);
      formData.append("tipo", editForm.tipo);
      formData.append("fecha_actualizacion", new Date().toISOString().slice(0, 19).replace("T", " "));
      formData.append("ID_usuario", "1"); // Cambia por el usuario real

      if (editForm.imagen) formData.append("imagen", editForm.imagen);

      editForm.materiales.forEach((mat, idx) => {
        formData.append(`materiales[${idx}][tipo]`, mat.tipo);
        formData.append(`materiales[${idx}][nombre]`, mat.nombre);
        if (mat.archivo) formData.append(`materiales[${idx}][archivo]`, mat.archivo);
      });

      editForm.areas_investigacion.forEach((id, idx) => {
        formData.append(`areas_investigacion[${idx}]`, String(id));
      });

      await updateEventoNoticia(eventoToEdit.ID!, formData as any);
      setEditDialogOpen(false);
      setEventoToEdit(null);
      toast({ title: "Evento actualizado", description: "El evento fue actualizado correctamente.", variant: "success" });
      loadEventos();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo actualizar el evento.", variant: "destructive" });
    }
  };

  // Handler para ver asistentes
  const openAsistentesDialog = async (evento: Evento) => {
    setEventoAsistentes(evento);
    setAsistentes([]);
    setAsistentesDialogOpen(true);
    try {
      const data = await fetchAsistentesEvento(evento.ID!);
      setAsistentes(data);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudieron cargar los asistentes.", variant: "destructive" });
    }
  };

  // Agregar material a evento existente
  const handleAddMaterialToEvento = async () => {
    if (!eventoToEdit || !materialEditDraft.tipo || !materialEditDraft.nombre || !materialEditDraft.archivo) return;
    setEditMaterialsLoading(true);
    try {
      const formData = new FormData();
      formData.append("tipo", materialEditDraft.tipo);
      formData.append("nombre", materialEditDraft.nombre);
      formData.append("archivo", materialEditDraft.archivo);
      await addMaterialToEvento(eventoToEdit.ID!, formData);
      toast({ title: "Material agregado", description: "El material fue agregado correctamente.", variant: "success" });
      loadEventos();
      setMaterialEditDraft({ tipo: "", nombre: "", archivo: null });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo agregar el material.", variant: "destructive" });
    }
    setEditMaterialsLoading(false);
  };

  // Eliminar material de evento existente
  const handleRemoveMaterialFromEvento = async (materialId: number) => {
    if (!eventoToEdit) return;
    setEditMaterialsLoading(true);
    try {
      await removeMaterialFromEvento(eventoToEdit.ID!, materialId);
      toast({ title: "Material eliminado", description: "El material fue eliminado correctamente.", variant: "success" });
      loadEventos();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo eliminar el material.", variant: "destructive" });
    }
    setEditMaterialsLoading(false);
  };

  // Función para convertir fecha a formato datetime-local
  function toDatetimeLocal(dateString: string) {
    if (!dateString) return "";
    // Si ya está en formato ISO local, solo corta los segundos y la Z
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateString)) return dateString.slice(0, 16);
    // Si viene como "YYYY-MM-DD HH:mm:ss"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
      const [date, time] = dateString.split(" ");
      return `${date}T${time.slice(0, 5)}`;
    }
    // Si viene como RFC 1123 (ej: "Fri, 18 Jul 2025 10:04:00 GMT")
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      // Ajusta a hora local del navegador
      const pad = (n: number) => n.toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    }
    return "";
  }

  // UI helpers
  const getTypeBadge = (type: TipoEventoNoticia) => {
    const found = EVENT_TYPES.find((t) => t.value === type);
    return <Badge className={found?.badge}>{found?.label || type}</Badge>;
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "presentation":
        return <FileText className="h-4 w-4 mr-2" />;
      case "document":
        return <FileText className="h-4 w-4 mr-2" />;
      case "video":
        return <Video className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Eventos y Noticias</h2>
        <div className="flex items-center space-x-2">
          {/* Dialog para agregar evento */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Evento/Noticia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Añadir Evento o Noticia</DialogTitle>
                <DialogDescription>
                  Complete la información para añadir un evento o noticia.
                </DialogDescription>
              </DialogHeader>
              <form className="grid gap-4 py-4" onSubmit={handleAddEvento}>
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" value={form.titulo} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea id="descripcion" value={form.descripcion} onChange={handleInputChange} rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="datetime-local"
                      value={form.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={form.tipo} onValueChange={(v) => handleSelectChange(v, "tipo")}>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lugar">Lugar</Label>
                  <Input id="lugar" value={form.lugar} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imagen">Imagen</Label>
                  <Input id="imagen" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <DialogFooter>
                  <Button type="submit">Añadir Evento</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos/noticias..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterTipo} onValueChange={v => setFilterTipo(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAsistentesDialog(event)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Asistentes
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => { setEventoToDelete(event); setDeleteDialogOpen(true); }}>
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
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => { setEventoToDelete(event); setDeleteDialogOpen(true); }}
                        >
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

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar evento?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvento}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar evento */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Evento o Noticia</DialogTitle>
            <DialogDescription>
              Modifica la información del evento o noticia, agrega áreas y materiales.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleEditEvento}>
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={editForm.titulo} onChange={e => setEditForm({ ...editForm, titulo: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" value={editForm.descripcion} onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })} rows={3} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="datetime-local"
                  value={editForm.fecha}
                  onChange={e => setEditForm({ ...editForm, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={editForm.tipo} onValueChange={(v) => setEditForm({ ...editForm, tipo: v as TipoEventoNoticia })}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input id="lugar" value={editForm.lugar} onChange={e => setEditForm({ ...editForm, lugar: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imagen">Imagen</Label>
              <Input id="imagen" type="file" accept="image/*" onChange={e => setEditForm({ ...editForm, imagen: e.target.files?.[0] || null })} />
            </div>
            {/* Áreas de investigación checklist SOLO aquí */}
            <div className="grid gap-2">
              <Label>Áreas de Investigación</Label>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => {
                  const checked = editForm.areas_investigacion.includes(area.ID);
                  return (
                    <label key={area.ID} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={async () => {
                          try {
                            if (!eventoToEdit) return;
                            if (checked) {
                              // Eliminar área
                              await removeAreaFromEvento(eventoToEdit.ID, area.ID);
                              setEditForm((prev) => ({
                                ...prev,
                                areas_investigacion: prev.areas_investigacion.filter((a) => a !== area.ID),
                              }));
                            } else {
                              // Agregar área
                              await addAreaToEvento({ ID_evento: eventoToEdit.ID, ID_area: area.ID });
                              setEditForm((prev) => ({
                                ...prev,
                                areas_investigacion: [...prev.areas_investigacion, area.ID],
                              }));
                            }
                            toast({
                              title: "Áreas actualizadas",
                              description: checked
                                ? "Área eliminada correctamente."
                                : "Área agregada correctamente.",
                              variant: "success",
                            });
                          } catch (e: any) {
                            toast({
                              title: "Error",
                              description: e.message || "No se pudo actualizar el área.",
                              variant: "destructive",
                            });
                          }
                        }}
                      />
                      {area.nombre}
                    </label>
                  );
                })}
              </div>
            </div>
            {/* Materiales edición */}
            <div className="grid gap-2">
              <Label>Materiales del Evento</Label>
              <div className="border rounded-md p-4 space-y-4">
                {/* Formulario para agregar material */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-material-tipo">Tipo</Label>
                    <select
                      name="tipo"
                      value={materialEditDraft.tipo}
                      onChange={e => setMaterialEditDraft({ ...materialEditDraft, tipo: e.target.value })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Tipo</option>
                      {MATERIAL_TYPES.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-material-nombre">Nombre</Label>
                    <Input
                      name="nombre"
                      value={materialEditDraft.nombre}
                      onChange={e => setMaterialEditDraft({ ...materialEditDraft, nombre: e.target.value })}
                      placeholder="Nombre del material"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-material-archivo">Archivo</Label>
                    <Input
                      name="archivo"
                      type="file"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setMaterialEditDraft({ ...materialEditDraft, archivo: e.target.files[0] });
                        }
                      }}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddMaterialToEvento}
                  disabled={editMaterialsLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Material
                </Button>
                {/* Lista de materiales añadidos */}
                {eventoToEdit?.materiales?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {eventoToEdit.materiales.map((mat, idx) => (
                      <li key={mat.ID || idx} className="flex items-center justify-between border rounded px-2 py-1">
                        <span>
                          {getMaterialIcon(mat.tipo)} {mat.nombre}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveMaterialFromEvento(mat.ID!)}
                          disabled={editMaterialsLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Actualizar Evento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver asistentes */}
      <Dialog open={asistentesDialogOpen} onOpenChange={setAsistentesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asistentes del Evento</DialogTitle>
            <DialogDescription>
              Lista de asistentes para "{eventoAsistentes?.titulo}"
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto">
            {asistentes.length === 0 ? (
              <p className="text-muted-foreground">No hay asistentes registrados.</p>
            ) : (
              <ul className="space-y-2">
                {asistentes.map((asistente, idx) => (
                  <li key={idx} className="border rounded px-2 py-1">
                    {asistente.nombre_externo || asistente.nombre || asistente.email_externo || asistente.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAsistentesDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
    
  );
}

