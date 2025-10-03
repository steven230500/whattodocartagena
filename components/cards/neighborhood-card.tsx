"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, type LucideIcon } from "lucide-react"

interface Neighborhood {
  id: string
  name: string
  description: string
  color: string
  icon: LucideIcon
  progress: number
  totalItems: number
  foundItems: number
  image: string
}

interface NeighborhoodCardProps {
  neighborhood: Neighborhood
  onExplore?: () => void
}

export function NeighborhoodCard({ neighborhood, onExplore }: NeighborhoodCardProps) {
  if (!neighborhood) {
    return <div>Error: Neighborhood data is missing</div>
  }

  if (!neighborhood.icon) {
    return <div>Error: Icon is missing for {neighborhood.name}</div>
  }

  const Icon = neighborhood.icon

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <img
          src={neighborhood.image || "/placeholder.svg"}
          alt={neighborhood.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div
          className={`absolute top-3 right-3 w-8 h-8 ${neighborhood.color} rounded-full flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>

        {/* Progress indicator overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>Progreso</span>
              <span>
                {neighborhood.foundItems}/{neighborhood.totalItems}
              </span>
            </div>
            <Progress value={neighborhood.progress} className="h-1.5 bg-white/20" />
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg group-hover:text-coral transition-colors">
          {neighborhood.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground text-pretty">{neighborhood.description}</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Coleccionables</span>
              <span className="font-medium">
                {neighborhood.foundItems}/{neighborhood.totalItems}
              </span>
            </div>
            <Progress value={neighborhood.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${neighborhood.color} text-white border-0`}>
              {neighborhood.progress}% Completo
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent hover:bg-coral hover:text-white transition-colors"
              onClick={onExplore}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Explorar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
