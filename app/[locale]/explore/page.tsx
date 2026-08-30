"use client"

import { useState } from "react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { RampartDivider } from "@/components/ui/rampart-divider"
import { Search } from "lucide-react"

type Tag = "gold" | "coral" | "neutral"

const TAG_STYLES: Record<Tag, { label: string; text: string; ring: string }> = {
  gold: { label: "bg-colonial-gold", text: "text-white", ring: "ring-colonial-gold" },
  coral: { label: "bg-coral", text: "text-white", ring: "ring-coral" },
  neutral: { label: "bg-stone-darker", text: "text-white", ring: "ring-stone-darker" },
}

const categories = [
  {
    title: "Cultura viva",
    description: "Música, arte y tradiciones afrocaribeñas que se viven en la calle, no en un museo.",
    image: "/palenquera-woman-traditional-dress-cartagena.jpg",
    tag: "gold" as Tag,
    span: true,
    links: [
      { label: "Cultura", href: "/explore?tag=cultura" },
      { label: "Gastronomía", href: "/explore?tag=gastronomia" },
    ],
  },
  {
    title: "Agenda",
    description: "Lo que pasa esta semana en la ciudad.",
    image: "/champeta-concert-cartagena-walls-sunset.jpg",
    tag: "coral" as Tag,
    span: false,
    links: [
      { label: "Eventos", href: "/events" },
      { label: "Planes locales", href: "/plans" },
    ],
  },
  {
    title: "Comercio local",
    description: "Negocios y artesanos de Cartagena, de primera mano.",
    image: "/traditional-weaving-workshop-cartagena.jpg",
    tag: "neutral" as Tag,
    span: false,
    links: [
      { label: "Comercios", href: "/businesses" },
      { label: "Centros comerciales", href: "/businesses?type=mall" },
    ],
  },
  {
    title: "Servicios útiles",
    description: "Información práctica para el día a día en la ciudad.",
    image: "/puerta-del-reloj-cartagena-clock-tower.jpg",
    tag: "neutral" as Tag,
    span: false,
    links: [{ label: "Horarios de misas", href: "/masses" }],
  },
]

const shortcuts = [
  {
    label: "Hoy cerca de ti",
    href: "/explore?near=me&when=today",
    image: "/walking-tour-cartagena-cobblestone-streets.png",
  },
  {
    label: "Gratis este fin de semana",
    href: "/explore?price=free&when=weekend",
    image: "/art-fair-getsemani-cartagena-street-art.jpg",
  },
]

export default function ExploraPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4">
          {/* Intro — alineado a la izquierda, no centrado */}
          <div className="max-w-2xl mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
              ¿Qué hacer en Cartagena?
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Cultura, eventos, comercio y servicios — lo que la ciudad tiene hoy, sin relleno genérico.
            </p>
          </div>

          <div className="relative max-w-xl mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar eventos, lugares, tiendas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
        </div>

        <RampartDivider color="var(--color-colonial-gold)" />

        <div className="container mx-auto px-4 py-10">
          {/* Atajos — franja compacta, foto real en vez de caja con gradiente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {shortcuts.map((shortcut) => (
              <a
                key={shortcut.href}
                href={shortcut.href}
                className="group relative h-24 rounded-xl overflow-hidden flex items-end"
              >
                <img
                  src={shortcut.image || "/placeholder.svg"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <span className="relative z-10 px-4 pb-3 font-semibold text-white">{shortcut.label}</span>
              </a>
            ))}
          </div>

          {/* Categorías — grid asimétrico, foto como protagonista, no icono en caja de color */}
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const tagStyle = TAG_STYLES[category.tag]
              return (
                <div
                  key={category.title}
                  className={`group relative rounded-xl overflow-hidden border border-border ${
                    category.span ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="relative h-56">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                    <span
                      className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${tagStyle.label} ${tagStyle.text}`}
                    >
                      {category.title}
                    </span>
                    <p className="absolute bottom-4 left-4 right-4 text-white text-sm">{category.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 bg-card">
                    {category.links.map((link) => (
                      <Button key={link.href} asChild variant="outline" size="sm">
                        <a href={link.href}>{link.label}</a>
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <RampartDivider color="var(--color-stone)" />
      </main>
    </div>
  )
}
