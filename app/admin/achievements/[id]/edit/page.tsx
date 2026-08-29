import { notFound } from "next/navigation"
import { AchievementForm } from "@/components/admin/achievement-form"
import { getAdminAchievementById } from "@/lib/api/admin/achievements"
import { updateAchievement } from "../../actions"

export const dynamic = "force-dynamic"

interface EditAchievementPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAchievementPage({ params }: EditAchievementPageProps) {
  const { id } = await params
  const achievement = await getAdminAchievementById(id)

  if (!achievement) {
    notFound()
  }

  const action = updateAchievement.bind(null, id)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Editar {achievement.title}</h1>
        <AchievementForm action={action} achievement={achievement} submitLabel="Guardar cambios" />
      </div>
    </div>
  )
}
