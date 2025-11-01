"use client";

import { cn } from "@/lib/utils";

type Layer = { id: string; label: string; color: string };

export function MapLegend({
  layers,
  className,
}: {
  layers: Layer[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg",
        className
      )}
    >
      <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: layer.color }}
            />
            <span>{layer.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}