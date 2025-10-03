"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import type { NavPrimaryItem, Locale } from "@/lib/nav-config"

interface MegaMenuProps {
  item: NavPrimaryItem
  locale: Locale
}

export function MegaMenu({ item, locale }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const label = locale === "es" ? item.label : item.labelEn

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        {item.icon && <item.icon className="w-4 h-4" />}
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-card border border-border rounded-lg shadow-lg p-6 z-50"
        >
          <div className="grid grid-cols-2 gap-6">
            {item.children?.map((group) => {
              const groupLabel = locale === "es" ? group.group : group.groupEn
              return (
                <div key={group.group}>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{groupLabel}</h3>
                  <ul className="space-y-2">
                    {group.items.map((navItem) => {
                      const itemLabel = locale === "es" ? navItem.label : navItem.labelEn
                      return (
                        <li key={navItem.href}>
                          <a
                            href={navItem.href}
                            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {navItem.icon && <navItem.icon className="w-4 h-4" />}
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
        </div>
      )}
    </div>
  )
}
