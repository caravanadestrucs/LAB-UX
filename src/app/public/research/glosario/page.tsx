"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchTerminos } from "@/services/glosario"
import { useToast } from "@/components/hooks/use-toast"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

export default function GlosarioPage() {
  const { toast } = useToast()
  const [terminos, setTerminos] = useState<{ termino: string; descripcion: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")
  const debouncedFilter = useDebouncedValue(filter, 300)
  const [selectedLetter, setSelectedLetter] = useState("")

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    const controller = new AbortController()

    const loadTermsFiltered = async () => {
      setLoading(true)
      try {
        const query: string[] = []
        if (selectedLetter) query.push(`letra=${encodeURIComponent(selectedLetter.toLowerCase())}`)
        if (debouncedFilter) query.push(`q=${encodeURIComponent(debouncedFilter)}`)
        const queryString = query.length ? `?${query.join("&")}` : ""
        const data = await fetchTerminos(queryString, { signal: controller.signal })
        if (!controller.signal.aborted) {
          setTerminos(data)
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        // fetch abort via AbortSignal may throw DOMException, also check generic AbortError
        if (typeof error === "object" && error !== null && "name" in error && (error as { name: string }).name === "AbortError") {
          return
        }
        const msg =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: unknown }).message)
              : typeof error === "object" && error !== null && "error" in error
                ? String((error as { error: unknown }).error)
                : "No se pudo cargar el glosario"
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        })
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTermsFiltered()

    return () => controller.abort()
  }, [selectedLetter, debouncedFilter, toast])

  // Agrupar términos por letra inicial
  const groupedTerms = terminos.reduce<Record<string, typeof terminos>>((acc, term) => {
    const firstLetter = term.termino.charAt(0).toUpperCase()
    if (!acc[firstLetter]) acc[firstLetter] = []
    acc[firstLetter].push(term)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Glosario de Usabilidad</h1>
          <p className="text-muted-foreground max-w-2xl">
            Consulta nuestro glosario de términos relacionados con la usabilidad y experiencia de usuario.
          </p>
        </div>

        <form
          role="search"
          aria-label="Buscar en glosario"
          className="flex items-center space-x-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Buscar términos..."
              className="pl-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Buscar términos"
            />
          </div>
          <Button type="submit" aria-label="Buscar">
            <Search className="h-4 w-4 mr-2" aria-hidden="true" />
            Buscar
          </Button>
        </form>

        <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrar por letra">
          <Button
            variant={selectedLetter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLetter("")}
            aria-pressed={selectedLetter === ""}
            aria-label="Mostrar todos los términos"
          >
            Todos
          </Button>
          {alphabet.map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(letter)}
              disabled={loading}
              aria-pressed={selectedLetter === letter}
              aria-label={`Filtrar por letra ${letter}`}
            >
              {letter}
            </Button>
          ))}
        </div>

        {/* aria-live region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading ? "Cargando términos..." : `${terminos.length} término${terminos.length !== 1 ? "s" : ""} encontrado${terminos.length !== 1 ? "s" : ""}`}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Términos del Glosario</CardTitle>
            <CardDescription>
              {loading
                ? "Cargando..."
                : `${terminos.length} término${terminos.length !== 1 ? "s" : ""} encontrado${terminos.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-muted-foreground">Cargando términos...</p>
                </div>
              ) : Object.keys(groupedTerms).length > 0 ? (
                Object.keys(groupedTerms)
                  .sort()
                  .map((letter) => (
                    <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                      <h3 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h3>
                      <div className="space-y-4">
                        {groupedTerms[letter]
                          .sort((a, b) => a.termino.localeCompare(b.termino))
                          .map((term, idx) => (
                            <div key={term.termino + idx} className="border-b pb-4 last:border-0">
                              <h4 className="text-lg font-semibold">{term.termino}</h4>
                              <p className="text-muted-foreground mt-1">{term.descripcion}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No se encontraron términos que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
