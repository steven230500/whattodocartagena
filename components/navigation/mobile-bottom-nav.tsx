"use client"

import { NAV_MOBILE_BOTTOM } from "@/lib/nav-config"
import type { Locale } from "@/lib/i18n"
import { usePathname } from "next/navigation"

interface MobileBottomNavProps {
  locale: Locale
}

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_MOBILE_BOTTOM.map((item) => {
          const label = locale === "es" ? item.label : item.labelEn
          const isActive = pathname === item.href
          const Icon = item.icon!

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-300 rounded-xl px-3 py-2 mx-1 ${
                isActive
                  ? "text-primary bg-primary/15 shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/60 active:scale-95"
              }`}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? "font-semibold scale-105" : ""
              }`}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
