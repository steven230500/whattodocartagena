"use client"

import { Moon, Sun, Sunrise, Sunset, Radio } from "lucide-react"
import { useTranslations } from "next-intl"
import { useExplorer } from "../state"
import { useMemo } from "react"
import { cartagenaMinutes, timePresets } from "../../domain/sun"
import { cn } from "@/lib/utils"

export const formatMinutes = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`

const PRESETS = [
  { key: "dawn", icon: Sunrise },
  { key: "noon", icon: Sun },
  { key: "sunset", icon: Sunset },
  { key: "night", icon: Moon },
] as const

/** Control de la hora del día: deslizador + atajos + volver a "en vivo". */
export function TimeDock({ className, compact = false }: { className?: string; compact?: boolean }) {
  const t = useTranslations("city3d.time")
  const { state, dispatch, model } = useExplorer()
  const presets = useMemo(() => timePresets(model.origin.lat, model.origin.lng), [model.origin])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "live", minutes: cartagenaMinutes(new Date()) })}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            state.live
              ? "border border-coral bg-coral text-white"
              : "border border-coral text-coral hover:bg-coral/10",
          )}
          aria-pressed={state.live}
          title={state.live ? undefined : t("backLive")}
        >
          <Radio className="h-3.5 w-3.5" aria-hidden />
          {t("live")}
        </button>
        <label className="sr-only" htmlFor="city3d-time">
          {t("label")}
        </label>
        <input
          id="city3d-time"
          type="range"
          min={0}
          max={1439}
          step={5}
          value={Math.round(state.minutes)}
          onChange={(e) => dispatch({ type: "time", minutes: Number(e.target.value) })}
          className="city3d-range h-8 min-w-0 flex-1 cursor-pointer"
          aria-valuetext={formatMinutes(state.minutes)}
        />
        <span className="w-12 shrink-0 text-right font-mono text-sm tabular-nums">{formatMinutes(state.minutes)}</span>
      </div>
      <div className={cn("flex gap-1.5", compact && "hidden")}>
        {PRESETS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => dispatch({ type: "time", minutes: presets[key] })}
            title={formatMinutes(presets[key])}
            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-foreground/10 px-2 py-1.5 text-xs text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  )
}
