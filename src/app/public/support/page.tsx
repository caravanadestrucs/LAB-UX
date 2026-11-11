
"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail, HelpCircle, FileText, Users } from "lucide-react"
import {preguntasFrecuentes, guides, contacto} from "@/constants/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function Support() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [respuesta, setRespuesta] = useState<string | null>(null);
    const [openGuide, setOpenGuide] = useState<string | null>(null)
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!nombre || !correo || !asunto || !mensaje) {
        setRespuesta('Por favor completa todos los campos obligatorios.');
        return;
      }
  
      try {
        const datos = {
          nombre: `${nombre}`,
          email: correo,
          asunto,
          mensaje,
        };
  
        const response = await fetch('http://localhost:5000/soporte', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
  
        const resultado = await response.json();
  
        if (response.ok) {
          setRespuesta(resultado.mensaje || '¡Tu solicitud fue enviada con éxito! Pronto nos pondremos en contacto contigo.');
        } else {
          setRespuesta(resultado.error || 'Hubo un problema al procesar tu solicitud. Por favor, revisa los datos e inténtalo nuevamente.');
        }
        } catch (error) {
          setRespuesta('Ocurrió un error inesperado al enviar tu solicitud. Verifica tu conexión o intenta más tarde.'+ error);
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
          <Accordion type="single" collapsible className="w-full">
            {preguntasFrecuentes.map((pregunta, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{pregunta.pregunta}</AccordionTrigger>
              <AccordionContent>{pregunta.respuesta}</AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{guide.summary}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setOpenGuide(guide.id)}>
                    Ver guía
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {guides.map((guide) => (
            <Dialog key={guide.id} open={openGuide === guide.id} onOpenChange={(open) => !open && setOpenGuide(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{guide.title}</DialogTitle>
                  <DialogDescription>{guide.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{guide.titleTwo}</h3>
                    <p>{guide.descriptionTwo}</p>
                    <h3 className="text-lg font-medium">{guide.titleThree}</h3>
                    <p>{guide.descriptionThree}</p>
                    <h3 className="text-lg font-medium">{guide.titleFour}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                    {Object.values(guide.steps).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                    </ul>
                    <h3 className="text-lg font-medium">{guide.titleFive}</h3>
                    <p>{guide.descriptionFive}</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </DialogClose>
                  <Button>Descargar PDF</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </TabsContent>
  
      </Tabs>
    </div>
  )
}

