"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MAP_LAYERS } from "@/lib/map/layers";
import { commerces } from "@/lib/data/commerces";
import { LayerToggle } from "@/components/map/layer-toggle";
import { MapFilters } from "@/components/map/map-filters";
import { MapLegend } from "@/components/map/map-legend";
import type { BasePoint, PoiType } from "./types";
import { Info, Navigation } from "lucide-react";

const LeafletCanvas = dynamic(() => import("./leaflet-canvas"), { ssr: false });

/** POIs reales (lat/lng) */
const REAL_POIS: BasePoint[] = [
  {
    id: "torre-del-reloj",
    name: "Torre del Reloj",
    description: "Entrada principal al Centro Histórico de Cartagena.",
    category: "Monumento",
    rating: 4.7,
    coords: { lat: 10.4236, lng: -75.5469 },
    type: "historic",
  },
  {
    id: "plaza-santo-domingo",
    name: "Plaza Santo Domingo",
    description: "Plaza icónica con la escultura de Botero y cafés alrededor.",
    category: "Plaza",
    rating: 4.7,
    coords: { lat: 10.4229, lng: -75.5531 },
    type: "photo",
  },
  {
    id: "castillo-san-felipe",
    name: "Castillo San Felipe",
    description: "La fortaleza más grande construida por España en América.",
    category: "Fortaleza",
    rating: 4.8,
    coords: { lat: 10.4221, lng: -75.5353 },
    type: "historic",
  },
  {
    id: "las-bovedas",
    name: "Las Bóvedas",
    description: "Antiguos almacenes coloniales, hoy mercado artesanal.",
    category: "Mercado artesanal",
    rating: 4.6,
    coords: { lat: 10.4297, lng: -75.5466 },
    type: "culture",
  },
  {
    id: "teatro-heredia",
    name: "Teatro Adolfo Mejía (Heredia)",
    description: "Principal escenario cultural de la ciudad.",
    category: "Teatro",
    rating: 4.7,
    coords: { lat: 10.4230, lng: -75.5520 },
    type: "culture",
  },
  {
    id: "museo-oro-zenu",
    name: "Museo del Oro Zenú",
    description: "Orfebrería prehispánica de la cultura Zenú.",
    category: "Museo",
    rating: 4.6,
    coords: { lat: 10.4237, lng: -75.5529 },
    type: "culture",
  },
  {
    id: "getsemani",
    name: "Barrio Getsemaní",
    description: "Arte callejero, vida nocturna y calles coloridas.",
    category: "Barrio",
    rating: 4.8,
    coords: { lat: 10.4227, lng: -75.5472 },
    type: "photo",
  },
  {
    id: "la-cevicheria",
    name: "La Cevichería",
    description: "Ceviches famosos en el corazón amurallado.",
    category: "Mariscos",
    rating: 4.7,
    coords: { lat: 10.4234, lng: -75.5512 },
    type: "food",
  },
  {
    id: "rest-1621",
    name: "Restaurante 1621",
    description: "Alta cocina caribeña en ambiente colonial.",
    category: "Gourmet",
    rating: 4.8,
    coords: { lat: 10.4231, lng: -75.5524 },
    type: "food",
  },
];

/** Comercios -> POIs */
const COMMERCE_POIS: BasePoint[] = commerces.map((c, i) => ({
  id: `commerce-${i}`,
  name: c.name,
  description: c.description,
  coords: c.coords,        // asegúrate que ya tengas coords reales en commerces
  type: "commerce" as PoiType,
  rating: 4.5,
  commerceData: c,
}));

export default function RealInteractiveMap() {
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

  const allPoints = useMemo(
    () => [...REAL_POIS, ...COMMERCE_POIS],
    []
  );

  const visiblePoints = useMemo(() => {
    // por capa
    let pts = allPoints.filter((p) => activeLayers.includes(p.type));

    // filtros (tipo/subtipo/barrio/openNow)
    if (filters.type !== "all") {
      pts = pts.filter(
        (p) =>
          (p as any).commerceData?.type === filters.type ||
          p.category?.toLowerCase().includes(filters.type.toLowerCase())
      );
    }
    if (filters.subtype !== "all") {
      pts = pts.filter((p) => (p as any).commerceData?.subtype === filters.subtype);
    }
    if (filters.neighborhood !== "all") {
      pts = pts.filter((p) => (p as any).commerceData?.barrio === filters.neighborhood);
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
                    <div className="text-2xl font-bold text-caribbean-blue">25</div>
                    <div className="text-xs text-muted-foreground">Rutas Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-colonial-gold">500+</div>
                    <div className="text-xs text-muted-foreground">Años de Historia</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-forest">4.8</div>
                    <div className="text-xs text-muted-foreground">Rating Promedio</div>
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
