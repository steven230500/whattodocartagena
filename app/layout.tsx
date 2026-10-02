import type React from "react"
import type { Metadata } from "next"
import { Instrument_Sans, Playfair_Display } from "next/font/google"
import { getLocale } from "next-intl/server"
import "./globals.css"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://whattodocartagena.com"),
  title: "What to do Cartagena - Guía Interactiva",
  description:
    "Descubre qué hacer en Cartagena de Indias con nuestra guía interactiva completa de actividades, eventos, comercios y rutas turísticas.",
  keywords: "Cartagena, Colombia, qué hacer, turismo, guía, eventos, comercios, rutas, Ciudad Heroica",
  authors: [{ name: "What to do Cartagena" }],
  manifest: "/manifest.json",
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
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }], apple: "/apple-icon.png" },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b47',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${instrumentSans.variable} ${playfair.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground min-h-screen">{children}</body>
    </html>
  )
}
