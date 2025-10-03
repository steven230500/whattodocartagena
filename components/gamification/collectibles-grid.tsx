"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Building, Utensils, Music, Heart, Star, Lock, MapPin, Trophy, Gem } from "lucide-react"

const neighborhoods = [
  {
    id: "centro",
    name: "Centro Histórico",
    description: "El corazón colonial de Cartagena",
    color: "bg-coral",
    icon: Crown,
    progress: 85,
    totalItems: 12,
    foundItems: 10,
    image: "/cartagena-historic-center-walking-tour-colonial-arc.jpg",
  },
  {
    id: "getsemani",
    name: "Getsemaní",
    description: "El barrio bohemio y artístico",
    color: "bg-caribbean-blue",
    icon: Music,
    progress: 60,
    totalItems: 8,
    foundItems: 5,
    image: "/getzemani-street-art-colorful-murals-bohemian-qu.jpg",
  },
  {
    id: "san-diego",
    name: "San Diego",
    description: "Elegancia colonial y gastronomía",
    color: "bg-colonial-gold",
    icon: Utensils,
    progress: 40,
    totalItems: 10,
    foundItems: 4,
    image: "/placeholder.svg?key=sandiego",
  },
  {
    id: "bocagrande",
    name: "Bocagrande",
    description: "Modernidad frente al mar",
    color: "bg-forest",
    icon: Building,
    progress: 25,
    totalItems: 6,
    foundItems: 2,
    image: "/placeholder.svg?key=bocagrande",
  },
]

const collectibleTypes = [
  {
    id: "historical",
    name: "Tesoros Históricos",
    icon: Crown,
    color: "bg-coral",
    items: [
      {
        id: 1,
        name: "Moneda Colonial",
        description: "Antigua moneda española del siglo XVII",
        rarity: "Común",
        found: true,
        location: "Plaza de Armas",
        xp: 50,
      },
      {
        id: 2,
        name: "Llave de las Murallas",
        description: "Réplica de las llaves originales de la ciudad",
        rarity: "Raro",
        found: true,
        location: "Baluarte de San Francisco",
        xp: 150,
      },
      {
        id: 3,
        name: "Pergamino de Heredia",
        description: "Documento fundacional de la ciudad",
        rarity: "Épico",
        found: false,
        location: "???",
        xp: 500,
      },
    ],
  },
  {
    id: "cultural",
    name: "Patrimonio Cultural",
    icon: Heart,
    color: "bg-caribbean-blue",
    items: [
      {
        id: 4,
        name: "Tambor Palenquero",
        description: "Instrumento tradicional afrodescendiente",
        rarity: "Raro",
        found: true,
        location: "Plaza de la Trinidad",
        xp: 200,
      },
      {
        id: 5,
        name: "Máscara de Carnaval",
        description: "Máscara tradicional del Carnaval de Barranquilla",
        rarity: "Común",
        found: false,
        location: "Getsemaní",
        xp: 75,
      },
    ],
  },
  {
    id: "gastronomic",
    name: "Delicias Gastronómicas",
    icon: Utensils,
    color: "bg-colonial-gold",
    items: [
      {
        id: 6,
        name: "Receta de Arepa de Huevo",
        description: "Receta secreta de la arepa más famosa",
        rarity: "Común",
        found: true,
        location: "Portal de los Dulces",
        xp: 100,
      },
      {
        id: 7,
        name: "Coco Sagrado",
        description: "Ingrediente místico para las cocadas perfectas",
        rarity: "Épico",
        found: false,
        location: "???",
        xp: 400,
      },
    ],
  },
]

const rarityColors = {
  Común: "bg-gray-500",
  Raro: "bg-blue-500",
  Épico: "bg-purple-500",
  Legendario: "bg-yellow-500",
}

export function CollectiblesGrid() {
  const [selectedTab, setSelectedTab] = useState<"neighborhoods" | "items">("neighborhoods")
  const [selectedType, setSelectedType] = useState("historical")

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted/30 rounded-lg p-1 flex">
            <Button
              variant={selectedTab === "neighborhoods" ? "default" : "ghost"}
              onClick={() => setSelectedTab("neighborhoods")}
              className={selectedTab === "neighborhoods" ? "bg-coral text-white" : ""}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Por Barrio
            </Button>
            <Button
              variant={selectedTab === "items" ? "default" : "ghost"}
              onClick={() => setSelectedTab("items")}
              className={selectedTab === "items" ? "bg-coral text-white" : ""}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Por Categoría
            </Button>
          </div>
        </div>

        {selectedTab === "neighborhoods" ? (
          /* Neighborhoods View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neighborhoods.map((neighborhood) => {
              const Icon = neighborhood.icon
              return (
                <Card key={neighborhood.id} className="group hover:shadow-xl transition-all duration-300 border-0">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={neighborhood.image || "/placeholder.svg"}
                      alt={neighborhood.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-3 right-3 w-8 h-8 ${neighborhood.color} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">{neighborhood.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{neighborhood.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progreso</span>
                          <span>
                            {neighborhood.foundItems}/{neighborhood.totalItems}
                          </span>
                        </div>
                        <Progress value={neighborhood.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${neighborhood.color} text-white border-0`}>
                          {neighborhood.progress}% Completo
                        </Badge>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <MapPin className="w-4 h-4 mr-1" />
                          Explorar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Items View */
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {collectibleTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    onClick={() => setSelectedType(type.id)}
                    className={`${
                      selectedType === type.id ? type.color + " text-white hover:opacity-90" : "bg-transparent"
                    } flex items-center space-x-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.name}</span>
                  </Button>
                )
              })}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectibleTypes
                .find((type) => type.id === selectedType)
                ?.items.map((item) => (
                  <Card
                    key={item.id}
                    className={`border-0 shadow-lg ${
                      item.found ? "opacity-100" : "opacity-60"
                    } hover:shadow-xl transition-all duration-300`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-lg flex items-center space-x-2">
                            {item.found ? (
                              <Gem className="w-5 h-5 text-coral" />
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className={item.found ? "text-foreground" : "text-muted-foreground"}>
                              {item.name}
                            </span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${rarityColors[item.rarity as keyof typeof rarityColors]} text-white border-0`}
                          >
                            {item.rarity}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">{item.xp} XP</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className={item.found ? "text-foreground" : "text-muted-foreground"}>
                            {item.location}
                          </span>
                        </div>

                        {!item.found && (
                          <Button size="sm" className="w-full bg-coral hover:bg-coral-dark text-white">
                            <MapPin className="w-4 h-4 mr-2" />
                            Buscar Pista
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
