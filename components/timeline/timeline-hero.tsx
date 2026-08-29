export function TimelineHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cartagena-de-indias-colonial-walls-sunset-caribbea.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-balance">
            500 Años de
            <span className="block text-colonial-gold">Historia Viva</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-xl text-pretty">
            Desde la fundación española hasta convertirse en Patrimonio de la Humanidad, descubre los momentos que
            forjaron la identidad cartagenera.
          </p>
        </div>
      </div>
    </section>
  )
}
