import { Header } from "@/components/navigation/header";
import { MapHero } from "@/components/map/map-hero";
import LazyRealInteractiveMap from "@/components/map/lazy-map";

export default function MapaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <LazyRealInteractiveMap />
      </main>
    </div>
  );
}
