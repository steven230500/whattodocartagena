import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav"
import { Footer } from "@/components/navigation/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "What to do Cartagena - Guía Interactiva",
  description:
    "Descubre qué hacer en Cartagena de Indias con nuestra guía interactiva completa de actividades, eventos, comercios y rutas turísticas.",
  keywords: "Cartagena, Colombia, qué hacer, turismo, guía, eventos, comercios, rutas, Ciudad Heroica",
  authors: [{ name: "What to do Cartagena" }],
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://whattodocartagena.com",
  },
  robots: "index, follow",
  openGraph: {
    title: "What to do Cartagena - Guía Interactiva",
    description: "Descubre qué hacer en Cartagena de Indias con nuestra guía interactiva",
    type: "website",
    locale: "es_CO",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "What to do Cartagena - Guía Interactiva",
    description: "Descubre qué hacer en Cartagena de Indias con nuestra guía interactiva",
  },
  // viewport and themeColor moved to generateViewport
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "What to do Cartagena",
  },
  // icons removed - no icon files present
     generator: 'v0.app'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b47',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {children}
          <Footer />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="pt-14 pb-16 min-h-screen">
            {children}
          </div>
          <Footer />
          <MobileBottomNav locale="es" />
        </div>
      </body>
    </html>
  )
}
