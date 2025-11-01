import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Download, Compass } from "lucide-react"

export function CallToAction() {
  return (
    <section className="py-20 bg-coral-gradient text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url('/colonial-pattern-geometric.jpg')`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Lleva Cartagena contigo</h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto text-pretty">
            Descarga la experiencia completa y explora la ciudad a tu ritmo, incluso sin conexión a internet.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Smartphone className="w-8 h-8 mx-auto mb-4 text-white" />
                <h3 className="font-semibold mb-2">Experiencia Móvil</h3>
                <p className="text-sm text-white/80">Diseñada para funcionar perfectamente en dispositivos móviles</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 mx-auto mb-4 text-white" />
                <h3 className="font-semibold mb-2">Modo Offline</h3>
                <p className="text-sm text-white/80">Accede al contenido sin internet</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Compass className="w-8 h-8 mx-auto mb-4 text-white" />
                <h3 className="font-semibold mb-2">GPS Integrado</h3>
                <p className="text-sm text-white/80">Navegación precisa por la ciudad</p>
              </CardContent>
            </Card>
          </div>

          <div className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full">
            <span className="text-2xl font-bold text-white">Próximamente</span>
          </div>
        </div>
      </div>
    </section>
  )
}
