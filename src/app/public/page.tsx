import { Carousel } from "@/components/ui/carousel"
import Image from "next/image"

import { Mision,Vision, Valores } from "@/constants/data"


export default function Home() {
  return (
    <main>
      {/* Banner Carrusel */}
      <Carousel />
      {/* Sección de Misión - Texto a la izquierda, imagen a la derecha */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Texto de la Misión */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-2">{Mision.title}</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-lg font-thin mb-4">
                {Mision.title}
              </p>
              <p className="text-lg font-thin">
               {Mision.texto}
              </p>
            </div>

            {/* Imagen de la Misión */}
            <div className="order-1 md:order-2">
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={Mision.image}
                  alt={Mision.texto}
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
                  src={Vision.image}
                  alt={Vision.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Texto de la Visión */}
            <div>
              <h2 className="text-3xl font-bold mb-2">{Vision.title}</h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-lg font-thin mb-4">
              {Vision.texto}
              </p>
              <p className="text-lg font-thin">
              {Vision.texto}
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
          {Valores.map((valor, index) => (
            <div key={index} className="p-6 rounded-lg shadow-md text-center">
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
              <p className="font-thin">{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </main>
  )
}

