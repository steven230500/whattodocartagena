import { MapPin, Clock, Headphones, Users, Camera } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Línea de Tiempo Interactiva",
    description: "Viaja a través de 500 años de historia desde la fundación hasta hoy.",
  },
  {
    icon: MapPin,
    title: "Mapas con Capas Históricas",
    description: "Explora diferentes épocas y descubre cómo cambió la ciudad.",
  },
  {
    icon: Headphones,
    title: "Audio Guías Inmersivas",
    description: "Escucha relatos narrados por locales y expertos en historia.",
  },
  {
    icon: Users,
    title: "Historias de Palenque",
    description: "Conoce la herencia afrodescendiente y la lucha por la libertad.",
  },
  {
    icon: Camera,
    title: "Realidad Aumentada",
    description: "Ve cómo lucían los lugares históricos en diferentes épocas.",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Una experiencia completa</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Tecnología moderna con narrativas auténticas, para la guía cultural más completa de Cartagena.
          </p>
        </div>

        <div className="max-w-4xl divide-y divide-border border-t border-border">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex items-start gap-6 py-6">
                <Icon className="w-6 h-6 text-coral mt-1 shrink-0" />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
