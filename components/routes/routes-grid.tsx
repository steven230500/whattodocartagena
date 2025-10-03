"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Headphones, Star, Users, Navigation, Play, Heart } from "lucide-react"

const walkingRoutes = [
  {
    id: 1,
    title: "Centro Histórico Esencial",
    description: "Recorre los sitios más emblemáticos de la ciudad amurallada",
    duration: "2-3 horas",
    distance: "3.2 km",
    difficulty: "Fácil",
    rating: 4.9,
    reviews: 1247,
    image: "/cartagena-historic-center-walking-tour-colonial-arc.jpg",
    category: "Historia",
    color: "bg-coral",
    highlights: ["Plaza de Armas", "Catedral", "Murallas", "Balcones Coloniales"],
    audioGuide: true,
    offline: true,
    price: "Gratis",
  },
  {
    id: 2,
    title: "Sabores del Caribe",
    description: "Degusta la auténtica gastronomía cartagenera",
    duration: "3-4 horas",
    distance: "2.8 km",
    difficulty: "Fácil",
    rating: 4.8,
    reviews: 892,
    image: "/cartagena-food-tour-street-vendors-tropical-fruits.jpg",
    category: "Gastronomía",
    color: "bg-colonial-gold",
    highlights: ["Mercado Bazurto", "Portal de los Dulces", "Cevichería", "Café del Mar"],
    audioGuide: true,
    offline: true,
    price: "$25 USD",
  },
  {
    id: 3,
    title: "Palenque y Libertad",
    description: "Conoce la herencia afrodescendiente y la lucha por la libertad",
    duration: "2.5 horas",
    distance: "2.1 km",
    difficulty: "Fácil",
    rating: 4.7,
    reviews: 634,
    image: "/palenque-afro-heritage-cartagena-cultural-tour.jpg",
    category: "Cultura",
    color: "bg-forest",
    highlights: ["Monumento a la India Catalina", "Barrio San Diego", "Casa de la Cultura", "Plaza de la Trinidad"],
    audioGuide: true,
    offline: true,
    price: "Gratis",
  },
  {
    id: 4,
    title: "Murallas al Atardecer",
    description: "Camina por las fortificaciones mientras el sol se oculta en el Caribe",
    duration: "1.5 horas",
    distance: "4.5 km",
    difficulty: "Moderado",
    rating: 4.9,
    reviews: 1089,
    image: "/cartagena-walls-sunset-caribbean-sea-golden-hour.jpg",
    category: "Paisaje",
    color: "bg-caribbean-blue",
    highlights: ["Baluarte de San Francisco", "Café del Mar", "Baluarte de Santa Catalina", "Plaza de los Coches"],
    audioGuide: true,
    offline: true,
    price: "Gratis",
  },
  {
    id: 5,
    title: "Getsemaní Bohemio",
    description: "Explora el barrio más vibrante y artístico de Cartagena",
    duration: "2 horas",
    distance: "1.8 km",
    difficulty: "Fácil",
    rating: 4.6,
    reviews: 756,
    image: "/getzemani-street-art-colorful-murals-bohemian-qu.jpg",
    category: "Arte",
    color: "bg-coral",
    highlights: ["Plaza de la Trinidad", "Calle del Arsenal", "Murales Urbanos", "Bares Locales"],
    audioGuide: true,
    offline: true,
    price: "Gratis",
  },
  {
    id: 6,
    title: "Castillo San Felipe",
    description: "Descubre la fortaleza más imponente de América",
    duration: "1.5 horas",
    distance: "1.2 km",
    difficulty: "Moderado",
    rating: 4.8,
    reviews: 923,
    image: "/san-felipe-castle-fortress-cartagena-military-ar.jpg",
    category: "Fortaleza",
    color: "bg-caribbean-blue",
    highlights: ["Túneles Subterráneos", "Cañones Históricos", "Vista Panorámica", "Museo Militar"],
    audioGuide: true,
    offline: true,
    price: "$8 USD",
  },
]

const categories = ["Todos", "Historia", "Gastronomía", "Cultura", "Paisaje", "Arte", "Fortaleza"]

export function RoutesGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  const filteredRoutes =
    selectedCategory === "Todos" ? walkingRoutes : walkingRoutes.filter((route) => route.category === selectedCategory)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">Rutas Disponibles</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category ? "bg-coral text-white hover:bg-coral-dark" : "bg-transparent"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              {/* Route Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image || "/placeholder.svg"}
                  alt={route.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${route.color} text-white border-0`}>{route.price}</Badge>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {route.category}
                  </Badge>
                </div>

                {/* Audio Guide Indicator */}
                {route.audioGuide && (
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Headphones className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">Audio</span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="font-serif text-xl group-hover:text-coral transition-colors">
                    {route.title}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{route.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-pretty">{route.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Route Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">{route.duration}</div>
                  </div>
                  <div>
                    <MapPin className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">{route.distance}</div>
                  </div>
                  <div>
                    <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">{route.reviews}</div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Puntos Destacados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {route.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-transparent">
                        {highlight}
                      </Badge>
                    ))}
                    {route.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-transparent">
                        +{route.highlights.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className={`${route.color} text-white hover:opacity-90 flex-1`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Route Detail Modal/Section */}
        {selectedRoute && (
          <Card className="border-0 shadow-2xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Route Image */}
              <div className="relative h-64 lg:h-96">
                <img
                  src={selectedRoute.image || "/placeholder.svg"}
                  alt={selectedRoute.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Close Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
                  onClick={() => setSelectedRoute(null)}
                >
                  ✕
                </Button>
              </div>

              {/* Route Details */}
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className={`${selectedRoute.color} text-white border-0`}>{selectedRoute.category}</Badge>
                  <Badge variant="outline" className="bg-transparent">
                    {selectedRoute.difficulty}
                  </Badge>
                </div>

                <h3 className="font-serif text-3xl font-bold text-foreground mb-4">{selectedRoute.title}</h3>

                <p className="text-lg text-muted-foreground mb-6 text-pretty">{selectedRoute.description}</p>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-coral" />
                    <div>
                      <div className="font-medium">Duración</div>
                      <div className="text-sm text-muted-foreground">{selectedRoute.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-caribbean-blue" />
                    <div>
                      <div className="font-medium">Distancia</div>
                      <div className="text-sm text-muted-foreground">{selectedRoute.distance}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="font-medium">Rating</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedRoute.rating} ({selectedRoute.reviews} reseñas)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Headphones className="w-5 h-5 text-colonial-gold" />
                    <div>
                      <div className="font-medium">Audio Guía</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedRoute.audioGuide ? "Disponible" : "No disponible"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Todos los Puntos de Interés:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoute.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button size="lg" className={`${selectedRoute.color} text-white hover:opacity-90 flex-1`}>
                    <Navigation className="w-5 h-5 mr-2" />
                    Comenzar Ruta
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent">
                    <MapPin className="w-5 h-5 mr-2" />
                    Ver en Mapa
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-coral-gradient text-white border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold mb-4">¿Listo para explorar?</h3>
              <p className="text-white/90 mb-6">
                Descarga la app para acceder a todas las rutas offline y con navegación GPS integrada.
              </p>
              <Button size="lg" className="bg-white text-coral hover:bg-white/90">
                <Play className="w-5 h-5 mr-2" />
                Descargar App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
