export function CollectiblesHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cartagena-treasure-hunt-colonial-coins-gems.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">
            Colecciona
            <span className="block text-colonial-gold">Tesoros Históricos</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
            Descubre insignias únicas, desbloquea logros especiales y conviértete en un verdadero explorador de
            Cartagena.
          </p>
        </div>
      </div>
    </section>
  )
}
