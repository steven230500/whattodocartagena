"use client";

import dynamic from "next/dynamic";
import type { Commerce } from "@/lib/types/commerce";

const RealInteractiveMap = dynamic(() => import("./real-interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="h-96 lg:h-[600px] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      </div>
    </div>
  ),
});

interface LazyRealInteractiveMapProps {
  commerces: Commerce[];
  routeCount: number;
}

export default function LazyRealInteractiveMap({ commerces, routeCount }: LazyRealInteractiveMapProps) {
  return <RealInteractiveMap commerces={commerces} routeCount={routeCount} />;
}
