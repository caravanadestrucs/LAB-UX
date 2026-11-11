"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, Save, Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ContenidoSitio, Valor } from "@/types/contenidoSitio"
import { fetchContenidos, addContenido, updateContenido, deleteContenido } from "@/services/contenido"
import { useToast } from "@/components/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { API_URL } from "@/constants/Api"  

function getMySQLDateTimeString(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default function MisionVisionPage() {
  const { toast } = useToast()
  const [mision, setMision] = useState<ContenidoSitio | null>(null)
  const [vision, setVision] = useState<ContenidoSitio | null>(null)
  const [valores, setValores] = useState<Valor[]>([])
  const [loading, setLoading] = useState(false)

  // Imagenes tipo archivo para misión y visión
  const [misionFile, setMisionFile] = useState<File | null>(null)
  const [visionFile, setVisionFile] = useState<File | null>(null)
  const misionFileInputRef = useRef<HTMLInputElement>(null)
  const visionFileInputRef = useRef<HTMLInputElement>(null)

  // Dialogos y formularios para valores
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [valorEdit, setValorEdit] = useState<Valor | null>(null)
  const [editValorFile, setEditValorFile] = useState<File | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [valorToDelete, setValorToDelete] = useState<number | null>(null)
  const [newValorDialogOpen, setNewValorDialogOpen] = useState(false)
  const [newValor, setNewValor] = useState<Valor>({
    ID: Date.now(),
    tipo: "valores",
    titulo: "",
    texto: "",
    imagen: "",
    estado: "activo",
    orden: 1,
    fecha_creacion: "",
    fecha_actualizacion: "",
  })
  const [newValorFile, setNewValorFile] = useState<File | null>(null)
  const newValorIconInputRef = useRef<HTMLInputElement>(null)
  const editValorIconInputRef = useRef<HTMLInputElement>(null)

  // Cargar datos desde el backend
  const loadData = async () => {
    setLoading(true)
    try {
      const [misionArr, visionArr, valoresArr] = await Promise.all([
        fetchContenidos({ tipo: "mision" }),
        fetchContenidos({ tipo: "vision" }),
        fetchContenidos({ tipo: "valores" }),
      ])
      setMision(misionArr[0] || null)
      setVision(visionArr[0] || null)
      setValores(valoresArr as Valor[])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handlers para imagen de misión y visión
  const handleMisionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && mision) {
      setMisionFile(file)
      setMision({ ...mision, imagen: URL.createObjectURL(file) })
    }
  }
  const handleVisionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && vision) {
      setVisionFile(file)
      setVision({ ...vision, imagen: URL.createObjectURL(file) })
    }
  }

  // Guardar misión
  const handleSaveMision = async () => {
    if (!mision) return
    try {
      const now = getMySQLDateTimeString(new Date())
      const formToSend = {
        ...mision,
        tipo: "mision",
        fecha_creacion: mision.fecha_creacion
          ? getMySQLDateTimeString(new Date(mision.fecha_creacion))
          : now,
        fecha_actualizacion: now,
      }
      if (mision.ID) {
        await updateContenido(mision.ID, formToSend, misionFile || undefined)
        toast({ title: "Misión actualizada correctamente", variant: "success" })
      } else {
        await addContenido(formToSend, misionFile || undefined)
        toast({ title: "Misión guardada correctamente", variant: "success" })
      }
      setMisionFile(null)
      await loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudo guardar la misión",
        variant: "destructive",
      })
    }
  }

  // Guardar visión
  const handleSaveVision = async () => {
    if (!vision) return
    try {
      const now = getMySQLDateTimeString(new Date())
      const formToSend = {
        ...vision,
        tipo: "vision",
        fecha_creacion: vision.fecha_creacion
          ? getMySQLDateTimeString(new Date(vision.fecha_creacion))
          : now,
        fecha_actualizacion: now,
      }
      if (vision.ID) {
        await updateContenido(vision.ID, formToSend, visionFile || undefined)
        toast({ title: "Visión actualizada correctamente", variant: "success" })
      } else {
        await addContenido(formToSend, visionFile || undefined)
        toast({ title: "Visión guardada correctamente", variant: "success" })
      }
      setVisionFile(null)
      await loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudo guardar la visión",
        variant: "destructive",
      })
    }
  }

  // Imagen handlers para valores (archivos)
  const handleNewValorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewValorFile(file)
      setNewValor((prev) => ({
        ...prev,
        imagen: URL.createObjectURL(file), // solo para previsualización
      }))
    }
  }
  const handleEditValorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && valorEdit) {
      setEditValorFile(file)
      setValorEdit({
        ...valorEdit,
        imagen: URL.createObjectURL(file), // solo para previsualización
      })
    }
  }

  // Guardar nuevo valor (igual que banners)
  const handleSaveNewValor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const now = getMySQLDateTimeString(new Date())
      const formToSend = {
        ...newValor,
        tipo: "valores",
        fecha_creacion: getMySQLDateTimeString(new Date()),
        fecha_actualizacion: getMySQLDateTimeString(new Date()),
      }
      await addContenido(formToSend, newValorFile || undefined)
      await loadData()
      setNewValorDialogOpen(false)
      setNewValorFile(null)
      toast({ title: "Valor añadido correctamente", variant: "success" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || error?.error || "No se pudo agregar el valor",
        variant: "destructive",
      })
    }
  }

  // Guardar edición de valor (igual que banners)
  const handleSaveEditedValor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (valorEdit) {
      try {
        const now = getMySQLDateTimeString(new Date())
        const formToSend = {
          ...valorEdit,
          tipo: "valores",
          fecha_creacion: valorEdit.fecha_creacion
          ? getMySQLDateTimeString(new Date(valorEdit.fecha_creacion))
          : now,
          fecha_actualizacion: now,
        }
        await updateContenido(valorEdit.ID, formToSend, editValorFile || undefined)
        await loadData()
        setEditDialogOpen(false)
        setEditValorFile(null)
        toast({ title: "Valor actualizado correctamente", variant: "success" })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || error?.error || "No se pudo actualizar el valor",
          variant: "destructive",
        })
      }
    }
  }

  // Eliminar valor
  const handleDeleteValor = (id: number) => {
    setValorToDelete(id)
    setConfirmDialogOpen(true)
  }
  const confirmDelete = async () => {
    if (valorToDelete) {
      try {
        await deleteContenido(valorToDelete)
        await loadData()
        toast({ title: "Valor eliminado correctamente", variant: "success" })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || error?.error || "No se pudo eliminar el valor",
          variant: "destructive",
        })
      }
      setConfirmDialogOpen(false)
      setValorToDelete(null)
    }
  }

  // Editar valor
  const handleEditValor = (valor: Valor) => {
    setValorEdit(valor)
    setEditDialogOpen(true)
    setEditValorFile(null)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Misión y Visión</h2>
      </div>

      {/* Misión */}
      <Card>
        <CardHeader>
          <CardTitle>Misión</CardTitle>
          <CardDescription>Define el propósito principal del laboratorio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mision-title">Título de la Misión</Label>
            <Input
              id="mision-title"
              value={mision?.titulo || ""}
              onChange={e => setMision(mision ? { ...mision, titulo: e.target.value } : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mision-text">Texto de la Misión</Label>
            <Textarea
              id="mision-text"
              rows={6}
              value={mision?.texto || ""}
              onChange={e => setMision(mision ? { ...mision, texto: e.target.value } : null)}
            />
          </div>
          <div className="space-y-2">
            <Label>Imagen de la Misión (opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 rounded-md border flex items-center justify-center bg-muted">
                {mision?.imagen && <img src={mision.imagen.startsWith("blob:") ? mision.imagen : `${API_URL}/uploads/contenido/${mision.imagen}`} alt="Misión" className="max-h-full max-w-full" />}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={misionFileInputRef}
                style={{ display: "none" }}
                onChange={handleMisionImageChange}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => misionFileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Cambiar Imagen
              </Button>
            </div>
          </div>
          <Button onClick={handleSaveMision}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Misión
          </Button>
        </CardContent>
      </Card>

      {/* Visión */}
      <Card>
        <CardHeader>
          <CardTitle>Visión</CardTitle>
          <CardDescription>Define hacia dónde se dirige el laboratorio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vision-title">Título de la Visión</Label>
            <Input
              id="vision-title"
              value={vision?.titulo || ""}
              onChange={e => setVision(vision ? { ...vision, titulo: e.target.value } : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision-text">Texto de la Visión</Label>
            <Textarea
              id="vision-text"
              rows={6}
              value={vision?.texto || ""}
              onChange={e => setVision(vision ? { ...vision, texto: e.target.value } : null)}
            />
          </div>
          <div className="space-y-2">
            <Label>Imagen de la Visión (opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 rounded-md border flex items-center justify-center bg-muted">
                {vision?.imagen && <img src={vision.imagen.startsWith("blob:") ? vision.imagen : `${API_URL}/uploads/contenido/${vision.imagen}`} alt="Visión" className="max-h-full max-w-full" />}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={visionFileInputRef}
                style={{ display: "none" }}
                onChange={handleVisionImageChange}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => visionFileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Cambiar Imagen
              </Button>
            </div>
          </div>
          <Button onClick={handleSaveVision}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Visión
          </Button>
        </CardContent>
      </Card>

      {/* Valores */}
      <Card>
        <CardHeader>
          <CardTitle>Valores</CardTitle>
          <CardDescription>Define los valores fundamentales del laboratorio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Lista de Valores</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewValor({
                  ID: Date.now(),
                  tipo: "valores",
                  titulo: "",
                  texto: "",
                  imagen: "",
                  estado: "activo",
                  orden: 1,
                  fecha_creacion: "",
                  fecha_actualizacion: "",
                })
                setNewValorDialogOpen(true)
                setNewValorFile(null)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir Valor
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {valores.map((valor) => (
              <Card key={valor.ID} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md border overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                      {valor?.imagen && <img src={valor.imagen.startsWith("blob:") ? valor.imagen : `${API_URL}/uploads/contenido/${valor.imagen}`} alt={valor.titulo} className="max-h-full max-w-full" />}
                      
                    </div>
                    <div className="flex-1 min-w-0 ">
                      <Input value={valor.titulo} disabled className="text-sm font-medium " />
                    </div>
                  </div>
                  <Textarea value={valor.texto} disabled rows={2} className="text-xs resize-none" />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-xs"
                      type="button"
                      onClick={() => handleEditValor(valor)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteValor(valor.ID)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editar Valor */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Valor</DialogTitle>
          </DialogHeader>
          {valorEdit && (
            <form onSubmit={handleSaveEditedValor} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={valorEdit.titulo}
                  onChange={e => setValorEdit({ ...valorEdit, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={valorEdit.texto}
                  onChange={e => setValorEdit({ ...valorEdit, texto: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Icono (imagen)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    ref={editValorIconInputRef}
                    style={{ display: "none" }}
                    onChange={handleEditValorFileChange}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => editValorIconInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Seleccionar Imagen
                  </Button>
                  {valorEdit.imagen && (
                    <img src={valorEdit.imagen.startsWith("blob:") ? valorEdit.imagen : `/uploads/valores/${valorEdit.imagen}`} alt="Icono" className="h-12 w-12 rounded-md border" />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Eliminar Valor */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro que deseas eliminar este valor? Esta acción no se puede deshacer.</p>
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

      {/* Nuevo Valor */}
      <Dialog open={newValorDialogOpen} onOpenChange={setNewValorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Valor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveNewValor} className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={newValor.titulo}
                onChange={e => setNewValor({ ...newValor, titulo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={newValor.texto}
                onChange={e => setNewValor({ ...newValor, texto: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Icono (imagen)</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={newValorIconInputRef}
                  style={{ display: "none" }}
                  onChange={handleNewValorFileChange}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => newValorIconInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Seleccionar Imagen
                </Button>
                {newValor.imagen && (
                  <img src={newValor.imagen.startsWith("blob:") ? newValor.imagen : `/uploads/valores/${newValor.imagen}`} alt="Icono" className="h-12 w-12 rounded-md border" />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}