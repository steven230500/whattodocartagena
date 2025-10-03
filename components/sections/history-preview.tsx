"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"

const historicalPeriods = [
  {
    year: "1533",
    title: "Fundación de Cartagena",
    description: "Pedro de Heredia funda la ciudad que se convertiría en el puerto más importante del Caribe.",
    image: "/spanish-colonial-founding-cartagena-1533.jpg",
    color: "bg-coral",
  },
  {
    year: "1586-1741",
    title: "Construcción de las Murallas",
    description: "Se construyen las fortificaciones que protegerían la ciudad de piratas y enemigos.",
    image: "/cartagena-colonial-walls-construction-fortress.jpg",
    color: "bg-caribbean-blue",
  },
  {
    year: "1811",
    title: "Independencia - Ciudad Heroica",
    description: "Cartagena se declara independiente, ganándose el título de Ciudad Heroica.",
    image: "/cartagena-independence-1811-heroic-city.jpg",
    color: "bg-colonial-gold",
  },
  {
    year: "1984",
    title: "Patrimonio de la Humanidad",
    description: "UNESCO declara el centro histórico como Patrimonio de la Humanidad.",
    image: "/cartagena-unesco-world-heritage-historic-center.jpg",
    color: "bg-forest",
  },
]

export function HistoryPreview() {
  const [currentPeriod, setCurrentPeriod] = useState(0)

  const nextPeriod = () => {
    setCurrentPeriod((prev) => (prev + 1) % historicalPeriods.length)
  }

  const prevPeriod = () => {
    setCurrentPeriod((prev) => (prev - 1 + historicalPeriods.length) % historicalPeriods.length)
  }

  const current = historicalPeriods[currentPeriod]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Viaja a través del tiempo</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubre los momentos clave que forjaron la identidad de Cartagena
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 lg:h-96">
                <img
                  src={current.image || "/placeholder.svg"}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Year Badge */}
                <div
                  className={`absolute top-4 left-4 ${current.color} text-white px-4 py-2 rounded-full font-bold text-lg`}
                >
                  {current.year}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Período Histórico</span>
                </div>

                <h3 className="font-serif text-3xl font-bold text-foreground mb-6">{current.title}</h3>

                <p className="text-lg text-muted-foreground mb-8 text-pretty">{current.description}</p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={prevPeriod} className="w-10 h-10 p-0 bg-transparent">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextPeriod} className="w-10 h-10 p-0 bg-transparent">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    {historicalPeriods.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPeriod(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentPeriod ? "bg-coral w-8" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white px-8">
              <MapPin className="w-5 h-5 mr-2" />
              Explorar Línea de Tiempo Completa
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
