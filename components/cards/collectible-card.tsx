"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gem, Lock, MapPin, Star } from "lucide-react"

interface CollectibleItem {
  id: number
  name: string
  description: string
  rarity: "Común" | "Raro" | "Épico" | "Legendario"
  found: boolean
  location: string
  xp: number
}

interface CollectibleCardProps {
  item: CollectibleItem
  onSearchClue?: () => void
}

const rarityColors = {
  Común: "bg-gray-500",
  Raro: "bg-blue-500",
  Épico: "bg-purple-500",
  Legendario: "bg-yellow-500",
}

export function CollectibleCard({ item, onSearchClue }: CollectibleCardProps) {
  return (
    <Card
      className={`border-0 shadow-lg ${
        item.found ? "opacity-100" : "opacity-60"
      } hover:shadow-xl transition-all duration-300 group`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-serif text-lg flex items-center space-x-2">
              {item.found ? (
                <Gem className="w-5 h-5 text-coral group-hover:animate-pulse" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              <span className={item.found ? "text-foreground" : "text-muted-foreground"}>{item.name}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 text-pretty">{item.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={`${rarityColors[item.rarity]} text-white border-0`}>{item.rarity}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{item.xp} XP</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className={item.found ? "text-foreground" : "text-muted-foreground"}>{item.location}</span>
          </div>

          {!item.found && (
            <Button size="sm" className="w-full bg-coral hover:bg-coral-dark text-white" onClick={onSearchClue}>
              <MapPin className="w-4 h-4 mr-2" />
              Buscar Pista
            </Button>
          )}

          {item.found && (
            <div className="text-center py-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ¡Encontrado!
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
