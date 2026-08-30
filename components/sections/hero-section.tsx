"use client"

import { Button } from "@/components/ui/button"
import { RampartDivider } from "@/components/ui/rampart-divider"
import { Compass, Calendar, Church } from "lucide-react"

interface HeroSectionProps {
  routeCount: number
}

export function HeroSection({ routeCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cartagena-de-indias-colonial-walls-sunset-caribbea.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/10" />
      </div>

      {/* Content — alineado a la izquierda, no centrado */}
      <div className="relative z-10 container mx-auto px-4 pb-16 pt-32 text-white">
        <div className="max-w-3xl">
          <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-colonial-gold mb-4">
            Ciudad Heroica · Patrimonio de la Humanidad
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
            Cartagena
            <span className="block text-2xl md:text-4xl font-sans font-normal text-white/90 mt-2">
              como nunca antes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-6 max-w-xl text-pretty">
            Una experiencia interactiva a través de 500 años de historia, cultura y tradiciones caribeñas.
          </p>

          <p className="text-sm text-white/60 mb-10">
            500+ años de historia · {routeCount} rutas interactivas · Patrimonio UNESCO
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg" asChild>
              <a href="/routes">
                <Compass className="w-5 h-5 mr-2" />
                Comenzar Exploración
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              asChild
            >
              <a href="/plans">
                <Calendar className="w-5 h-5 mr-2" />
                Ver Planes
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              asChild
            >
              <a href="/masses">
                <Church className="w-5 h-5 mr-2" />
                Horarios de Misas
              </a>
            </Button>
          </div>
        </div>
      </div>

      <RampartDivider className="relative z-10" color="var(--color-coral)" />
    </section>
  )
}
