import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { Header } from "@/components/navigation/header"
import { CommerceDetail } from "@/components/commerce/commerce-detail"
import { getBusinessBySlug } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"
import { getMyClaimStatus } from "@/lib/api/business-claims"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface CommercePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CommercePageProps): Promise<Metadata> {
  const { slug } = await params
  const [commerce, locale] = await Promise.all([getBusinessBySlug(slug), getLocale()])
  if (!commerce) return {}

  const description = locale === "en" && commerce.descriptionEn ? commerce.descriptionEn : commerce.description
  const title = `${commerce.name} | What to do Cartagena`
  return {
    title,
    description,
    alternates: {
      canonical: `https://whattodocartagena.com/businesses/${slug}`,
      languages: {
        es: `https://whattodocartagena.com/businesses/${slug}`,
        en: `https://whattodocartagena.com/en/businesses/${slug}`,
      },
    },
    openGraph: { title, description, images: [commerce.image], type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function CommercePage({ params }: CommercePageProps) {
  const { slug } = await params
  const [commerce, favoriteSlugs, claimStatus] = await Promise.all([
    getBusinessBySlug(slug),
    getFavoriteSlugs(),
    getMyClaimStatus(slug),
  ])

  if (!commerce) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CommerceDetail commerce={commerce} initialFavorited={favoriteSlugs.includes(slug)} claimStatus={claimStatus} />
      </main>
    </div>
  )
}
