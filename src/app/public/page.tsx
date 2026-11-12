"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchContenidos } from "@/services/contenido"
import { Mision as MisionFallback, Vision as VisionFallback, Valores as ValoresFallback, DEMO_BADGE } from "@/constants/data"
import type { ContenidoSitio, Valor } from "@/types"

export default function Home() {
  const [mision, setMision] = useState<ContenidoSitio>(MisionFallback)
  const [vision, setVision] = useState<ContenidoSitio>(VisionFallback)
  const [valores, setValores] = useState<Valor[]>(ValoresFallback)
  const [demo, setDemo] = useState(false)

  const loadContenidos = async () => {
    try {
      const data = await fetchContenidos()
      const list = Array.isArray(data) ? data : []
      if (list.length === 0) {
        setDemo(true)
        return
      }
      const m = list.find((c) => c.tipo === "mision")
      const v = list.find((c) => c.tipo === "vision")
      const vals = list.filter((c) => c.tipo === "valores")
      if (m) setMision(m)
      if (v) setVision(v)
      if (vals.length > 0) setValores(vals as Valor[])
      setDemo(false)
    } catch {
      setMision(MisionFallback)
      setVision(VisionFallback)
      setValores(ValoresFallback)
      setDemo(true)
    }
  }

  useEffect(() => {
    loadContenidos()
  }, [])

  return (
    <main>
      {demo && (
        <div className="container mx-auto px-4 pt-6">
          <div className="flex items-center gap-3 rounded-md border border-dashed p-3" role="status">
            <Badge variant="outline">{DEMO_BADGE}</Badge>
            <Button variant="outline" size="sm" onClick={loadContenidos}>
              Reintentar
            </Button>
          </div>
        </div>
      )}
      {/* Banner Carrusel */}
      <Carousel />
      {/* Sección de Misión - Texto a la izquierda, imagen a la derecha */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Texto de la Misión */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-2">{mision.titulo}</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-lg font-thin mb-4">
                {mision.titulo}
              </p>
              <p className="text-lg font-thin">
               {mision.texto}
              </p>
            </div>

            {/* Imagen de la Misión */}
            <div className="order-1 md:order-2">
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={mision.imagen || "/placeholder.svg"}
                  alt={mision.texto || mision.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 ">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Imagen de la Visión */}
            <div>
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={vision.imagen || "/placeholder.svg"}
                  alt={vision.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Texto de la Visión */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{vision.titulo}</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-lg font-thin mb-4">
              {vision.texto}
              </p>
              <p className="text-lg font-thin">
              {vision.texto}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de Valores - Se mantiene igual */}
      <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Nuestros Valores</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {valores.map((valor, index) => (
            <div key={valor.ID ?? index} className="p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={valor.imagen}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{valor.titulo}</h3>
              <p className="font-thin">{valor.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </main>
  )
}
