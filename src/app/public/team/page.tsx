"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, GraduationCap, BookOpen } from "lucide-react"
import { ModalCv } from "./components/modalcv"
import { User, RoleUser } from "@/types/index";
import { fetchUsers } from "@/services/index";

function roleLabel(tipo: RoleUser): string {
  return tipo === "profesor"
    ? "Profesor"
    : tipo === "admin"
      ? "Miembro del equipo"
      : "Alumno";
}

function areaPrincipal(person: User): string {
  const areas = person.areas_investigacion;
  if (Array.isArray(areas) && areas.length > 0) {
    return areas[0].area_nombre || areas[0].nombre || "Área sin definir";
  }
  if (typeof areas === "string") return areas;
  const formacion = person.formacion_academica;
  if (Array.isArray(formacion) && formacion.length > 0) {
    const first = formacion[0] as unknown;
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "titulo" in first) {
      return String((first as { titulo: unknown }).titulo);
    }
  }
  if (typeof formacion === "string") return formacion;
  return "Perfil en construcción";
}

function TeamCard({ person }: { person: User }) {
  const areasCount = Array.isArray(person.areas_investigacion) ? person.areas_investigacion.length : 0;
  const estudiosCount = Array.isArray(person.formacion_academica) ? person.formacion_academica.length : 0;
  return (
    <Card variant="lab" className="overflow-hidden transition-shadow motion-safe:transition-all hover:shadow-lg">
      <div className="relative aspect-[4/5]">
        <Image
          src={person.avatar || "/placeholder.svg"}
          alt={`${person.nombre} ${person.apellido ?? ""}`.trim()}
          fill
          sizes="33vw"
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle>{person.nombre} {person.apellido}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="lab">{roleLabel(person.tipo_usuario)}</Badge>
          <span className="text-xs text-muted-foreground">
            {areasCount} {areasCount === 1 ? "área" : "áreas"} · {estudiosCount} {estudiosCount === 1 ? "estudio" : "estudios"}
          </span>
        </div>
        <CardDescription className="font-medium text-[#0E7490]">
          {areaPrincipal(person)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          Campus Principal
        </div>
        <Button variant="ghost" size="sm" className="text-[#0E7490]">
          <ModalCv perfil={person} />
        </Button>
      </CardFooter>
    </Card>
  );
}

function TeamEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-muted-foreground">
        Todavía no hay {label} publicados. El laboratorio sigue creciendo y hay lugar para vos.
      </p>
      <Button asChild variant="outline">
        <Link href="/public/support">Escríbenos y te presentamos al equipo</Link>
      </Button>
    </div>
  );
}

function TeamGrid({ users, emptyLabel }: { users: User[]; emptyLabel: string }) {
  if (users.length === 0) return <TeamEmpty label={emptyLabel} />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((person) => (
        <TeamCard key={person.ID ?? `${person.nombre}-${person.apellido}`} person={person} />
      ))}
    </div>
  );
}

export default function Team() {
  // Estado para el loading
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [areaInterest, setInterest] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<RoleUser>("profesor");

  // Cargar usuarios filtrados por tipo
  useEffect(() => {
    setLoading(true);
    fetchUsers("", activeTab === "profesor" ? "profesor" : 
               activeTab === "admin" ? "admin" : "alumno", "activo")
      .then(data => {
        setUsers(data);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Manejador de cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(
      value === "profesores" ? "profesor" :
      value === "equipo" ? "admin" : "alumno"
    );
  };

  // Filtrar usuarios según la pestaña activa
  const filteredUsers = users.filter(user => {
    if (activeTab === "profesor") return user.tipo_usuario === "profesor";
    if (activeTab === "admin") return user.tipo_usuario === "admin";
    return user.tipo_usuario === "alumno";
  });

  // Resto del código del formulario...
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (mantener igual)
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full mx-auto">
        {/* Sección del Equipo */}
        <section id="team" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="px-4 py-1 text-sm">Equipo</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Conoce a quienes hacen posible todo</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Un equipo diverso y apasionado de profesionales, educadores y estudiantes comprometidos con la excelencia.
                </p>
              </div>
            </div>

            <Tabs 
              defaultValue="profesores" 
              className="mt-12 w-full"
              onValueChange={handleTabChange}
            >
              <div className="flex justify-center mb-8 w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="profesores"><GraduationCap className="mr-2 h-4 w-4" />Profesores</TabsTrigger>
                  <TabsTrigger value="equipo"><Users className="mr-2 h-4 w-4" />Equipo</TabsTrigger>
                  <TabsTrigger value="alumnos"><BookOpen className="mr-2 h-4 w-4" />Alumnos</TabsTrigger>
                </TabsList>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <p>Cargando usuarios...</p>
                </div>
              ) : (
                <>
                  <TabsContent value="profesores">
                    <TeamGrid users={filteredUsers} emptyLabel="profesores" />
                  </TabsContent>

                  <TabsContent value="equipo">
                    <TeamGrid users={filteredUsers} emptyLabel="miembros del equipo" />
                  </TabsContent>

                  <TabsContent value="alumnos">
                    <TeamGrid users={filteredUsers} emptyLabel="alumnos" />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </section>
        {/* Sección Únete */}
        <section id="join" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary">Únete a Nosotros</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  ¿Quieres formar parte de nuestro equipo?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Estamos siempre en búsqueda de talento apasionado por la educación y la innovación.
                </p>
              </div>
              <div className="lg:pl-10">
                <Card>
                  <CardHeader>
                    <CardTitle>Solicitud de Información</CardTitle>
                    <CardDescription>
                      Completa el formulario y nos pondremos en contacto contigo para brindarte más detalles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="first-name" className="text-sm font-medium">Nombre</label>
                          <input id="first-name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="last-name" className="text-sm font-medium">Apellido</label>
                          <input id="last-name" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Pérez"
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                        <input id="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="juan@email.com"
                          type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="interest"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Área de interés
                        </label>
                        <select
                          id="interest"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={areaInterest}
                          onChange={(e) => setInterest(e.target.value)}
                        >
                          <option value="" disabled selected>
                            Selecciona una opción
                          </option>
                          <option value="teaching">Docencia</option>
                          <option value="research">Investigación</option>
                          <option value="admin">Administración</option>
                          <option value="student">Programas para estudiantes</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="mensaje" className="text-sm font-medium">Mensaje</label>
                        <textarea id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4}
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Cuéntanos un poco más sobre ti..." />
                      </div>
                      {respuesta && (
                        <div className={`mt-4 p-3 rounded ${respuesta.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {respuesta}
                        </div>
                      )}
                      <Button type="submit" className="w-full">Enviar Solicitud</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
