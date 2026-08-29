export function AchievementsHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cartagena-coat-of-arms-shield.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">
            Tus
            <span className="block text-colonial-gold">Logros en Cartagena</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-xl text-pretty">
            Se desbloquean solos a medida que explorás: completá rutas guiadas, guardá tus lugares favoritos.
          </p>
        </div>
      </div>
    </section>
  )
}
