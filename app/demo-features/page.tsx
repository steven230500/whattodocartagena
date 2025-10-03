"use client"

import { CollectibleCard } from "@/components/cards/collectible-card"
import { RouteCard } from "@/components/cards/route-card"
import { NeighborhoodCard } from "@/components/cards/neighborhood-card"
import { StatsCard } from "@/components/ui/stats-card"
import { FeatureCard } from "@/components/ui/feature-card"
import { InfoCard } from "@/components/ui/info-card"
import { Header } from "@/components/navigation/header"
import { MapPin, Trophy, User, Search, Headphones, Map, Building, Palette, Waves } from "lucide-react"

export default function DemoFeaturesPage() {
  const collectibleItems = [
    {
      id: 1,
      name: "Escudo de Cartagena",
      description: "Símbolo oficial de la ciudad",
      rarity: "Común" as const,
      found: true,
      location: "Plaza de Armas",
      xp: 50,
    },
    {
      id: 2,
      name: "Puerta del Reloj",
      description: "Icónica entrada a la ciudad amurallada",
      rarity: "Raro" as const,
      found: true,
      location: "Centro Histórico",
      xp: 100,
    },
    {
      id: 3,
      name: "Palenquera",
      description: "Símbolo cultural de Cartagena",
      rarity: "Épico" as const,
      found: false,
      location: "Plaza Santo Domingo",
      xp: 200,
    },
    {
      id: 4,
      name: "Castillo San Felipe",
      description: "Fortaleza histórica de la ciudad",
      rarity: "Legendario" as const,
      found: false,
      location: "Cerro de San Lázaro",
      xp: 500,
    },
  ]

  const neighborhoods = [
    {
      id: "ciudad-amurallada",
      name: "Ciudad Amurallada",
      description: "El corazón histórico de Cartagena con arquitectura colonial",
      color: "bg-amber-500",
      icon: Building,
      progress: 75,
      totalItems: 12,
      foundItems: 9,
      image: "/cartagena-walled-city-colonial-architecture.jpg",
    },
    {
      id: "getsemani",
      name: "Getsemaní",
      description: "Barrio bohemio lleno de arte callejero y vida nocturna",
      color: "bg-purple-500",
      icon: Palette,
      progress: 60,
      totalItems: 8,
      foundItems: 5,
      image: "/getsemani-street-art-colorful-buildings.jpg",
    },
    {
      id: "bocagrande",
      name: "Bocagrande",
      description: "Zona moderna con playas y rascacielos",
      color: "bg-blue-500",
      icon: Waves,
      progress: 40,
      totalItems: 10,
      foundItems: 4,
      image: "/bocagrande-modern-buildings-beach.jpg",
    },
  ]

  const routes = [
    {
      id: 1,
      title: "Ruta Colonial",
      description: "Descubre la arquitectura colonial de Cartagena",
      duration: "2-3 horas",
      difficulty: "Fácil",
      distance: "3.2 km",
      rating: 4.8,
      reviews: 124,
      image: "/cartagena-colonial-route-historic-buildings.jpg",
      category: "Historia",
      color: "bg-amber-500",
      highlights: ["Plaza de Armas", "Catedral", "Casa del Marqués"],
      audioGuide: true,
      offline: true,
      price: "Gratis",
    },
    {
      id: 2,
      title: "Ruta de las Murallas",
      description: "Camina por las históricas murallas de la ciudad",
      duration: "1.5-2 horas",
      difficulty: "Moderado",
      distance: "2.8 km",
      rating: 4.6,
      reviews: 89,
      image: "/cartagena-city-walls-fortifications.jpg",
      category: "Arquitectura",
      color: "bg-stone-600",
      highlights: ["Baluarte Santo Domingo", "Puerta del Reloj", "Las Bóvedas"],
      audioGuide: true,
      offline: false,
      price: "$5",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cartagena-primary mb-4">Nuevos Componentes de Cartagena</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora todos los nuevos componentes de tarjetas disponibles en tu aplicación
          </p>
        </div>

        {/* Stats Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Tarjetas de Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Lugares Visitados" value="47" description="de 120 disponibles" icon={MapPin} />
            <StatsCard title="Coleccionables" value="23" description="encontrados" icon={Trophy} />
            <StatsCard title="Rutas Completadas" value="8" description="de 15 rutas" icon={User} />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Tarjetas de Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Realidad Aumentada"
              description="Descubre la historia de Cartagena a través de experiencias inmersivas"
              icon={Search}
            />
            <FeatureCard
              title="Guías de Audio"
              description="Escucha narraciones expertas mientras exploras la ciudad"
              icon={Headphones}
            />
            <FeatureCard
              title="Mapas Offline"
              description="Navega por Cartagena sin necesidad de conexión a internet"
              icon={Map}
            />
          </div>
        </section>

        {/* Neighborhood Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Barrios de Cartagena</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((neighborhood) => (
              <NeighborhoodCard
                key={neighborhood.id}
                neighborhood={neighborhood}
                onExplore={() => console.log(`Explorando ${neighborhood.name}`)}
              />
            ))}
          </div>
        </section>

        {/* Route Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Rutas Turísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onStart={() => console.log(`Iniciando ${route.title}`)}
                onToggleFavorite={() => console.log(`Toggle favorito para ${route.title}`)}
                isFavorite={false}
              />
            ))}
          </div>
        </section>

        {/* Collectible Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Coleccionables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectibleItems.map((item) => (
              <CollectibleCard
                key={item.id}
                item={item}
                onSearchClue={() => console.log(`Buscando pista para ${item.name}`)}
              />
            ))}
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cartagena-primary mb-6">Información Útil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              title="Consejos de Viaje"
              content="La mejor época para visitar Cartagena es entre diciembre y abril cuando hay menos lluvia. Lleva protector solar y ropa cómoda para caminar."
              badge={{ text: "Consejo", variant: "secondary" }}
              color="bg-blue-500"
            />
            <InfoCard
              title="Historia Rápida"
              content="Cartagena fue fundada en 1533 por Pedro de Heredia. Sus murallas fueron construidas para proteger la ciudad de los ataques piratas."
              badge={{ text: "Historia", variant: "outline" }}
              color="bg-amber-500"
            />
            <InfoCard
              title="¡Atención!"
              content="Algunos sitios históricos tienen horarios limitados. Verifica los horarios de apertura antes de tu visita."
              badge={{ text: "Importante", variant: "destructive" }}
              color="bg-red-500"
            />
            <InfoCard
              title="Gastronomía Local"
              content="No te pierdas el ceviche, las arepas de huevo y el pescado frito. Los jugos naturales son perfectos para el clima tropical."
              badge={{ text: "Gastronomía", variant: "default" }}
              color="bg-green-500"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
