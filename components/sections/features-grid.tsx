import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Headphones, Users, Camera } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Línea de Tiempo Interactiva",
    description: "Viaja a través de 500 años de historia desde la fundación hasta hoy",
    color: "bg-coral-gradient",
  },
  {
    icon: MapPin,
    title: "Mapas con Capas Históricas",
    description: "Explora diferentes épocas y descubre cómo cambió la ciudad",
    color: "bg-caribbean-gradient",
  },
  {
    icon: Headphones,
    title: "Audio Guías Inmersivas",
    description: "Escucha relatos narrados por locales y expertos en historia",
    color: "bg-colonial-gradient",
  },
  // {
  //   icon: Trophy,
  //   title: "Coleccionables por Barrio",
  //   description: "Desbloquea insignias y descubre secretos de cada sector",
  //   color: "bg-forest text-white",
  // },
  {
    icon: Users,
    title: "Historias de Palenque",
    description: "Conoce la herencia afrodescendiente y la lucha por la libertad",
    color: "bg-coral-gradient",
  },
  {
    icon: Camera,
    title: "Realidad Aumentada",
    description: "Ve cómo lucían los lugares históricos en diferentes épocas",
    color: "bg-caribbean-gradient",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Una experiencia completa</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Combina tecnología moderna con narrativas auténticas para crear la guía cultural más completa de Cartagena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card">
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
