"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { fetchContenidos } from "@/services/contenido"
import { ContenidoSitio } from "@/types/contenidoSitio"
import { API_URL } from "@/constants/Api"

export function Carousel() {
  const [slides, setSlides] = useState<ContenidoSitio[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Cargar banners desde el servicio
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchContenidos({ tipo: "banner", estado: "activo" })
        setSlides(data)
      } catch (error) {
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

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying && slides.length > 1) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextSlide, slides.length])

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
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.ID}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {slide.imagen ? (
                <img
                  src={`${API_URL}/uploads/contenido/${slide.imagen}`}
                  alt={slide.titulo}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />z
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl px-6 ">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{slide.titulo}</h2>
              <p className="text-lg sm:text-xl md:text-2xl">{slide.texto}</p>
              {slide.link_redireccion && (
                <a href={slide.link_redireccion} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-6 text-secondary">Saber más</Button>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 z-20"
            onClick={() => {
              prevSlide()
              handleInteraction()
            }}
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30 z-20"
            onClick={() => {
              nextSlide()
              handleInteraction()
            }}
            aria-label="Diapositiva siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex ? "bg-current w-6" : "bg-inherit ",
              )}
              onClick={() => {
                goToSlide(index)
                handleInteraction()
              }}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

