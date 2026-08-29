export interface SchedulePayload {
  day: string
  times: string[]
}

// Una línea por horario: "Lunes a Viernes: 7:00 AM, 12:00 PM, 6:00 PM"
export function parseSchedules(raw: string): SchedulePayload[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":")
      if (idx === -1) return { day: line, times: [] }
      const day = line.slice(0, idx).trim()
      const times = line
        .slice(idx + 1)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      return { day, times }
    })
}

export function serializeSchedules(schedules: SchedulePayload[]): string {
  return schedules.map((s) => `${s.day}: ${s.times.join(", ")}`).join("\n")
}
