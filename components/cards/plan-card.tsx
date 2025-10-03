import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Clock } from "lucide-react"
import type { Plan } from "@/lib/types/plan"
import { useTranslation } from "@/lib/i18n"

interface PlanCardProps {
  plan: Plan
}

export function PlanCard({ plan }: PlanCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-[var(--color-caribbean-blue)] to-[var(--color-caribbean-blue-dark)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-2xl font-serif font-bold text-white text-center px-4 text-balance">{plan.title}</h3>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant={plan.price === "free" ? "secondary" : "default"}>
              {plan.price === "free" ? t("plans.price.free") : t("plans.price.paid")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-[var(--color-stone-darker)] mb-4 text-pretty">{plan.description}</p>
        <div className="space-y-2 text-sm text-[var(--color-stone-dark)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{plan.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{plan.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{plan.location}</span>
          </div>
          {plan.price === "paid" && plan.priceAmount && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>{plan.priceAmount}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-[var(--color-coral)] hover:bg-[var(--color-coral-dark)] text-white">
          {t("cta.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  )
}
