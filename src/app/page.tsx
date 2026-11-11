"use client"

import { useEffect, useState } from "react"
import { Carousel } from "@/components/ui/carousel"
import Image from "next/image"
import * as LucideIcons from "lucide-react"
import { fetchContenidos } from "@/services/contenido"
import { API_URL } from "@/constants/Api"

export default function Home() {
  const [mision, setMision] = useState<any>(null)
  const [vision, setVision] = useState<any>(null)
  const [valores, setValores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [misionArr, visionArr, valoresArr] = await Promise.all([
        fetchContenidos({ tipo: "mision" }),
        fetchContenidos({ tipo: "vision" }),
        fetchContenidos({ tipo: "valores" }),
      ])
      setMision(misionArr[0] || null)
      setVision(visionArr[0] || null)
      setValores(valoresArr || [])
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return null // O un loader/spinner

  return (
    <main>
      {/* Banner Carrusel */}
      <Carousel />

      {/* Sección de Misión */}
      {mision && (
        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Texto de la Misión */}
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-2">{mision.titulo}</h2>
                <div className="w-20 h-1 bg-primary mb-6"></div>
                <p className="text-lg font-thin mb-4">{mision.titulo}</p>
                <p className="text-lg font-thin">{mision.texto}</p>
              </div>
              {/* Imagen de la Misión */}
              <div className="order-1 md:order-2">
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
                  {mision.imagen && (
                    <img
                      src={`${API_URL}/uploads/contenido/${mision.imagen}`}
                      alt={mision.titulo}
                      className="object-cover w-full h-full"
                      style={{ maxHeight: 400, borderRadius: '0.5rem' }}
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
        <section className="py-16 ">
          <div className="container mx-auto px-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Imagen de la Visión */}
              <div>
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
                  {vision.imagen && (
                    <img
                      src={`${API_URL}/uploads/contenido/${vision.imagen}`}
                      alt={vision.titulo}
                      className="object-cover w-full h-full"
                      style={{ maxHeight: 400, borderRadius: '0.5rem' }}
                    />
                  )}
                </div>
              </div>
              {/* Texto de la Visión */}
              <div>
                <h2 className="text-3xl font-bold mb-2">{vision.titulo}</h2>
                <div className="w-20 h-1 bg-primary mb-6"></div>
                <p className="text-lg font-thin mb-4">{vision.texto}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección de Valores */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Nuestros Valores</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {valores.map((valor, index) => (
              <div key={index} className="p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {valor.imagen ? (
                    <img
                      src={`${API_URL}/uploads/contenido/${valor.imagen}`}
                      alt={valor.titulo}
                      className="h-10 w-10 object-contain mx-auto"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin icono</span>
                  )}
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

