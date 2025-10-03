"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, DollarSign, Navigation } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Commerce } from "@/lib/types/commerce"
import { COMMERCE_TYPES } from "@/lib/map/layers"
import Link from "next/link"

interface CommerceCardProps {
  commerce: Commerce
}

export function CommerceCard({ commerce }: CommerceCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={commerce.image || "/placeholder.svg"}
          alt={commerce.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-colonial-gold text-white">{COMMERCE_TYPES[commerce.type]}</Badge>
        </div>
        {commerce.priceHint && (
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-white/90 text-stone-darker border-white/50">
              <DollarSign className="w-3 h-3 mr-1" />
              {commerce.priceHint}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-xl font-bold text-stone-darker group-hover:text-colonial-gold transition-colors">
            {commerce.name}
          </h3>
        </div>
        <div className="flex items-center text-stone-dark text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{commerce.barrio}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-stone-dark text-sm mb-4 line-clamp-2">{commerce.description}</p>

        {/* Tags */}
        {commerce.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {commerce.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-stone-light text-stone-darker">
                {tag}
              </Badge>
            ))}
            {commerce.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-stone-light text-stone-darker">
                +{commerce.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {commerce.hours && (
            <div className="flex items-center text-stone-dark text-xs">
              <Clock className="w-3 h-3 mr-2" />
              <span>{commerce.hours}</span>
            </div>
          )}
          {commerce.contact.phone && (
            <div className="flex items-center text-stone-dark text-xs">
              <Phone className="w-3 h-3 mr-2" />
              <span>{commerce.contact.phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/comercios/${commerce.slug}`} className="flex-1">
            <Button className="w-full bg-colonial-gold hover:bg-colonial-gold-dark text-white text-sm">
              {t("cta.viewDetails")}
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
