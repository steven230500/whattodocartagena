"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Headphones, Play } from "lucide-react"
import { categoryColor } from "@/lib/routes/category-color"
import { useLocale } from "next-intl"
import type { Route } from "@/lib/api/routes"

interface RoutesGridProps {
  routes: Route[]
}

export function RoutesGrid({ routes }: RoutesGridProps) {
  const locale = useLocale()
  const categories = ["Todos", ...Array.from(new Set(routes.map((r) => r.category)))]
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredRoutes =
    selectedCategory === "Todos" ? routes : routes.filter((route) => route.category === selectedCategory)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Rutas disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-coral text-white hover:bg-coral-dark" : "bg-transparent"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoutes.map((route) => {
            const color = categoryColor(route.category)
            const title = locale === "en" && route.titleEn ? route.titleEn : route.title
            const description = locale === "en" && route.descriptionEn ? route.descriptionEn : route.description
            return (
              <Card key={route.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={route.image || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-4 right-4">
                    <Badge className={`${color} text-white border-0`}>{route.price}</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {route.category}
                    </Badge>
                  </div>

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
                  <CardTitle className="font-serif text-xl group-hover:text-coral transition-colors">
                    {title}
                  </CardTitle>
                  <p className="text-muted-foreground text-pretty">{description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {route.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {route.distance}
                    </div>
                  </div>

                  {route.highlights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Puntos destacados:</h4>
                      <div className="flex flex-wrap gap-1">
                        {route.highlights.slice(0, 3).map((highlight) => (
                          <Badge key={highlight} variant="outline" className="text-xs bg-transparent">
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
                  )}

                  <Link href={`/routes/${route.slug}`}>
                    <Button size="sm" className={`${color} text-white hover:opacity-90 w-full`}>
                      <Play className="w-4 h-4 mr-2" />
                      {route.steps.length > 0 ? "Iniciar" : "Ver ruta"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
