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
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_MOBILE_BOTTOM.map((item) => {
          const label = locale === "es" ? item.label : item.labelEn
          const isActive = pathname === item.href
          const Icon = item.icon!

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-200 rounded-lg px-2 py-1 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className={`text-xs font-medium transition-all ${isActive ? "font-semibold" : ""}`}>{label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
