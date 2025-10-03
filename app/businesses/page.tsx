import { Header } from "@/components/navigation/header"
import { CommerceHero } from "@/components/commerce/commerce-hero"
import { CommerceGrid } from "@/components/commerce/commerce-grid"

export default function ComerciosPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CommerceHero />
        <CommerceGrid />
      </main>
    </div>
  )
}
