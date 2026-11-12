"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchTerminos } from "@/services/glosario"
import { glosarioTEMPORAL, DEMO_BADGE } from "@/constants/data"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/hooks/use-toast"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"

export default function GlosarioPage() {
  const { toast } = useToast()
  const [terminos, setTerminos] = useState<{ termino: string; descripcion: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")
  const debouncedFilter = useDebouncedValue(filter, 300)
  const [selectedLetter, setSelectedLetter] = useState("")
  const [glosarioError, setGlosarioError] = useState<string | null>(null)
  const [demo, setDemo] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    const controller = new AbortController()

    const loadTermsFiltered = async () => {
      setLoading(true)
      setGlosarioError(null)
      setDemo(false)
      try {
        const query: string[] = []
        if (selectedLetter) query.push(`letra=${encodeURIComponent(selectedLetter.toLowerCase())}`)
        if (debouncedFilter) query.push(`q=${encodeURIComponent(debouncedFilter)}`)
        const queryString = query.length ? `?${query.join("&")}` : ""
        const data = await fetchTerminos(queryString, { signal: controller.signal })
        if (!controller.signal.aborted) {
          setTerminos(data)
          setDemo(false)
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        // fetch abort via AbortSignal may throw DOMException, also check generic AbortError
        if (typeof error === "object" && error !== null && "name" in error && (error as { name: string }).name === "AbortError") {
          return
        }
        if (controller.signal.aborted) return
        const filtered = glosarioTEMPORAL.filter((t) => {
          const q = debouncedFilter.toLowerCase()
          const matchQ = !q || t.termino.toLowerCase().includes(q) || t.descripcion.toLowerCase().includes(q)
          const matchL = !selectedLetter || t.termino.toUpperCase().startsWith(selectedLetter)
          return matchQ && matchL
        })
        setTerminos(filtered.map((t) => ({ termino: t.termino, descripcion: t.descripcion })))
        setGlosarioError(null)
        setDemo(true)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTermsFiltered()

    return () => controller.abort()
  }, [selectedLetter, debouncedFilter, toast, retryCount])

  // Agrupar términos por letra inicial
  const groupedTerms = terminos.reduce<Record<string, typeof terminos>>((acc, term) => {
    const firstLetter = term.termino.charAt(0).toUpperCase()
    if (!acc[firstLetter]) acc[firstLetter] = []
    acc[firstLetter].push(term)
    return acc
  }, {})

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
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

        {demo && (
          <div className="flex items-center gap-3 rounded-md border border-dashed p-3" role="status">
            <Badge variant="outline">{DEMO_BADGE}</Badge>
            <Button variant="outline" size="sm" className="mt-0" onClick={() => { setDemo(false); setRetryCount((c) => c + 1) }}>
              Reintentar
            </Button>
          </div>
        )}

        {glosarioError && (
          <div className="bg-destructive/15 p-4 rounded-md border border-destructive" role="alert">
            <p className="text-destructive">No pudimos cargar los datos. Revisa tu conexión o reintenta.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => { setGlosarioError(null); setRetryCount((c) => c + 1) }}>
              Reintentar
            </Button>
          </div>
        )}

        <div>
          <p role="status" className="text-sm text-muted-foreground">
            {loading
              ? "Cargando..."
              : glosarioError
                ? "No pudimos cargar los términos."
                : `${terminos.length} término${terminos.length !== 1 ? "s" : ""} encontrado${terminos.length !== 1 ? "s" : ""}`}
          </p>
          <div className="mt-6 space-y-12">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-muted-foreground">Cargando términos...</p>
              </div>
            ) : glosarioError ? null : Object.keys(groupedTerms).length > 0 ? (
              Object.keys(groupedTerms)
                .sort()
                .map((letter) => (
                  <section
                    key={letter}
                    id={`letter-${letter}`}
                    aria-label={`Términos con la letra ${letter}`}
                    className="scroll-mt-20 grid gap-4 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <span
                      aria-hidden="true"
                      className="text-7xl font-black leading-none tracking-tight text-[#0F1E33] md:text-8xl"
                    >
                      {letter}
                    </span>
                    <dl className="divide-y divide-border">
                      {groupedTerms[letter]
                        .sort((a, b) => a.termino.localeCompare(b.termino))
                        .map((term, idx) => (
                          <div key={term.termino + idx} className="py-4 first:pt-0 last:pb-0">
                            <dt className="text-lg font-semibold leading-snug">{term.termino}</dt>
                            <dd className="mt-1 max-w-prose text-muted-foreground">{term.descripcion}</dd>
                          </div>
                        ))}
                    </dl>
                  </section>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron términos que coincidan con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
