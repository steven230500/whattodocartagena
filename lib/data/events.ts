import type { Event } from "@/lib/types/commerce"

export const events: Event[] = [
  {
    title: "Feria de Arte en Getsemaní",
    slug: "feria-arte-getsemani",
    startDate: "2025-07-12",
    endDate: "2025-07-14",
    type: "feria",
    venue: "Plaza de la Trinidad",
    relatedCommerce: "taller-mojojoy",
    coords: { lat: 10.4212, lng: -75.5483 },
    image: "/art-fair-getsemani-cartagena-street-art.jpg",
    tags: ["arte", "calle", "local"],
    description: "Feria de arte local con artistas de Getsemaní y talleres interactivos.",
    content:
      "Una celebración del arte local donde artistas del barrio Getsemaní exponen sus obras. Incluye talleres de pintura, música en vivo y gastronomía típica.",
  },
  {
    title: "Festival Gastronómico del Caribe",
    slug: "festival-gastronomico-caribe",
    startDate: "2025-08-15",
    endDate: "2025-08-18",
    type: "gastronomia",
    venue: "Plaza Santo Domingo",
    coords: { lat: 10.4242, lng: -75.5489 },
    image: "/caribbean-food-festival-cartagena.jpg",
    tags: ["gastronomía", "caribe", "cultura"],
    description: "Festival que celebra la rica gastronomía caribeña con chefs locales e internacionales.",
    content:
      "Cuatro días de celebración culinaria con los mejores chefs del Caribe. Degustaciones, talleres de cocina y presentaciones culturales.",
  },
  {
    title: "Concierto de Champeta en las Murallas",
    slug: "concierto-champeta-murallas",
    startDate: "2025-09-21",
    type: "concierto",
    venue: "Murallas de Cartagena",
    coords: { lat: 10.4234, lng: -75.5512 },
    image: "/champeta-concert-cartagena-walls-sunset.jpg",
    tags: ["música", "champeta", "murallas"],
    description: "Concierto de champeta al atardecer con vista al mar Caribe.",
    content:
      "Una noche mágica de champeta, el ritmo más auténtico de Cartagena, con las murallas históricas como escenario y el atardecer caribeño de fondo.",
  },
]
