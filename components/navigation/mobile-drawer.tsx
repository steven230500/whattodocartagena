"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_PRIMARY } from "@/lib/nav-config"
import type { Locale } from "@/lib/i18n"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

export function MobileDrawer({ isOpen, onClose, locale }: MobileDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Drawer - Full screen mobile style */}
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-card shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header with close button */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-coral-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">Cartagena Viva</h2>
              <p className="text-xs text-muted-foreground">Menú de navegación</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-10 h-10 p-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Content */}
        <div className="p-4 pb-20">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Acciones rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/map"
                className="flex flex-col items-center space-y-2 p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">🗺️</span>
                </div>
                <span className="text-sm font-medium">Mapa</span>
              </a>
              <a
                href="/routes"
                className="flex flex-col items-center space-y-2 p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">🛤️</span>
                </div>
                <span className="text-sm font-medium">Rutas</span>
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Navegación</h3>
            {NAV_PRIMARY.map((item) => {
              const label = locale === "es" ? item.label : item.labelEn
              const hasChildren = item.children && item.children.length > 0

              if (!hasChildren && item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-4 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    {item.icon && <item.icon className="w-5 h-5 text-primary" />}
                    <span>{label}</span>
                  </a>
                )
              }

              if (hasChildren) {
                const isExpanded = expandedItem === item.label

                return (
                  <div key={item.label} className="rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {item.icon && <item.icon className="w-5 h-5 text-primary" />}
                        <span>{label}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="bg-accent/30 px-4 py-2 space-y-1">
                        {item.children?.map((group) => {
                          const groupLabel = locale === "es" ? group.group : group.groupEn
                          return (
                            <div key={group.group} className="py-2">
                              <h4 className="text-sm font-semibold text-foreground mb-3 px-4">{groupLabel}</h4>
                              <div className="space-y-1">
                                {group.items.map((navItem) => {
                                  const itemLabel = locale === "es" ? navItem.label : navItem.labelEn
                                  return (
                                    <a
                                      key={navItem.href}
                                      href={navItem.href}
                                      className="flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors ml-4"
                                      onClick={onClose}
                                    >
                                      {navItem.icon && <navItem.icon className="w-4 h-4" />}
                                      <span>{itemLabel}</span>
                                    </a>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return null
            })}
          </nav>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="space-y-3">
              <a
                href="/planes"
                className="flex items-center justify-center w-full px-4 py-3 bg-coral-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                Planes para locales
              </a>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  ¿Necesitas ayuda? <a href="mailto:info@whattodocartagena.com" className="text-primary hover:underline">Contáctanos</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
