import { Header } from "@/components/navigation/header"
import { CommerceDetail } from "@/components/commerce/commerce-detail"
import { getBusinessBySlug } from "@/lib/api/businesses"
import { getFavoriteSlugs } from "@/lib/api/favorites"
import { getMyClaimStatus } from "@/lib/api/business-claims"
import { notFound } from "next/navigation"

interface CommercePageProps {
  params: Promise<{
    slug: string
  }>
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
