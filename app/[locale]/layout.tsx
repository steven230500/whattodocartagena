import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav"
import { Footer } from "@/components/navigation/footer"

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Header ya se auto-oculta por breakpoint dentro de cada página que lo
          renderiza — MobileBottomNav igual, md:hidden en su propio root. */}
      <div className="pt-14 md:pt-0 pb-16 md:pb-0">
        {children}
        <Footer />
      </div>
      <MobileBottomNav />
    </NextIntlClientProvider>
  )
}
