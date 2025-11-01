import dynamic from "next/dynamic";
import { Header } from "@/components/navigation/header";
import { MapHero } from "@/components/map/map-hero";

const RealInteractiveMap = dynamic(() => import("@/components/map/real-interactive-map"), {
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

export default function MapaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <RealInteractiveMap />
      </main>
    </div>
  );
}
