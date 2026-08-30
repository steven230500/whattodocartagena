import { Header } from "@/components/navigation/header";
import { MapHero } from "@/components/map/map-hero";
import LazyRealInteractiveMap from "@/components/map/lazy-map";
import { getBusinesses } from "@/lib/api/businesses";
import { getRoutes } from "@/lib/api/routes";

export const dynamic = "force-dynamic"

export default async function MapaPage() {
  const [commerces, routes] = await Promise.all([getBusinesses(), getRoutes()]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MapHero />
        <LazyRealInteractiveMap commerces={commerces} routeCount={routes.length} />
      </main>
    </div>
  );
}
