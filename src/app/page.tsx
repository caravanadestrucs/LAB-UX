"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchContenidos } from "@/services/contenido"
import { getMediaUrl } from "@/lib/media"
import type { ContenidoSitio } from "@/types/contenidoSitio"

function SkeletonHome() {
  return (
    <main aria-busy="true" aria-label="Cargando contenido" className="min-h-screen">
      {/* Banner skeleton — altura sincronizada con hero lab (560/600) para evitar CLS */}
      <div className="relative min-h-[560px] w-full overflow-hidden bg-muted md:min-h-[600px]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>

      {/* Mision skeleton */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-1 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="order-1 md:order-2">
              <Skeleton className="h-[300px] md:h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision skeleton */}
      <section className="bg-[#F1F5F9] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Skeleton className="h-[300px] md:h-[400px] w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-1 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Valores skeleton grid 3 cols */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4 flex flex-col items-center">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-1 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-lg shadow-md text-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function Home() {
  const [mision, setMision] = useState<ContenidoSitio | null>(null)
  const [vision, setVision] = useState<ContenidoSitio | null>(null)
  const [valores, setValores] = useState<ContenidoSitio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [misionArr, visionArr, valoresArr] = await Promise.all([
          fetchContenidos({ tipo: "mision" }),
          fetchContenidos({ tipo: "vision" }),
          fetchContenidos({ tipo: "valores" }),
        ])
        setMision(misionArr[0] || null)
        setVision(visionArr[0] || null)
        setValores(valoresArr || [])
      } catch {
        // silente: mantiene valores vacíos, no bloquea render
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <SkeletonHome />

  return (
    <main className="min-h-screen">
      {/* Hero lab observacional */}
      <Carousel />

      {/* Sección de Misión */}
      {mision && (
        <section id="mision" aria-labelledby="mision-titulo" className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Texto de la Misión */}
              <div className="order-2 md:order-1">
                <h2 id="mision-titulo" className="mb-2 font-display text-4xl font-bold tracking-tight">
                  {mision.titulo}
                </h2>
                <div className="w-20 h-1 bg-primary mb-6" aria-hidden="true"></div>
                <p className="text-lg font-normal text-slate-700">{mision.texto}</p>
              </div>
              {/* Imagen de la Misión — min-h evita CLS si imagen tarda */}
              <div className="order-1 md:order-2">
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lab flex items-center justify-center bg-muted">
                  {mision.imagen && (
                    <Image
                      src={getMediaUrl("contenido", mision.imagen)}
                      alt={mision.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección de Visión */}
      {vision && (
        <section aria-labelledby="vision-titulo" className="bg-[#F1F5F9] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Imagen de la Visión */}
              <div>
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lab flex items-center justify-center bg-muted">
                  {vision.imagen && (
                    <Image
                      src={getMediaUrl("contenido", vision.imagen)}
                      alt={vision.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
              {/* Texto de la Visión */}
              <div>
                <h2 id="vision-titulo" className="mb-2 font-display text-4xl font-bold tracking-tight">
                  {vision.titulo}
                </h2>
                <div className="w-20 h-1 bg-primary mb-6" aria-hidden="true"></div>
                <p className="text-lg font-normal text-slate-700">{vision.texto}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección de Valores */}
      <section aria-labelledby="valores-titulo" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="valores-titulo" className="mb-2 font-display text-4xl font-bold tracking-tight">
              Nuestros Valores
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" aria-hidden="true"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto min-h-[200px]">
            {valores.map((valor, i) => (
              <div key={valor.ID} className="p-6 rounded-lg shadow-md text-center">
                <span
                  aria-hidden="true"
                  className="mb-3 block font-display text-sm font-bold tabular-nums tracking-widest text-[#0E7490]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {valor.imagen ? (
                    <Image
                      src={getMediaUrl("contenido", valor.imagen)}
                      alt=""
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-10 w-10 object-contain mx-auto"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin icono</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{valor.titulo}</h3>
                <p className="font-normal text-slate-700">{valor.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
