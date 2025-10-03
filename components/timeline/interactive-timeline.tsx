"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Crown, Sword, Flag, Building } from "lucide-react"

const timelineEvents = [
  {
    id: 1,
    year: "1533",
    title: "Fundación de Cartagena",
    subtitle: "Pedro de Heredia establece la ciudad",
    description:
      "El conquistador español Pedro de Heredia funda Cartagena de Indias el 1 de junio de 1533, estableciendo uno de los puertos más importantes del Nuevo Mundo. La ciudad se convierte rápidamente en el principal punto de entrada y salida de riquezas hacia España.",
    image: "/spanish-colonial-founding-cartagena-1533.jpg",
    icon: Crown,
    color: "bg-coral",
    category: "Fundación",
    keyFacts: [
      "Primera ciudad fundada en la costa caribeña colombiana",
      "Nombrada en honor a Cartagena, España",
      "Puerto natural estratégico para el comercio",
    ],
  },
  {
    id: 2,
    year: "1586-1741",
    title: "Construcción de las Murallas",
    subtitle: "Fortificación contra piratas y enemigos",
    description:
      "Durante más de 150 años se construyen las imponentes murallas que rodean la ciudad. Estas fortificaciones, diseñadas por ingenieros militares españoles, protegen Cartagena de los constantes ataques de piratas, corsarios y flotas enemigas.",
    image: "/cartagena-colonial-walls-construction-fortress.jpg",
    icon: Building,
    color: "bg-caribbean-blue",
    category: "Fortificación",
    keyFacts: [
      "Más de 11 kilómetros de murallas",
      "Resistieron múltiples asedios",
      "Obra maestra de ingeniería militar colonial",
    ],
  },
  {
    id: 3,
    year: "1741",
    title: "Sitio de Cartagena",
    subtitle: "Victoria heroica contra los ingleses",
    description:
      "La ciudad resiste heroicamente el asedio de la flota inglesa comandada por Edward Vernon. Blas de Lezo, el almirante español, defiende exitosamente la ciudad en una de las batallas navales más importantes de la historia colonial americana.",
    image: "/placeholder.svg?key=siege1741",
    icon: Sword,
    color: "bg-colonial-gold",
    category: "Defensa",
    keyFacts: [
      "Flota inglesa de 186 navíos derrotada",
      "Blas de Lezo, héroe de la defensa",
      "Victoria que cambió el equilibrio colonial",
    ],
  },
  {
    id: 4,
    year: "1811",
    title: "Independencia - Ciudad Heroica",
    subtitle: "Primera en declarar la independencia",
    description:
      'Cartagena se convierte en la primera ciudad de Colombia en declarar su independencia absoluta de España el 11 de noviembre de 1811. Este acto heroico le otorga el título de "Ciudad Heroica" y marca el inicio de la lucha independentista en la región.',
    image: "/cartagena-independence-1811-heroic-city.jpg",
    icon: Flag,
    color: "bg-forest",
    category: "Independencia",
    keyFacts: [
      "Primera ciudad independiente de Colombia",
      'Título oficial de "Ciudad Heroica"',
      "Cuna de la libertad americana",
    ],
  },
  {
    id: 5,
    year: "1815-1821",
    title: "Sitio de Morillo y Reconquista",
    subtitle: "Resistencia durante la Reconquista española",
    description:
      "Pablo Morillo sitia la ciudad durante 106 días. La población resiste heroicamente hasta que el hambre y las enfermedades obligan a la rendición. Miles de cartageneros mueren defendiendo la libertad, consolidando el espíritu heroico de la ciudad.",
    image: "/placeholder.svg?key=morillo1815",
    icon: Users,
    color: "bg-coral",
    category: "Resistencia",
    keyFacts: [
      "106 días de sitio heroico",
      "Miles de mártires por la libertad",
      "Resistencia que inspiró a toda América",
    ],
  },
  {
    id: 6,
    year: "1984",
    title: "Patrimonio de la Humanidad",
    subtitle: "Reconocimiento mundial UNESCO",
    description:
      "La UNESCO declara el centro histórico de Cartagena como Patrimonio Cultural de la Humanidad, reconociendo su excepcional valor universal. Las murallas, fortificaciones y arquitectura colonial son preservadas para las futuras generaciones.",
    image: "/cartagena-unesco-world-heritage-historic-center.jpg",
    icon: Building,
    color: "bg-caribbean-blue",
    category: "Patrimonio",
    keyFacts: [
      "Reconocimiento mundial UNESCO",
      "Preservación del patrimonio colonial",
      "Destino turístico de clase mundial",
    ],
  },
]

export function InteractiveTimeline() {
  const [activeEvent, setActiveEvent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      setScrollProgress(progress)

      // Update active event based on scroll position
      const eventIndex = Math.floor(progress * timelineEvents.length)
      setActiveEvent(Math.min(eventIndex, timelineEvents.length - 1))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={timelineRef} className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Línea de Tiempo Interactiva
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Navega a través de los momentos más importantes de la historia cartagenera
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {timelineEvents.map((event, index) => (
            <Button
              key={event.id}
              variant={activeEvent === index ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveEvent(index)}
              className={`${activeEvent === index ? event.color + " text-white" : ""}`}
            >
              {event.year}
            </Button>
          ))}
        </div>

        {/* Main Timeline Content */}
        <div className="max-w-6xl mx-auto">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon
            const isActive = activeEvent === index

            return (
              <div
                key={event.id}
                className={`mb-20 transition-all duration-700 ${
                  isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"
                }`}
              >
                <Card className={`overflow-hidden border-0 shadow-2xl ${isActive ? "ring-2 ring-coral/20" : ""}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl ${event.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {event.category}
                          </Badge>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{event.year}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-serif text-3xl font-bold text-foreground mb-2">{event.title}</h3>

                      <p className="text-lg text-coral font-medium mb-4">{event.subtitle}</p>

                      <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{event.description}</p>

                      {/* Key Facts */}
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Datos Clave:</h4>
                        {event.keyFacts.map((fact, factIndex) => (
                          <div key={factIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{fact}</p>
                          </div>
                        ))}
                      </div>

                      <Button className={`${event.color} text-white hover:opacity-90 self-start`}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Ver en el Mapa
                      </Button>
                    </CardContent>

                    {/* Image */}
                    <div className="relative h-64 lg:h-96 order-1 lg:order-2">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      {/* Year Badge */}
                      <div
                        className={`absolute top-4 right-4 ${event.color} text-white px-4 py-2 rounded-full font-bold text-xl`}
                      >
                        {event.year}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Progress Indicator */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="w-1 h-32 bg-muted rounded-full overflow-hidden">
            <div
              className="w-full bg-coral transition-all duration-300 rounded-full"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
