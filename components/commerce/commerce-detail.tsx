"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Globe, Instagram, Clock, DollarSign, Navigation } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Commerce } from "@/lib/types/commerce"
import { COMMERCE_TYPES } from "@/lib/map/layers"

interface CommerceDetailProps {
  commerce: Commerce
}

export function CommerceDetail({ commerce }: CommerceDetailProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-stone-warm">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${commerce.image}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
          <div className="text-white">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-colonial-gold text-white">{COMMERCE_TYPES[commerce.type]}</Badge>
              {commerce.priceHint && (
                <Badge variant="outline" className="border-white/30 text-white">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {commerce.priceHint}
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">{commerce.name}</h1>

            <div className="flex items-center text-white/80 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{commerce.barrio}</span>
            </div>

            <p className="text-xl text-white/90 max-w-2xl">{commerce.description}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold mb-6 text-stone-darker">Sobre {commerce.name}</h2>

                  <div className="prose prose-stone max-w-none">
                    <p className="text-stone-dark leading-relaxed">{commerce.content || commerce.description}</p>
                  </div>

                  {commerce.tags.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-stone-darker mb-3">Características:</h3>
                      <div className="flex flex-wrap gap-2">
                        {commerce.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-stone-light text-stone-darker">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-darker mb-4">Información de Contacto</h3>

                  <div className="space-y-3">
                    {commerce.hours && (
                      <div className="flex items-center text-stone-dark">
                        <Clock className="w-4 h-4 mr-3 text-stone-darker" />
                        <span>{commerce.hours}</span>
                      </div>
                    )}

                    {commerce.contact.phone && (
                      <div className="flex items-center text-stone-dark">
                        <Phone className="w-4 h-4 mr-3 text-stone-darker" />
                        <span>{commerce.contact.phone}</span>
                      </div>
                    )}

                    {commerce.contact.web && (
                      <div className="flex items-center text-stone-dark">
                        <Globe className="w-4 h-4 mr-3 text-stone-darker" />
                        <a
                          href={commerce.contact.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-caribbean-blue hover:underline"
                        >
                          Sitio Web
                        </a>
                      </div>
                    )}

                    {commerce.contact.instagram && (
                      <div className="flex items-center text-stone-dark">
                        <Instagram className="w-4 h-4 mr-3 text-stone-darker" />
                        <a
                          href={`https://instagram.com/${commerce.contact.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-caribbean-blue hover:underline"
                        >
                          {commerce.contact.instagram}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full bg-colonial-gold hover:bg-colonial-gold-dark text-white">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t("cta.viewOnMap")}
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="w-4 h-4 mr-2" />
                      {t("cta.getDirections")}
                    </Button>

                    {commerce.contact.phone && (
                      <Button variant="outline" className="w-full bg-transparent">
                        <Phone className="w-4 h-4 mr-2" />
                        {t("cta.contact")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
