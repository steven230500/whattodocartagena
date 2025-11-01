export function RoutesHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/walking-tour-cartagena-cobblestone-streets.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">
            Rutas que Cuentan
            <span className="block text-colonial-gold">Historias</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
            Camina por senderos históricos con audio-guías narradas por locales y descubre los secretos mejor guardados
            de cada barrio.
          </p>
        </div>
      </div>
    </section>
  )
}
