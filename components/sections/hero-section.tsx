"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Compass, Calendar, Church } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cartagena-de-indias-colonial-walls-sunset-caribbea.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium">Ciudad Heroica • Patrimonio de la Humanidad</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
            Descubre
            <span className="block text-coral animate-float">Cartagena</span>
            <span className="block text-2xl md:text-4xl font-sans font-normal text-white/90">como nunca antes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">
            Una experiencia interactiva que te lleva a través de 500 años de historia, cultura y tradiciones caribeñas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg" asChild>
              <a href="/rutas">
                <Compass className="w-5 h-5 mr-2" />
                Comenzar Exploración
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-caribbean-blue hover:bg-caribbean-blue/90 text-white px-8 py-4 text-lg"
              asChild
            >
              <a href="/planes">
                <Calendar className="w-5 h-5 mr-2" />
                Ver Planes
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              asChild
            >
              <a href="/misas">
                <Church className="w-5 h-5 mr-2" />
                Horarios de Misas
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-coral mb-1">500+</div>
              <div className="text-sm text-white/70">Años de Historia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-caribbean-blue mb-1">15</div>
              <div className="text-sm text-white/70">Rutas Interactivas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-colonial-gold mb-1">30+</div>
              <div className="text-sm text-white/70">Planes Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-light mb-1">12</div>
              <div className="text-sm text-white/70">Iglesias Activas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
