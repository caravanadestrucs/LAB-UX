import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, FlaskConical, BookOpen, ArrowRight } from "lucide-react"

const hubs = [
  {
    icon: FolderKanban,
    titulo: "Proyectos",
    texto: "Estudios de usabilidad y experiencia de usuario con personas reales de Catamarca.",
    href: "/public/research/proyectos",
  },
  {
    icon: FlaskConical,
    titulo: "Metodologías",
    texto: "Pruebas, técnicas y protocolos que usamos en el laboratorio para evaluar usabilidad.",
    href: "/public/research/metodologias",
  },
  {
    icon: BookOpen,
    titulo: "Glosario",
    texto: "Términos claros de UX y usabilidad explicados por el equipo del Lab.",
    href: "/public/research/glosario",
  },
]

export default function Research() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto mt-8 px-4 pb-16">
          <p className="text-sm font-medium text-muted-foreground">Investigación — Lab-UX · UNCA</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mt-2">Investigación en usabilidad</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Explora el trabajo del Laboratorio de Usabilidad de la Facultad de Tecnología, UNCA.
            Testeamos con personas reales de Catamarca.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {hubs.map((hub) => (
              <Card key={hub.href} className="flex flex-col h-full">
                <CardHeader>
                  <div className="bg-primary/10 rounded-md p-2 w-fit">
                    <hub.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-3">{hub.titulo}</CardTitle>
                  <CardDescription>{hub.texto}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={hub.href}>
                      Ver {hub.titulo.toLowerCase()} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            ¿Quieres participar como tester?{" "}
            <Link href="/public/support" className="underline underline-offset-4 decoration-[#0E7490] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CA8A04] focus-visible:ring-offset-2 rounded-sm">
              Escríbenos desde Soporte y Ayuda
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
