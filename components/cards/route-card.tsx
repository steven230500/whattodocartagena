"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Headphones, Star, Users, Play, Heart, Navigation } from "lucide-react"

interface WalkingRoute {
  id: number
  title: string
  description: string
  duration: string
  distance: string
  difficulty: string
  rating: number
  reviews: number
  image: string
  category: string
  color: string
  highlights: string[]
  audioGuide: boolean
  offline: boolean
  price: string
}

interface RouteCardProps {
  route: WalkingRoute
  onStart?: () => void
  onToggleFavorite?: () => void
  isFavorite?: boolean
}

export function RouteCard({ route, onStart, onToggleFavorite, isFavorite = false }: RouteCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
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

        {/* Offline Indicator */}
        {route.offline && (
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-white">Offline</span>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="font-serif text-xl group-hover:text-coral transition-colors text-balance">
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

        {/* Difficulty Badge */}
        <div className="flex justify-center mb-4">
          <Badge
            variant="outline"
            className={`text-xs ${
              route.difficulty === "Fácil"
                ? "bg-green-50 text-green-700 border-green-200"
                : route.difficulty === "Moderado"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {route.difficulty}
          </Badge>
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
          <Button size="sm" className={`${route.color} text-white hover:opacity-90 flex-1`} onClick={onStart}>
            <Play className="w-4 h-4 mr-2" />
            Iniciar
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent" onClick={onToggleFavorite}>
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button size="sm" variant="outline" className="bg-transparent">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
