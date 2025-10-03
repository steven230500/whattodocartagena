"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import type { Locale } from "@/lib/i18n"

interface LanguageToggleProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
}

const LANGUAGES = [
  { code: "es" as Locale, label: "Español", flag: "🇪🇸", available: true },
  { code: "en" as Locale, label: "English", flag: "🇬🇧", available: true },
  { code: "pt" as Locale, label: "Português", flag: "🇵🇹", available: false },
  { code: "de" as Locale, label: "Deutsch", flag: "🇩🇪", available: false },
]

export function LanguageToggle({ currentLocale, onLocaleChange }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("preferred-locale") as Locale
      if (savedLocale && (savedLocale === "es" || savedLocale === "en") && savedLocale !== currentLocale) {
        onLocaleChange(savedLocale)
      }
    }
  }, [currentLocale, onLocaleChange])

  const handleLanguageSelect = (locale: Locale) => {
    onLocaleChange(locale)
    setIsOpen(false)

    // Store preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", locale)
    }
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => language.available && handleLanguageSelect(language.code)}
              disabled={!language.available}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{language.flag}</span>
                <span className="truncate">{language.label}</span>
                {!language.available && <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">(Próximamente)</span>}
              </div>
              {currentLocale === language.code && <Check className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
