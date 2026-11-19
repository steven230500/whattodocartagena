"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MAP_LAYERS } from "@/lib/map/layers";
import { LayerToggle } from "@/components/map/layer-toggle";
import { MapFilters } from "@/components/map/map-filters";
import { MapLegend } from "@/components/map/map-legend";
import type { BasePoint, PoiType } from "./types";
import { REAL_POIS } from "@/lib/map/curated-pois";
import type { Commerce } from "@/lib/types/commerce";
import { Info, Navigation } from "lucide-react";

const LeafletCanvas = dynamic(() => import("./leaflet-canvas"), { ssr: false });

interface RealInteractiveMapProps {
  commerces: Commerce[];
  routeCount: number;
}

export default function RealInteractiveMap({ commerces, routeCount }: RealInteractiveMapProps) {
  const [selected, setSelected] = useState<BasePoint | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>(
    ["historic", "food", "culture", "photo"] // por defecto
  );
  const [filters, setFilters] = useState({
    type: "all",
    subtype: "all",
    neighborhood: "all",
    openNow: false,
  });

  const colorByType = useMemo(() => {
    const dict = {} as Record<PoiType, string>;
    MAP_LAYERS.forEach((l) => (dict[l.id as PoiType] = l.color));
    return dict;
  }, []);

  const commercePois: BasePoint[] = useMemo(
    () =>
      commerces.map((c, i) => ({
        id: `commerce-${i}`,
        name: c.name,
        description: c.description,
        coords: c.coords,
        type: "commerce" as PoiType,
        rating: 4.5,
        commerceData: c,
      })),
    [commerces]
  );

  const allPoints = useMemo(
    () => [...REAL_POIS, ...commercePois],
    [commercePois]
  );

  const visiblePoints = useMemo(() => {
    // por capa
    let pts = allPoints.filter((p) => activeLayers.includes(p.type));

    // filtros (tipo/subtipo/barrio/openNow)
    if (filters.type !== "all") {
      pts = pts.filter(
        (p) =>
          p.commerceData?.type === filters.type ||
          p.category?.toLowerCase().includes(filters.type.toLowerCase())
      );
    }
    if (filters.subtype !== "all") {
      pts = pts.filter((p) => p.commerceData?.subtype === filters.subtype);
    }
    if (filters.neighborhood !== "all") {
      pts = pts.filter((p) => p.commerceData?.barrio === filters.neighborhood);
    }
    // openNow: si tu dataset lo soporta, filtra por horarios aquí

    return pts;
  }, [allPoints, activeLayers, filters]);

  const toggleLayer = (layerId: string) =>
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Título */}
        <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">
          Mapa Interactivo
        </h2>

        {/* Toggle de capas */}
        <div className="mb-6">
          <LayerToggle
            layers={MAP_LAYERS.map((l) => ({ ...l, active: activeLayers.includes(l.id) }))}
            onToggle={toggleLayer}
          />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <MapFilters onFilterChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna mapa */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-96 lg:h-[600px] rounded-lg">
                {/* Mapa */}
                <LeafletCanvas
                  points={visiblePoints}
                  colorByType={colorByType}
                  onSelect={setSelected}
                  onGoTo={(coords, label) =>
                    window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, "_blank")
                  }
                />

                {/* Overlay: Leyenda + Controles (look de tu diseño anterior) */}
                <MapLegend
                  className="absolute left-4 bottom-4"
                  layers={MAP_LAYERS.filter((l) => activeLayers.includes(l.id))}
                />
                <div className="absolute right-4 top-4 flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="bg-white/95 backdrop-blur-sm">
                    <Navigation className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/95 backdrop-blur-sm">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Selección actual (debajo del mapa, centrado) */}
            {selected && (
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold">{selected.name}</h3>
                <p className="text-muted-foreground">{selected.description}</p>
              </div>
            )}
          </div>

          {/* Columna lateral: Explora + Stats (como la segunda imagen) */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <div className="p-6">
                <h3 className="font-serif text-2xl mb-3">Explora el Mapa</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona las capas que quieres ver y haz clic en los puntos para descubrir más información.
                </p>
                <ul className="space-y-3 text-sm">
                  {MAP_LAYERS.map((l) => (
                    <li key={l.id} className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      <span>{l.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="border-0 shadow-xl">
              <div className="p-6">
                <h3 className="font-serif text-2xl mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-coral">{visiblePoints.length}</div>
                    <div className="text-xs text-muted-foreground">Puntos Visibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-caribbean-blue">{routeCount}</div>
                    <div className="text-xs text-muted-foreground">Rutas Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-colonial-gold">500+</div>
                    <div className="text-xs text-muted-foreground">Años de Historia</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-forest">{REAL_POIS.length}</div>
                    <div className="text-xs text-muted-foreground">Sitios de Interés</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
