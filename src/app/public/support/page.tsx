
"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Mail, HelpCircle, FileText, Users } from "lucide-react"
import { contacto } from "@/constants/data"
import { ENDPOINTS } from "@/config/endpoints"
import { API_URL } from "@/constants/Api"
import { useToast } from "@/hooks/use-toast"
import { fetchPreguntasFrecuentes } from "@/services/preguntafrecuente"
import { fetchGuias } from "@/services/guias"
import type { PreguntaFrecuente } from "@/types/preguntaFrecuente"
import type { GuiaTutorial, GuiaRecurso } from "@/types/guiaTutorial"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

function resolveRecursoUrl(recurso: GuiaRecurso): string {
  const raw = recurso.recurso_url || recurso.recurso
  if (!raw) return ""
  if (raw.startsWith("http") || raw.startsWith("/") || raw.startsWith("blob:") || raw.startsWith("data:")) {
    return raw
  }
  return `${API_URL}/uploads/guias/${raw}`
}

function findPdfRecurso(guia: GuiaTutorial): GuiaRecurso | undefined {
  if (!guia.recursos || guia.recursos.length === 0) return undefined
  return guia.recursos.find((r) => r.tipo === "pdf") ?? guia.recursos[0]
}

export default function Support() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [respuesta, setRespuesta] = useState<string | null>(null);
    const [openGuide, setOpenGuide] = useState<number | null>(null)
    const [faqs, setFaqs] = useState<PreguntaFrecuente[]>([])
    const [faqsLoading, setFaqsLoading] = useState(true)
    const [faqsError, setFaqsError] = useState<string | null>(null)
    const [guias, setGuias] = useState<GuiaTutorial[]>([])
    const [guiasLoading, setGuiasLoading] = useState(true)
    const [guiasError, setGuiasError] = useState<string | null>(null)
    const { toast } = useToast()

    const loadFaqs = async () => {
      setFaqsLoading(true)
      setFaqsError(null)
      try {
        const data = await fetchPreguntasFrecuentes()
        setFaqs(Array.isArray(data) ? data : [])
      } catch (err) {
        setFaqsError(err instanceof Error ? err.message : "No se pudieron cargar las preguntas frecuentes")
      } finally {
        setFaqsLoading(false)
      }
    }

    const loadGuias = async () => {
      setGuiasLoading(true)
      setGuiasError(null)
      try {
        const data = await fetchGuias()
        setGuias(Array.isArray(data) ? data : [])
      } catch (err) {
        setGuiasError(err instanceof Error ? err.message : "No se pudieron cargar las guías")
      } finally {
        setGuiasLoading(false)
      }
    }

    useEffect(() => {
      loadFaqs()
      loadGuias()
    }, [])

    const selectedGuia = guias.find((guia) => guia.ID === openGuide) ?? null
    const selectedPdf = selectedGuia ? findPdfRecurso(selectedGuia) : undefined
    const selectedPdfUrl = selectedPdf ? resolveRecursoUrl(selectedPdf) : ""
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!nombre || !correo || !asunto || !mensaje) {
        const msg = 'Por favor completa todos los campos obligatorios.';
        setRespuesta(msg);
        toast({ title: "Campos requeridos", description: msg, variant: "destructive" });
        return;
      }
  
      try {
        const datos = {
          nombre,
          email: correo,
          asunto,
          mensaje,
        };
  
        const response = await fetch(ENDPOINTS.SOPORTE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
  
        const resultado = await response.json();
  
        if (response.ok) {
          const msg = resultado.mensaje || '¡Tu solicitud fue enviada con éxito! Pronto nos pondremos en contacto contigo.';
          setRespuesta(msg);
          toast({ title: "Solicitud enviada", description: msg });
        } else {
          const msg = resultado.error || 'Hubo un problema al procesar tu solicitud. Por favor, revisa los datos e inténtalo nuevamente.';
          setRespuesta(msg);
          toast({ title: "Error al enviar", description: msg, variant: "destructive" });
        }
        } catch (error) {
          console.error(error);
          const msg = 'Ocurrió un error inesperado al enviar tu solicitud. Verifica tu conexión o intenta más tarde.';
          setRespuesta(msg);
          toast({ title: "Error de conexión", description: msg, variant: "destructive" });
        }
        
    };
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">Soporte y Ayuda</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Encuentra respuestas a tus preguntas, contacta con nosotros o consulta nuestras guías y tutoriales.
        </p>
      </div>

      <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Preguntas Frecuentes</span>
            <span className="sm:hidden">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="contacto" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Contacto</span>
          </TabsTrigger>
          <TabsTrigger value="guias" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guías y Tutoriales</span>
            <span className="sm:hidden">Guías</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="faq" className="space-y-4">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {faqsLoading ? "Cargando preguntas frecuentes..." : `${faqs.length} pregunta${faqs.length !== 1 ? "s" : ""} encontrada${faqs.length !== 1 ? "s" : ""}`}
          </div>
          {faqsError && (
            <div className="bg-destructive/15 p-4 rounded-md border border-destructive">
              <p className="text-destructive">{faqsError}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={loadFaqs}>
                Reintentar
              </Button>
            </div>
          )}
          {faqsLoading ? (
            <div className="space-y-3 animate-pulse" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-md bg-muted" />
              ))}
            </div>
          ) : faqs.length === 0 && !faqsError ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-muted-foreground">
                Aún no hay preguntas publicadas. Dejanos tu duda desde la pestaña Contacto
                y la respondemos con el equipo del Lab.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:lab-ux@unca.edu.ar">Escribinos a lab-ux@unca.edu.ar</a>
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((pregunta) => (
                <AccordionItem key={pregunta.ID} value={`item-${pregunta.ID}`}>
                  <AccordionTrigger>{pregunta.pregunta}</AccordionTrigger>
                  <AccordionContent>{pregunta.respuesta}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle>Contacta con nosotros</CardTitle>
              <CardDescription>
                Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacto.campos.filter(campo => campo.nombre !== "Mensaje" && campo.nombre !== "Asunto").map((campo) => (
                    <div className="space-y-2" key={campo.nombre}>
                      <label htmlFor={campo.nombre.toLowerCase()} className="text-sm font-medium">
                        {campo.nombre}
                      </label>
                      <Input
                        id={campo.nombre.toLowerCase()}
                        type={campo.tipo}
                        required={campo.requerido}
                        aria-required={campo.requerido}
                        aria-invalid={campo.nombre === "Nombre" ? (!nombre && !!respuesta ? true : undefined) : (!correo && !!respuesta ? true : undefined)}
                        placeholder={campo.placeholder}
                        value={campo.nombre === "Nombre" ? nombre : correo}
                        onChange={(e) => campo.nombre === "Nombre" ? setNombre(e.target.value) : setCorreo(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                {contacto.campos.filter(campo => campo.nombre === "Asunto").map((campo) => (
                  <div className="space-y-2" key={campo.nombre}>
                    <label htmlFor={campo.nombre.toLowerCase()} className="text-sm font-medium">
                      {campo.nombre}
                    </label>
                    <Input
                      id={campo.nombre.toLowerCase()}
                      type={campo.tipo}
                      required={campo.requerido}
                      aria-required={campo.requerido}
                      aria-invalid={!asunto && !!respuesta ? true : undefined}
                      placeholder={campo.placeholder}
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                    />
                  </div>
                ))}
                {contacto.campos.filter(campo => campo.nombre === "Mensaje").map((campo) => (
                  <div className="space-y-2" key={campo.nombre}>
                    <label htmlFor={campo.nombre.toLowerCase()} className="text-sm font-medium">
                      {campo.nombre}
                    </label>
                    <Textarea
                      id={campo.nombre.toLowerCase()}
                      required={campo.requerido}
                      aria-required={campo.requerido}
                      aria-invalid={!mensaje && !!respuesta ? true : undefined}
                      placeholder={campo.placeholder}
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      rows={5}
                    />
                  </div>
                ))}
                
                {respuesta && (
                  <div className={`mt-4 p-3 rounded ${respuesta.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {respuesta}
                  </div>
                )}
                <Button type="submit" className="w-full">Enviar Solicitud</Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{contacto.datos.email}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Horario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{contacto.datos.horario}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                {contacto.datos.redes.map((red) => (
                  <a 
                    key={red.nombre}
                    href={red.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {red.nombre}
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="guias" className="space-y-6">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {guiasLoading ? "Cargando guías..." : `${guias.length} guía${guias.length !== 1 ? "s" : ""} encontrada${guias.length !== 1 ? "s" : ""}`}
          </div>
          {guiasError && (
            <div className="bg-destructive/15 p-4 rounded-md border border-destructive">
              <p className="text-destructive">{guiasError}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={loadGuias}>
                Reintentar
              </Button>
            </div>
          )}
          {guiasLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted mt-2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="h-4 w-full rounded bg-muted" />
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 w-full rounded bg-muted" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : guias.length === 0 && !guiasError ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-muted-foreground">
                Aún no hay guías publicadas. Volvé la semana próxima o escribinos
                para participar como tester.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:lab-ux@unca.edu.ar">Quiero participar como tester</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guias.map((guia) => (
                <Card key={guia.ID} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{guia.titulo}</CardTitle>
                    <CardDescription className="line-clamp-2">{guia.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    {guia.categoria && <Badge variant="outline">{guia.categoria}</Badge>}
                    {guia.fecha_publicacion && (
                      <p className="text-xs text-muted-foreground">
                        Publicado el {new Date(guia.fecha_publicacion).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setOpenGuide(guia.ID)}>
                      Ver guía
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {selectedGuia && (
            <Dialog open={openGuide !== null} onOpenChange={(open) => !open && setOpenGuide(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedGuia.titulo}</DialogTitle>
                  <DialogDescription>{selectedGuia.descripcion}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    {selectedGuia.categoria && (
                      <p className="text-sm text-muted-foreground">Categoría: {selectedGuia.categoria}</p>
                    )}
                    {selectedGuia.areas_investigacion && selectedGuia.areas_investigacion.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedGuia.areas_investigacion.map((area) => (
                          <Badge key={area.ID_area} variant="outline">
                            {area.area_nombre || `Área ${area.ID_area}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {selectedGuia.recursos && selectedGuia.recursos.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedGuia.recursos.map((recurso) => (
                          <li key={recurso.ID} className="text-sm">
                            <a
                              href={resolveRecursoUrl(recurso)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              [{recurso.tipo}] {recurso.descripcion || recurso.recurso}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Esta guía aún no tiene recursos para descargar.</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </DialogClose>
                  {selectedPdfUrl ? (
                    <a href={selectedPdfUrl} download target="_blank" rel="noopener noreferrer">
                      <Button>Descargar PDF</Button>
                    </a>
                  ) : (
                    <Button disabled title="Sin archivo disponible">Descargar PDF</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
  
      </Tabs>
    </div>
  )
}
