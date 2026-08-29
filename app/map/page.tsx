import { Header } from "@/components/navigation/header";
import { MapHero } from "@/components/map/map-hero";
import LazyRealInteractiveMap from "@/components/map/lazy-map";
import { getBusinesses } from "@/lib/api/businesses";

export const dynamic = "force-dynamic"

export default async function MapaPage() {
  const commerces = await getBusinesses();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <LazyRealInteractiveMap commerces={commerces} />
      </main>
    </div>
  );
}
