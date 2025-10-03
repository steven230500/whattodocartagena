"use client"

import { useState } from "react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Music, Calendar, Store, Church, Map, Gift, Search } from "lucide-react"

export default function ExploraPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Cultura viva",
      titleEn: "Living Culture",
      description: "Descubre la música, el arte y las tradiciones de Cartagena",
      descriptionEn: "Discover the music, art and traditions of Cartagena",
      icon: Music,
      color: "bg-orange-500",
      links: [
        { label: "Cultura", href: "/cultura" },
        { label: "Gastronomía", href: "/explora?tag=gastronomia" },
      ],
    },
    {
      title: "Agenda",
      titleEn: "Events",
      description: "Eventos culturales y planes para disfrutar",
      descriptionEn: "Cultural events and plans to enjoy",
      icon: Calendar,
      color: "bg-blue-500",
      links: [
        { label: "Eventos", href: "/eventos" },
        { label: "Planes para locales", href: "/planes" },
      ],
    },
    {
      title: "Comercio local",
      titleEn: "Local Commerce",
      description: "Apoya a los negocios y artesanos locales",
      descriptionEn: "Support local businesses and artisans",
      icon: Store,
      color: "bg-green-500",
      links: [
        { label: "Comercios", href: "/comercios" },
        { label: "Centros comerciales", href: "/comercios?type=mall" },
      ],
    },
    {
      title: "Servicios útiles",
      titleEn: "Useful Services",
      description: "Información práctica para tu día a día",
      descriptionEn: "Practical information for your daily life",
      icon: Church,
      color: "bg-purple-500",
      links: [{ label: "Horarios de misas", href: "/misas" }],
    },
  ]

  const shortcuts = [
    {
      label: "Hoy cerca de ti",
      labelEn: "Today Near You",
      href: "/explora?near=me&when=today",
      icon: Map,
      color: "bg-coral-gradient",
    },
    {
      label: "Gratis este fin de semana",
      labelEn: "Free This Weekend",
      href: "/explora?price=free&when=weekend",
      icon: Gift,
      color: "bg-navy-gradient",
    },
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="pt-24 px-4 container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Explora Cartagena</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubre todo lo que la ciudad tiene para ofrecer: cultura, eventos, comercios y más
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Buscar eventos, lugares, comercios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Atajos rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon
              return (
                <a
                  key={shortcut.href}
                  href={shortcut.href}
                  className="flex items-center space-x-4 p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${shortcut.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{shortcut.label}</h3>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.title}
                  className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
      </main>
    </div>
  )
}
