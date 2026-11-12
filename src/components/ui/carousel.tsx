"use client"

// NOTE(bundle): embla-carousel-react está en dependencies pero este Carousel es
// implementación custom sin embla (verificado 0 imports de embla en src).
// TODO(bundle): evaluar remover embla-carousel-react si no se planea usar,
// o migrar este componente a embla con dynamic(() => import) para code-split.
// Por ahora se conserva por compatibilidad — no duplica Radix como antd.

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { fetchContenidos } from "@/services/contenido"
import { ContenidoSitio } from "@/types/contenidoSitio"
import { bannersTEMPORAL, DEMO_BADGE } from "@/constants/data"
import { Badge } from "@/components/ui/badge"
import { getMediaUrl } from "@/lib/media"

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setPrefersReducedMotion(mql.matches)
    // set initial
    setPrefersReducedMotion(mql.matches)
    // Safari <14 uses deprecated addListener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    } else {
      // fallback Safari <14
      const mqlLegacy = mql as MediaQueryList & { addListener: (cb: () => void) => void; removeListener: (cb: () => void) => void }
      mqlLegacy.addListener(onChange)
      return () => mqlLegacy.removeListener(onChange)
    }
  }, [])

  return prefersReducedMotion
}

const METRICS = [
  { value: "12", label: "tests activos" },
  { value: "SUS 84", label: "promedio" },
  { value: "96%", label: "WCAG AA" },
] as const

export function Carousel() {
  const [slides, setSlides] = useState<ContenidoSitio[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [demo, setDemo] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Cargar banners desde el servicio
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchContenidos({ tipo: "banner", estado: "activo" })
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
          setDemo(false)
        } else {
          setSlides(bannersTEMPORAL)
          setDemo(true)
        }
      } catch {
        setSlides(bannersTEMPORAL)
        setDemo(true)
      }
    }
    loadBanners()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (slides.length ? (prevIndex + 1) % slides.length : 0))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (slides.length ? (prevIndex - 1 + slides.length) % slides.length : 0))
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Autoplay — respeta prefers-reduced-motion
  useEffect(() => {
    if (prefersReducedMotion) return
    let interval: ReturnType<typeof setInterval> | undefined

    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextSlide, slides.length, prefersReducedMotion])

  // Pause autoplay when user interacts with carousel
  const handleInteraction = () => {
    setIsAutoPlaying(false)
    const timeout = setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)
    return () => clearTimeout(timeout)
  }

  const activeSlide = slides[currentIndex]
  const subCopy =
    activeSlide?.texto ||
    "Tests con usuarios reales, análisis de cada duda y decisiones de diseño con evidencia."

  return (
    <div
      className="relative min-h-[560px] w-full overflow-hidden bg-[#0F1E33] md:min-h-[600px]"
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      role="region"
      aria-roledescription="carousel"
      aria-label="Presentación del laboratorio"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Fondos rotativos (CMS) */}
      <div className="absolute inset-0" aria-hidden={slides.length > 0 ? undefined : true}>
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <div
              key={slide.ID}
              className={cn(
                "absolute inset-0",
                prefersReducedMotion ? "transition-none" : "transition-opacity duration-1000",
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}: ${slide.titulo}`}
              aria-hidden={index !== currentIndex}
            >
              {slide.imagen ? (
                <Image
                  src={getMediaUrl("contenido", slide.imagen)}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#0F1E33]" />
              )}
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-[#0F1E33]" aria-hidden="true" />
        )}
        {/* Overlay tinta para garantizar legibilidad WCAG sobre imagen */}
        <div
          className="absolute inset-0 bg-[#0F1E33]/70 bg-gradient-to-t from-[#0F1E33]/90 via-[#0F1E33]/50 to-[#0F1E33]/30"
          aria-hidden="true"
        />
      </div>

      {/* Contenido hero */}
      <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-6xl flex-col justify-center px-4 py-14 md:min-h-[600px] md:px-6">
        {demo && (
          <div className="mb-4 flex w-fit items-center gap-2" role="status">
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white">{DEMO_BADGE}</Badge>
          </div>
        )}
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-amber-300">
          Laboratorio de usabilidad — UNCA
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl">
          Observamos cómo las personas usan lo que construyes
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">{subCopy}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-[#0E7490] text-white shadow-lab hover:bg-[#0E7490]/90">
            <Link href="/public/research/metodologias">Ver un test</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/#mision">Cómo trabajamos</Link>
          </Button>
        </div>

        {/* Ticker de métricas */}
        <dl
          aria-label="Métricas del laboratorio"
          className="mt-10 flex w-fit flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-sm"
        >
          {METRICS.map((m) => (
            <div key={m.label} className="flex items-baseline gap-2">
              <dt className="order-2 text-sm text-white/70">{m.label}</dt>
              <dd className="order-1 font-display text-xl font-bold tabular-nums text-white">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Anotación de observación + heatmap (decorativa) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-16 z-10 hidden w-52 rotate-2 rounded-lg border border-amber-300/40 bg-[#0F1E33]/85 p-3 shadow-lab backdrop-blur-sm lg:block"
      >
        <p className="text-xs font-medium text-amber-200">“dudó 3&nbsp;s en Enviar”</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#CA8A04]" />
          <span className="h-2 w-2 rounded-full bg-[#CA8A04]/70" />
          <span className="h-2 w-2 rounded-full bg-[#0E7490]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#0E7490] to-[#CA8A04]" />
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 hover:text-white"
            onClick={() => {
              prevSlide()
              handleInteraction()
            }}
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 hover:text-white"
            onClick={() => {
              nextSlide()
              handleInteraction()
            }}
            aria-label="Diapositiva siguiente"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </Button>
        </>
      )}

      {/* Indicators — contraste corregido: bg-white/60 inactivo, bg-white activo con borde */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2" role="tablist" aria-label="Selector de diapositivas">
          {slides.map((_, index) => (
            <button
              key={index}
              role="tab"
              className={cn(
                "h-3 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                index === currentIndex
                  ? "w-6 border-white bg-white shadow"
                  : "w-3 border-white/40 bg-white/60 hover:bg-white/80",
              )}
              onClick={() => {
                goToSlide(index)
                handleInteraction()
              }}
              aria-label={`Ir a diapositiva ${index + 1} de ${slides.length}`}
              aria-selected={index === currentIndex}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}

      {/* Live region oculta para lectores de pantalla */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Diapositiva {currentIndex + 1} de {slides.length || 1}
        {activeSlide?.titulo ? `: ${activeSlide.titulo}` : ""}
      </div>
    </div>
  )
}
