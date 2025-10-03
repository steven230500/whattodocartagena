"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayerToggle } from "@/components/map/layer-toggle"
import { MapFilters } from "@/components/map/map-filters"
import { PoiMarker } from "@/components/map/poi-marker"
import {
  MapPin,
  Clock,
  Utensils,
  Music,
  Camera,
  Star,
  Navigation,
  Info,
  Heart,
  Crown,
  Anchor,
  Building,
  Store,
  ShoppingBag,
} from "lucide-react"
import { MAP_LAYERS } from "@/lib/map/layers"
import { commerces } from "@/lib/data/commerces"

const mapPoints = {
  historic: [
    {
      id: 1,
      name: "Murallas de Cartagena",
      description: "Imponentes fortificaciones coloniales que protegieron la ciudad durante siglos",
      category: "Fortificación",
      rating: 4.9,
      coordinates: { x: 45, y: 35 },
      icon: Building,
      image: "/cartagena-colonial-walls-construction-fortress.jpg",
      details: "Construidas entre 1586 y 1741, estas murallas son Patrimonio de la Humanidad.",
      type: "historic",
    },
    {
      id: 2,
      name: "Castillo San Felipe",
      description: "La fortaleza más grande construida por España en América",
      category: "Fortaleza",
      rating: 4.8,
      coordinates: { x: 65, y: 25 },
      icon: Crown,
      image: "/san-felipe-castle-fortress-cartagena-military-ar.jpg",
      details: "Obra maestra de ingeniería militar del siglo XVII.",
      type: "historic",
    },
    {
      id: 3,
      name: "Plaza de Armas",
      description: "Corazón histórico de la ciudad amurallada",
      category: "Plaza",
      rating: 4.7,
      coordinates: { x: 50, y: 45 },
      icon: MapPin,
      image: "/placeholder.svg?key=plazaarmas",
      details: "Centro neurálgico de la vida colonial y republicana.",
      type: "historic",
    },
    {
      id: 4,
      name: "Puerto de las Bóvedas",
      description: "Antiguas bóvedas convertidas en centro comercial artesanal",
      category: "Comercio",
      rating: 4.5,
      coordinates: { x: 40, y: 55 },
      icon: Anchor,
      image: "/placeholder.svg?key=bovedas",
      details: "Espacios que sirvieron como almacenes y cárceles coloniales.",
      type: "historic",
    },
  ],
  food: [
    {
      id: 5,
      name: "La Cevichería",
      description: "El mejor ceviche de Cartagena en el corazón de la ciudad",
      category: "Mariscos",
      rating: 4.9,
      coordinates: { x: 48, y: 42 },
      icon: Utensils,
      image: "/traditional-ceviche-restaurant-cartagena.jpg",
      details: "Famoso por su ceviche de camarón y pescado fresco del Caribe.",
      type: "food",
    },
    {
      id: 6,
      name: "Restaurante 1621",
      description: "Alta cocina caribeña en ambiente colonial",
      category: "Gourmet",
      rating: 4.8,
      coordinates: { x: 52, y: 38 },
      icon: Star,
      image: "/placeholder.svg?key=restaurant1621",
      details: "Fusión de ingredientes locales con técnicas culinarias modernas.",
      type: "food",
    },
    {
      id: 7,
      name: "Portal de los Dulces",
      description: "Tradicionales dulces cartageneros desde 1950",
      category: "Dulces",
      rating: 4.6,
      coordinates: { x: 46, y: 48 },
      icon: Heart,
      image: "/placeholder.svg?key=portaldulces",
      details: "Cocadas, alegrías y dulces típicos de la región Caribe.",
      type: "food",
    },
  ],
  culture: [
    {
      id: 8,
      name: "Teatro Heredia",
      description: "Principal escenario cultural de la ciudad",
      category: "Teatro",
      rating: 4.7,
      coordinates: { x: 49, y: 40 },
      icon: Music,
      image: "/placeholder.svg?key=teatroheredia",
      details: "Sede del Festival Internacional de Música de Cartagena.",
      type: "culture",
    },
    {
      id: 9,
      name: "Museo del Oro Zenú",
      description: "Tesoros precolombinos de la cultura Zenú",
      category: "Museo",
      rating: 4.6,
      coordinates: { x: 47, y: 44 },
      icon: Crown,
      image: "/placeholder.svg?key=museooro",
      details: "Colección de orfebrería indígena más importante del Caribe.",
      type: "culture",
    },
  ],
  photo: [
    {
      id: 10,
      name: "Balcones de la Calle del Arsenal",
      description: "Icónicos balcones coloniales con flores",
      category: "Arquitectura",
      rating: 4.8,
      coordinates: { x: 44, y: 41 },
      icon: Camera,
      image: "/placeholder.svg?key=balcones",
      details: "Los balcones más fotografiados de Cartagena.",
      type: "photo",
    },
    {
      id: 11,
      name: "Atardecer desde las Murallas",
      description: "Vista panorámica del mar Caribe al atardecer",
      category: "Paisaje",
      rating: 4.9,
      coordinates: { x: 38, y: 50 },
      icon: Camera,
      image: "/cartagena-walls-sunset-caribbean-sea-golden-hour.jpg",
      details: "El mejor spot para capturar la puesta de sol caribeña.",
      type: "photo",
    },
  ],
  commerce: commerces.map((commerce, index) => ({
    id: 100 + index,
    name: commerce.name,
    description: commerce.description,
    category: commerce.type,
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    coordinates: {
      x: 40 + Math.random() * 20, // Random position in map area
      y: 35 + Math.random() * 20,
    },
    icon:
      commerce.type === "artisan"
        ? ShoppingBag
        : commerce.type === "food"
          ? Utensils
          : commerce.type === "mall"
            ? Store
            : ShoppingBag,
    image: commerce.image,
    details: commerce.content || commerce.description,
    type: "commerce",
    commerceData: commerce,
  })),
  mall: commerces
    .filter((c) => c.type === "mall")
    .map((commerce, index) => ({
      id: 200 + index,
      name: commerce.name,
      description: commerce.description,
      category: "Centro Comercial",
      rating: 4.6 + Math.random() * 0.4,
      coordinates: {
        x: 45 + Math.random() * 15,
        y: 40 + Math.random() * 15,
      },
      icon: Store,
      image: commerce.image,
      details: commerce.content || commerce.description,
      type: "mall",
      commerceData: commerce,
    })),
}

