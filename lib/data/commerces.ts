import type { Commerce } from "@/lib/types/commerce"

export const commerces: Commerce[] = [
  {
    name: "Mallplaza Cartagena",
    slug: "mallplaza-cartagena",
    type: "mall",
    subtype: "centro_comercial",
    barrio: "Bocagrande",
    coords: { lat: 10.4002, lng: -75.5511 },
    image: "/modern-shopping-mall-cartagena.jpg",
    tags: ["eventos", "compras", "familia"],
    contact: {
      web: "https://mallplaza.com.co",
      phone: "+57 5 6420000",
      instagram: "@mallplazacartagena",
    },
    hours: "10:00–21:00",
    description: "Centro comercial con ferias culturales, shows y gastronomía.",
    content:
      "El centro comercial más moderno de Cartagena, con más de 200 tiendas, restaurantes y espacios de entretenimiento. Regularmente organiza eventos culturales y ferias gastronómicas.",
  },
  {
    name: "Taller Mojojoy",
    slug: "taller-mojojoy",
    type: "artisan",
    subtype: "tejidos",
    barrio: "Getsemaní",
    coords: { lat: 10.4231, lng: -75.547 },
    image: "/traditional-weaving-workshop-cartagena.jpg",
    priceHint: "$$",
    tags: ["hecho_a_mano", "tradición"],
    contact: {
      whatsapp: "+57 300 1234567",
      instagram: "@tallermojojoy",
    },
    description: "Taller artesanal de tejidos tradicionales cartageneros.",
    content:
      "Un taller familiar que preserva las técnicas ancestrales de tejido. Aquí puedes encontrar hamacas, bolsos y accesorios hechos a mano con materiales naturales.",
  },
  {
    name: "La Cevichería",
    slug: "la-cevicheria",
    type: "food",
    subtype: "mariscos",
    barrio: "Centro Histórico",
    coords: { lat: 10.4236, lng: -75.5478 },
    image: "/traditional-ceviche-restaurant-cartagena.jpg",
    priceHint: "$$$",
    tags: ["mariscos", "tradicional", "caribe"],
    contact: {
      phone: "+57 5 6641492",
      instagram: "@lacevicheriacartagena",
    },
    hours: "12:00–22:00",
    description: "El mejor ceviche de Cartagena con recetas tradicionales del Caribe.",
    content:
      "Restaurante icónico que sirve los mejores ceviches y mariscos frescos de la ciudad. Sus recetas han pasado de generación en generación.",
  },
]
