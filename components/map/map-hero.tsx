"use client";

export function MapHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/aerial-view-of-cartagena-historic-center-with-wall.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            <span className="block">Encuentra todo lo que necesitas</span>
            <span className="block text-caribbean-blue">en Cartagena</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre la ciudad a través de mapas interactivos que revelan su historia,
            gastronomía, cultura y secretos mejor guardados.
          </p>
        </div>
      </div>
    </section>
  );
}
