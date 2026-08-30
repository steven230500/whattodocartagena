import { AchievementForm } from "@/components/admin/achievement-form"
import { createAchievement } from "../actions"

export default function NewAchievementPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Nuevo logro</h1>
        <AchievementForm action={createAchievement} submitLabel="Crear" />
      </div>
    </div>
  )
}
