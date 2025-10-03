import { Header } from "@/components/navigation/header"

export default function GuiaImplementacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-cartagena-primary mb-8">
            Guía de Implementación - Nuevos Componentes
          </h1>

          {/* Collectible Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">CollectibleCard</h2>
            <p className="text-gray-600 mb-4">
              Componente para mostrar elementos coleccionables del juego con estado de colección.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { CollectibleCard } from "@/components/cards/collectible-card"

<CollectibleCard
  name="Escudo de Cartagena"
  description="Símbolo oficial de la ciudad"
  image="/placeholder.svg?key=example"
  rarity="Común" // "Común" | "Raro" | "Épico" | "Legendario"
  category="Símbolos"
  isCollected={true}
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> En páginas de coleccionables, logros, o sistemas de gamificación.
            </p>
          </section>

          {/* Route Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">RouteCard</h2>
            <p className="text-gray-600 mb-4">Componente para mostrar rutas turísticas con información detallada.</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { RouteCard } from "@/components/cards/route-card"

<RouteCard
  title="Ruta Colonial"
  description="Descubre la arquitectura colonial"
  duration="2-3 horas"
  difficulty="Fácil" // "Fácil" | "Moderado" | "Difícil"
  distance="3.2 km"
  highlights={["Plaza de Armas", "Catedral"]}
  image="/placeholder.svg?key=example"
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> En páginas de rutas, planificación de viajes, o recomendaciones.
            </p>
          </section>

          {/* Neighborhood Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">NeighborhoodCard</h2>
            <p className="text-gray-600 mb-4">
              Componente para mostrar información de barrios con atracciones principales.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { NeighborhoodCard } from "@/components/cards/neighborhood-card"

<NeighborhoodCard
  name="Ciudad Amurallada"
  description="El corazón histórico de Cartagena"
  image="/placeholder.svg?key=example"
  attractions={["Plaza de Armas", "Catedral"]}
  difficulty="Fácil"
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> En páginas de exploración, guías de barrios, o mapas interactivos.
            </p>
          </section>

          {/* Stats Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">StatsCard</h2>
            <p className="text-gray-600 mb-4">Componente para mostrar estadísticas y métricas importantes.</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { StatsCard } from "@/components/ui/stats-card"
import { MapPin } from 'lucide-react'

<StatsCard
  title="Lugares Visitados"
  value="47"
  subtitle="de 120 disponibles"
  icon={MapPin} // Icono de Lucide React
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> En dashboards, perfiles de usuario, o páginas de progreso.
            </p>
          </section>

          {/* Feature Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">FeatureCard</h2>
            <p className="text-gray-600 mb-4">Componente para destacar características y funcionalidades de la app.</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { FeatureCard } from "@/components/ui/feature-card"
import { Search } from 'lucide-react'

<FeatureCard
  title="Realidad Aumentada"
  description="Descubre la historia a través de AR"
  icon={Search}
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> En páginas de inicio, secciones de características, o onboarding.
            </p>
          </section>

          {/* Info Card */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">InfoCard</h2>
            <p className="text-gray-600 mb-4">
              Componente versátil para mostrar información con diferentes tipos visuales.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto">
                {`import { InfoCard } from "@/components/ui/info-card"

<InfoCard
  title="Consejos de Viaje"
  content="La mejor época para visitar..."
  type="tip" // "info" | "tip" | "warning" | "success"
/>`}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Uso:</strong> Para consejos, alertas, información contextual, o notificaciones.
            </p>
          </section>

          {/* Integration Examples */}
          <section className="mb-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">Ejemplos de Integración</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">En una página de coleccionables:</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// app/collectibles/page.tsx
import { CollectibleCard } from "@/components/cards/collectible-card"

const collectibles = [
  { name: "Escudo", rarity: "Común", isCollected: true },
  // ... más coleccionables
]

return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {collectibles.map(item => (
      <CollectibleCard key={item.name} {...item} />
    ))}
  </div>
)`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">En un dashboard de usuario:</h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// components/user-dashboard.tsx
import { StatsCard } from "@/components/ui/stats-card"
import { MapPin, User, Trophy } from 'lucide-react'

return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatsCard title="Lugares" value="47" icon={MapPin} />
    <StatsCard title="Rutas" value="8" icon={User} />
    <StatsCard title="Logros" value="23" icon={Trophy} />
  </div>
)`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Access Instructions */}
          <section className="bg-cartagena-primary/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-cartagena-primary mb-4">Cómo Acceder</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="bg-cartagena-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <p>
                  <strong>Página de Demostración:</strong> Visita{" "}
                  <code className="bg-white px-2 py-1 rounded">/demo-features</code> para ver todos los componentes en
                  acción
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-cartagena-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <p>
                  <strong>Navegación:</strong> Usa el enlace "Nuevos Features" en el menú principal
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-cartagena-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <p>
                  <strong>Implementación:</strong> Importa los componentes desde{" "}
                  <code className="bg-white px-2 py-1 rounded">@/components/cards/</code> o{" "}
                  <code className="bg-white px-2 py-1 rounded">@/components/ui/</code>
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-cartagena-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <p>
                  <strong>Personalización:</strong> Todos los componentes aceptan props para personalizar contenido,
                  estilos y comportamiento
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
