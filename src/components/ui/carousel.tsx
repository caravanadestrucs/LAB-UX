"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { fetchContenidos } from "@/services/contenido"
import { ContenidoSitio } from "@/types/contenidoSitio"
import { API_URL } from "@/constants/Api"

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

export function Carousel() {
  const [slides, setSlides] = useState<ContenidoSitio[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Cargar banners desde el servicio
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchContenidos({ tipo: "banner", estado: "activo" })
        setSlides(data)
      } catch {
        // Puedes mostrar un toast de error si lo deseas
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

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full">
        <span className="text-muted-foreground">No hay banners para mostrar.</span>
      </div>
    )
  }

  return (
    <div
      className="relative h-[400px] w-full overflow-hidden"
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carrusel de banners"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.ID}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              prefersReducedMotion ? "transition-none" : "transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${slides.length}: ${slide.titulo}`}
            aria-hidden={index !== currentIndex}
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {slide.imagen ? (
                <img
                  src={`${API_URL}/uploads/contenido/${slide.imagen}`}
                  alt={slide.titulo || `Banner ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              {/* Overlay contraste para garantizar legibilidad WCAG sobre imagen */}
              <div
                className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            {/* Content — texto blanco con sombra para contraste AA */}
            <div className="relative z-10 text-center max-w-3xl px-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
                {slide.titulo}
              </h2>
              {slide.texto && (
                <p className="text-lg sm:text-xl md:text-2xl text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                  {slide.texto}
                </p>
              )}
              {slide.link_redireccion && (
                <a href={slide.link_redireccion} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-6">Saber más</Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 hover:text-white z-20"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 hover:text-white z-20"
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20" role="tablist" aria-label="Selector de diapositivas">
          {slides.map((_, index) => (
            <button
              key={index}
              role="tab"
              className={cn(
                "w-3 h-3 rounded-full transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                index === currentIndex
                  ? "bg-white w-6 border-white shadow"
                  : "bg-white/60 border-white/40 hover:bg-white/80",
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
        Diapositiva {currentIndex + 1} de {slides.length}: {slides[currentIndex]?.titulo}
      </div>
    </div>
  )
}
