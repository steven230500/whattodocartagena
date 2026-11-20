import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login")
  return { title: `${t("title")} | What to do Cartagena`, robots: { index: false, follow: false, noarchive: true } }
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children
}
