import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { MyBusinessForm } from "@/components/my-business/my-business-form"
import { getCurrentUser } from "@/lib/api/auth"
import { getMyBusinessById } from "@/lib/api/my-business"
import { updateMyBusiness } from "../../actions"

interface EditMyBusinessPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMyBusinessPage({ params }: EditMyBusinessPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const { id } = await params
  const business = await getMyBusinessById(id)

  if (!business) {
    notFound()
  }

  const action = updateMyBusiness.bind(null, id)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {business.name}</h1>
          <MyBusinessForm action={action} business={business} />
        </div>
      </main>
    </div>
  )
}
