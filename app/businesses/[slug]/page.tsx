import { Header } from "@/components/navigation/header"
import { CommerceDetail } from "@/components/commerce/commerce-detail"
import { commerces } from "@/lib/data/commerces"
import { notFound } from "next/navigation"

interface CommercePageProps {
  params: {
    slug: string
  }
}

export default function CommercePage({ params }: CommercePageProps) {
  const commerce = commerces.find((c) => c.slug === params.slug)

  if (!commerce) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CommerceDetail commerce={commerce} />
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return commerces.map((commerce) => ({
    slug: commerce.slug,
  }))
}
