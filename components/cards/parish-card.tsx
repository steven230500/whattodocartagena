import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone } from "lucide-react"
import type { Parish } from "@/lib/types/parish"

interface ParishCardProps {
  parish: Parish
}

export function ParishCard({ parish }: ParishCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-br from-[var(--color-caribbean-blue)] to-[var(--color-caribbean-blue-dark)] text-white">
        <CardTitle className="text-xl font-serif text-balance">{parish.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[var(--color-coral)]" />
            <span className="text-[var(--color-stone-darker)]">{parish.address}</span>
          </div>

          {parish.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 flex-shrink-0 text-[var(--color-coral)]" />
              <span className="text-[var(--color-stone-darker)]">{parish.phone}</span>
            </div>
          )}

          <div className="pt-4 border-t border-[var(--color-stone)]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[var(--color-coral)]" />
              <span className="font-semibold text-[var(--color-stone-darker)]">Horarios de Misas</span>
            </div>
            <div className="space-y-2">
              {parish.schedules.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-stone-dark)]">{schedule.day}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {schedule.times.map((time, timeIndex) => (
                      <Badge key={timeIndex} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
