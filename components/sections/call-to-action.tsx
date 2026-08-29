import { Smartphone, Download, Compass } from "lucide-react"
import { RampartDivider } from "@/components/ui/rampart-divider"

const appFeatures = [
  { icon: Smartphone, title: "Experiencia Móvil", description: "Diseñada para funcionar perfectamente en dispositivos móviles" },
  { icon: Download, title: "Modo Offline", description: "Accede al contenido sin internet" },
  { icon: Compass, title: "GPS Integrado", description: "Navegación precisa por la ciudad" },
]

export function CallToAction() {
  return (
    <section className="relative">
      <RampartDivider color="var(--color-coral)" />
      <div className="py-20 bg-coral text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Lleva Cartagena contigo</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto text-pretty">
              Descarga la experiencia completa y explora la ciudad a tu ritmo, incluso sin conexión a internet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {appFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="border-t border-white/25 pt-6 text-left">
                    <Icon className="w-6 h-6 mb-3 text-white" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="inline-flex items-center justify-center px-8 py-3 border border-white/40 rounded-full">
              <span className="text-lg font-semibold text-white">Próximamente</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
