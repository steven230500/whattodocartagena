"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { MegaMenu } from "@/components/navigation/mega-menu"
import { MobileDrawer } from "@/components/navigation/mobile-drawer"
import { SearchButton } from "@/components/navigation/search-button"
import { Menu, MapPin } from "lucide-react"
import { useTranslation, type Locale } from "@/lib/i18n"
import { NAV_PRIMARY } from "@/lib/nav-config"

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<Locale>("es")
  const { t } = useTranslation(currentLocale)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("preferred-locale") as Locale
      if (savedLocale && (savedLocale === "es" || savedLocale === "en")) {
        setCurrentLocale(savedLocale)
      }
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setCurrentLocale(newLocale)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-coral-gradient rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-foreground">Cartagena</h1>
              <p className="text-xs text-muted-foreground -mt-1">Viva</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_PRIMARY.map((item) => {
              if (item.children && item.children.length > 0) {
                return <MegaMenu key={item.label} item={item} locale={currentLocale} />
              }

              if (item.href) {
                const label = currentLocale === "es" ? item.label : item.labelEn
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{label}</span>
                  </a>
                )
              }

              return null
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <SearchButton />

            {/* Language Toggle */}
            <div className="hidden sm:block">
              <LanguageToggle currentLocale={currentLocale} onLocaleChange={handleLocaleChange} />
            </div>

            <Button asChild size="sm" className="hidden lg:flex bg-coral-gradient text-white">
              <a href="/planes">{currentLocale === "es" ? "Planes para locales" : "Local Plans"}</a>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-accent transition-colors p-2"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} locale={currentLocale} />
    </header>
  )
}
