"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Info, ExternalLink } from "lucide-react"
import type { POI } from "@/lib/types/commerce"

interface PoiCardProps {
  poi: POI
}

export function PoiCard({ poi }: PoiCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "historic":
        return "bg-coral text-white"
      case "food":
        return "bg-colonial-gold text-white"
      case "culture":
        return "bg-caribbean-blue text-white"
      case "photo":
        return "bg-forest text-white"
      case "mall":
        return "bg-forest-light text-white"
      case "commerce":
        return "bg-colonial-gold text-white"
      default:
        return "bg-stone-dark text-white"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "historic":
        return "Histórico"
      case "food":
        return "Gastronomía"
      case "culture":
        return "Cultura"
      case "photo":
        return "Fotografía"
      case "mall":
        return "Centro Comercial"
      case "commerce":
        return "Comercio"
      default:
        return "Punto de Interés"
    }
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={poi.image || "/placeholder.svg"}
          alt={poi.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getCategoryColor(poi.category)}>{getCategoryLabel(poi.category)}</Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-serif text-lg font-bold text-stone-darker group-hover:text-coral transition-colors">
          {poi.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-stone-dark text-sm mb-4 line-clamp-3">{poi.excerpt}</p>

        {/* Actions */}
        <div className="space-y-2">
          {poi.actions && poi.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {poi.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={
                    index === 0
                      ? "bg-coral hover:bg-coral-dark text-white"
                      : "bg-transparent text-stone-darker hover:bg-stone-light"
                  }
                  onClick={() => {
                    if (action.type === "link") {
                      window.open(action.href, "_blank")
                    } else {
                      window.location.href = action.href
                    }
                  }}
                >
                  {action.type === "link" && <ExternalLink className="w-3 h-3 mr-1" />}
                  {action.type === "route" && <Navigation className="w-3 h-3 mr-1" />}
                  {action.type === "commerce" && <MapPin className="w-3 h-3 mr-1" />}
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          )}

          {(!poi.actions || poi.actions.length === 0) && (
            <div className="flex gap-2">
              <Button className="flex-1 bg-coral hover:bg-coral-dark text-white text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Ver en Mapa
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Info className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