export function InteractiveMap() {
  const [activeLayers, setActiveLayers] = useState(["historic", "food", "culture"])
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [filters, setFilters] = useState({
    type: "all",
    subtype: "all",
    neighborhood: "all",
    openNow: false,
  })

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const getVisiblePoints = () => {
    let points = activeLayers.flatMap((layerId) => mapPoints[layerId as keyof typeof mapPoints] || [])

    if (filters.type !== "all") {
      points = points.filter(
        (point) =>
          point.commerceData?.type === filters.type ||
          point.category?.toLowerCase().includes(filters.type.toLowerCase()),
      )
    }

    if (filters.subtype !== "all") {
      points = points.filter((point) => point.commerceData?.subtype === filters.subtype)
    }

    if (filters.neighborhood !== "all") {
      points = points.filter((point) => point.commerceData?.barrio === filters.neighborhood)
    }

    return points
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Layer Controls */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">Capas del Mapa</h2>
          <LayerToggle
            layers={MAP_LAYERS.map((layer) => ({
              ...layer,
              active: activeLayers.includes(layer.id),
            }))}
            onToggle={toggleLayer}
          />
        </div>

        <div className="mb-8">
          <MapFilters onFilterChange={handleFilterChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-96 lg:h-[600px] bg-caribbean-blue/10">
                {/* Map Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{
                    backgroundImage: `url('/stylized-map-of-cartagena-historic-center-with-str.jpg')`,
                  }}
                />

                {/* Map Points */}
                {getVisiblePoints().map((point) => (
                  <PoiMarker
                    key={point.id}
                    point={point}
                    onClick={() => setSelectedPoint(point)}
                    layerColor={MAP_LAYERS.find((l) => l.id === point.type)?.color || "#F97360"}
                  />
                ))}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
                  <div className="space-y-2">
                    {MAP_LAYERS.filter((layer) => activeLayers.includes(layer.id)).map((layer) => (
                      <div key={layer.id} className="flex items-center space-x-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span>{layer.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="bg-white/95 backdrop-blur-sm">
                    <Navigation className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/95 backdrop-blur-sm">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Point Details Sidebar */}
          <div className="space-y-6">
            {selectedPoint ? (
              <Card className="border-0 shadow-xl">
                <div className="relative h-48">
                  <img
                    src={selectedPoint.image || "/placeholder.svg"}
                    alt={selectedPoint.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {selectedPoint.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-serif text-xl">{selectedPoint.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedPoint.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">{selectedPoint.description}</p>
                  <p className="text-sm text-muted-foreground mb-6">{selectedPoint.details}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-coral hover:bg-coral-dark text-white flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Ir Aquí
                    </Button>
                    {selectedPoint.commerceData ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => window.open(`/comercios/${selectedPoint.commerceData.slug}`, "_blank")}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Ver Comercio
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Info className="w-4 h-4 mr-2" />
                        Más Info
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Explora el Mapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Selecciona las capas que quieres ver y haz clic en los puntos del mapa para descubrir más
                    información.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-coral" />
                      <span>Sitios históricos y patrimonio</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Utensils className="w-4 h-4 text-colonial-gold" />
                      <span>Restaurantes y gastronomía local</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Music className="w-4 h-4 text-caribbean-blue" />
                      <span>Espacios culturales y música</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Camera className="w-4 h-4 text-forest" />
                      <span>Mejores spots fotográficos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Store className="w-4 h-4 text-forest-light" />
                      <span>Centros comerciales</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ShoppingBag className="w-4 h-4 text-colonial-gold" />
                      <span>Comercios locales</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-coral">{getVisiblePoints().length}</div>
                    <div className="text-xs text-muted-foreground">Puntos Visibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-caribbean-blue">25</div>
                    <div className="text-xs text-muted-foreground">Rutas Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-colonial-gold">500+</div>
                    <div className="text-xs text-muted-foreground">Años de Historia</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-forest">4.8</div>
                    <div className="text-xs text-muted-foreground">Rating Promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
