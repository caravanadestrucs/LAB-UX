"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Save, Trash2, Pencil } from "lucide-react"
import { ContenidoSitio } from "@/types/contenidoSitio"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { fetchContenidos, addContenido, updateContenido, deleteContenido } from "@/services/contenido"
import { useToast } from "@/components/hooks/use-toast"
import { API_URL } from "@/constants/Api"
import { Toaster } from "@/components/ui/toaster"

function getMySQLDateTimeString(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default function InicioPage() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<ContenidoSitio[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null)
  const [editBannerId, setEditBannerId] = useState<number | null>(null)
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [bannerForm, setBannerForm] = useState<Omit<ContenidoSitio, "ID">>({
    tipo: "banner",
    titulo: "",
    texto: "",
    imagen: "",
    link_redireccion: "",
    estado: "inactivo",
    orden: 1,
    fecha_creacion: "",
    fecha_actualizacion: "",
  })

  // Cargar banners desde el backend
  const loadBanners = async () => {
    setLoading(true)
    try {
      const data = await fetchContenidos({ tipo: "banner" })
      setBanners(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudieron cargar los banners",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Eliminar banner
  const handleDeleteBanner = (id: number) => {
    setBannerToDelete(id)
    setConfirmDialogOpen(true)
  }
  const confirmDelete = async () => {
    if (bannerToDelete) {
      try {
        await deleteContenido(bannerToDelete)
        toast({ title: "Banner eliminado correctamente", variant: "success" })
        await loadBanners()
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || error?.error || "No se pudo eliminar el banner",
          variant: "destructive",
        })
      }
      setConfirmDialogOpen(false)
      setBannerToDelete(null)
    }
  }

  // Abrir modal para agregar o editar
  const openAddDialog = () => {
    setEditBannerId(null)
    setBannerForm({
      tipo: "banner",
      titulo: "",
      texto: "",
      imagen: "",
      link_redireccion: "",
      estado: "inactivo",
      orden: 1,
      fecha_creacion: "",
      fecha_actualizacion: "",
    })
    setBannerImage(null)
    setAddEditDialogOpen(true)
  }
  const openEditDialog = (banner: ContenidoSitio) => {
    setEditBannerId(banner.ID)
    setBannerForm({
      tipo: banner.tipo,
      titulo: banner.titulo,
      texto: banner.texto,
      imagen: banner.imagen,
      link_redireccion: banner.link_redireccion,
      estado: banner.estado,
      orden: banner.orden,
      fecha_creacion: banner.fecha_creacion || "",
      fecha_actualizacion: banner.fecha_actualizacion || "",
    })
    setBannerImage(null)
    setAddEditDialogOpen(true)
  }

  // Guardar (agregar o actualizar)
  const handleSaveBanner = async () => {
    try {
      const now = getMySQLDateTimeString(new Date());
      const formToSend = {
        ...bannerForm,
        tipo: "banner" as ContenidoSitio["tipo"],
        fecha_creacion: bannerForm.fecha_creacion
          ? getMySQLDateTimeString(new Date(bannerForm.fecha_creacion))
          : now,
        fecha_actualizacion: now,
      };

      if (editBannerId) {
        await updateContenido(editBannerId, formToSend, bannerImage || undefined)
        toast({ title: "Banner actualizado correctamente", variant: "success" })
      } else {
        await addContenido(formToSend, bannerImage || undefined)
        toast({ title: "Banner añadido correctamente", variant: "success" })
      }
      setAddEditDialogOpen(false)
      setBannerForm({
        tipo: "banner",
        titulo: "",
        texto: "",
        imagen: "",
        link_redireccion: "",
        estado: "inactivo",
        orden: 1,
        fecha_creacion: "",
        fecha_actualizacion: "",
      })
      setBannerImage(null)
      setEditBannerId(null)
      await loadBanners()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudo guardar el banner",
        variant: "destructive",
      })
    }
  }

  // Cambiar estado activo/inactivo
  const handleToggleEstado = async (banner: ContenidoSitio) => {
    try {
      const nuevoEstado = banner.estado === "activo" ? "inactivo" : "activo"
      await updateContenido(banner.ID, { estado: nuevoEstado })
      toast({ title: `Banner marcado como ${nuevoEstado}`, variant: "default" })
      await loadBanners()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudo cambiar el estado",
        variant: "destructive",
      })
    }
  }

  // Para el input de imagen en el modal
  const handleBannerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setBannerImage(file)
  }

  return (
     
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Contenido - Inicio</h2>
        <div className="flex justify-end">
          <Button className="w-full md:w-auto" onClick={openAddDialog}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Añadir Banner
          </Button>
        </div>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banners
              .filter(banner => banner.ID !== undefined && banner.ID !== null)
              .map((banner) => (
                <Card key={banner.ID}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{banner.titulo}</CardTitle>
                    <CardDescription>Estado: {banner.estado === 'activo' ? "Activo" : "Inactivo"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video relative overflow-hidden rounded-md border">
                      <img
                        src={banner.imagen ? `${API_URL}/uploads/contenido/${banner.imagen}` : "/placeholder.svg"}
                        alt={banner.titulo}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input value={banner.titulo} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Enlace</Label>
                      <Input value={banner.link_redireccion || ""} disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={banner.estado === 'activo'}
                          onChange={() => handleToggleEstado(banner)}
                          className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                        />
                        <Label>Activo</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteBanner(banner.ID)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para agregar/editar banner */}
      <Dialog open={addEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editBannerId ? "Editar Banner" : "Añadir Nuevo Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={bannerForm.titulo}
                onChange={e => setBannerForm({ ...bannerForm, titulo: e.target.value })}
              />
            </div>
            <div>
              <Label>Texto</Label>
              <Textarea
                value={bannerForm.texto || ""}
                onChange={e => setBannerForm({ ...bannerForm, texto: e.target.value })}
              />
            </div>
            <div>
              <Label>Enlace</Label>
              <Input
                value={bannerForm.link_redireccion || ""}
                onChange={e => setBannerForm({ ...bannerForm, link_redireccion: e.target.value })}
              />
            </div>
            <div>
              <Label>Imagen</Label>
              <Input type="file" accept="image/*" onChange={handleBannerImage} />
              {editBannerId && bannerForm.imagen && (
                <img src={bannerForm.imagen} alt="Actual" className="mt-2 h-24 rounded" />
              )}
            </div>
            <div>
              <Label>Orden</Label>
              <Input
                type="number"
                value={bannerForm.orden || 1}
                onChange={e => setBannerForm({ ...bannerForm, orden: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <select
                value={bannerForm.estado}
                onChange={e => setBannerForm({ ...bannerForm, estado: e.target.value as "activo" | "inactivo" })}
                className="border rounded px-2 py-1"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            {/* Campos ocultos */}
            <input type="hidden" name="tipo" value="banner" />
            <input type="hidden" name="fecha_creacion" value={bannerForm.fecha_creacion || ""} />
            <input type="hidden" name="fecha_actualizacion" value={bannerForm.fecha_actualizacion || ""} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveBanner}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminar */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro que deseas eliminar este banner? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster /> {/* Necesario para mostrar los toast */}
    </div>
  )
}