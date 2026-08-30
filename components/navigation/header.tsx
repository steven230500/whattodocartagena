"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { MegaMenu } from "@/components/navigation/mega-menu"
import { MobileDrawer } from "@/components/navigation/mobile-drawer"
import { SearchButton } from "@/components/navigation/search-button"
import { Menu } from "lucide-react"
import { useLocale } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { NAV_PRIMARY } from "@/lib/nav-config"
import { Logo } from "@/components/navigation/logo"
import { UserMenu } from "@/components/navigation/user-menu"

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6">
              {NAV_PRIMARY.map((item) => {
                if (item.children && item.children.length > 0) {
                  return <MegaMenu key={item.label} item={item} locale={currentLocale} />
                }

                if (item.href) {
                  const label = currentLocale === "es" ? item.label : item.labelEn
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{label}</span>
                    </Link>
                  )
                }

                return null
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <SearchButton />
              <LanguageToggle currentLocale={currentLocale} onLocaleChange={handleLocaleChange} />
              <Button asChild size="sm" className="bg-coral hover:bg-coral-dark text-white">
                <Link href="/plans">{currentLocale === "es" ? "Planes para locales" : "Local Plans"}</Link>
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Simplified */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Mobile Logo - Smaller */}
          <Logo size="sm" />

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2">
            <SearchButton />
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent transition-colors p-2"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} locale={currentLocale} />
    </>
  )
}
