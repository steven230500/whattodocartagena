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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-card border-r border-border overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-bold text-lg">Menú</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {NAV_PRIMARY.map((item) => {
              const label = locale === "es" ? item.label : item.labelEn
              const hasChildren = item.children && item.children.length > 0

              if (!hasChildren && item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{label}</span>
                  </a>
                )
              }

              if (hasChildren) {
                const isExpanded = expandedItem === item.label

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="ml-4 mt-2 space-y-3 border-l-2 border-border pl-4">
                        {item.children?.map((group) => {
                          const groupLabel = locale === "es" ? group.group : group.groupEn
                          return (
                            <div key={group.group}>
                              <h4 className="text-xs font-semibold text-foreground mb-2">{groupLabel}</h4>
                              <ul className="space-y-1">
                                {group.items.map((navItem) => {
                                  const itemLabel = locale === "es" ? navItem.label : navItem.labelEn
                                  return (
                                    <li key={navItem.href}>
                                      <a
                                        href={navItem.href}
                                        className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md transition-colors"
                                        onClick={onClose}
                                      >
                                        {navItem.icon && <navItem.icon className="w-3 h-3" />}
                                        <span>{itemLabel}</span>
                                      </a>
                                    </li>
                                  )
                                })}
                              </ul>
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
        </div>
      </div>
    </div>
  )
}
