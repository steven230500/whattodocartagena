"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/navigation/header"
import { RoutePlayer } from "@/components/routes/route-player"
import { RouteMap } from "@/components/routes/route-map"

// This would normally come from a database or API
const getRouteById = (id: string) => {
  const routes = {
    "1": {
      id: 1,
      title: "Centro Histórico Esencial",
      description: "Recorre los sitios más emblemáticos de la ciudad amurallada",
      duration: "2-3 horas",
      distance: "3.2 km",
      steps: [
        {
          id: 1,
          title: "Plaza de Armas",
          description: "Punto de partida en el corazón de la ciudad colonial",
          audioUrl: "/audio/plaza-armas.mp3",
          duration: "8 min",
          coordinates: { lat: 10.4236, lng: -75.5518 },
          image: "/placeholder.svg?key=plazaarmas",
        },
        {
          id: 2,
          title: "Catedral de Cartagena",
          description: "Majestuosa catedral construida en el siglo XVI",
          audioUrl: "/audio/catedral.mp3",
          duration: "12 min",
          coordinates: { lat: 10.4242, lng: -75.5516 },
          image: "/placeholder.svg?key=catedral",
        },
        {
          id: 3,
          title: "Murallas Coloniales",
          description: "Camina por las históricas fortificaciones",
          audioUrl: "/audio/murallas.mp3",
          duration: "15 min",
          coordinates: { lat: 10.4248, lng: -75.5512 },
          image: "/placeholder.svg?key=murallas",
        },
      ],
    },
  }
  return routes[id as keyof typeof routes]
}

export default function RutePage({ params }: { params: { id: string } }) {
  const [route, setRoute] = useState<any>(null)

  useEffect(() => {
    const routeData = getRouteById(params.id)
    setRoute(routeData)
  }, [params.id])

  if (!route) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Cargando ruta...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <RoutePlayer route={route} />
          <RouteMap route={route} />
        </div>
      </main>
    </div>
  )
}
