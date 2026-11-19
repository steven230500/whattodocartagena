// API simulada de cartagena-api para las pruebas E2E del mapa 3D.
// Endpoints que usa la página: negocios, rutas, sesión y progreso de rutas.
// /__state devuelve lo que la app escribió; /__reset lo limpia.
import http from "node:http"

const port = Number(process.env.MOCK_API_PORT || 4899)

const businesses = [
  {
    id: "b1", name: "Café E2E", slug: "cafe-e2e", type: "food", subtype: "cafe", barrio: "Centro",
    lat: 10.4243, lng: -75.5517, image: "", tags: [], description: "Café de prueba frente a la plaza.",
    description_en: "Test café by the square.", hours: "08:00 - 18:00", price_hint: "$", phone: null, web: null,
    email: null, instagram: null, owner_id: null,
  },
  {
    id: "b2", name: "Galería E2E", slug: "galeria-e2e", type: "culture", subtype: "galeria", barrio: "Getsemaní",
    lat: 10.4207, lng: -75.5458, image: "", tags: [], description: "Galería de prueba en Getsemaní.",
    description_en: null, hours: "Mié-Dom 10:00-19:00", price_hint: null, phone: null, web: null, email: null, instagram: null,
    owner_id: null,
  },
]

const step = (id, title, lat, lng, position) => ({
  id, title, description: `${title} (prueba)`, audio_url: null, duration: null, lat, lng, image: null, position,
})

const routes = [
  {
    id: "r-e2e", slug: "ruta-e2e", title: "Ruta E2E", title_en: "E2E Route", description: "Ruta de prueba",
    description_en: null, duration: "1 hora", distance: "1.2 km", difficulty: "easy", category: "history",
    image: "", highlights: [], audio_guide: false, offline: false, price: "Gratis",
    steps: [
      step("s1", "Torre del Reloj", 10.42302, -75.54921, 0),
      step("s2", "Plaza de Santo Domingo", 10.42435, -75.55198, 1),
      step("s3", "Catedral", 10.42371, -75.55066, 2),
    ],
  },
  {
    // sin coordenadas: el explorador 3D debe descartarla
    id: "r-sin-mapa", slug: "ruta-sin-mapa", title: "Ruta sin mapa", title_en: null, description: "",
    description_en: null, duration: "", distance: "", difficulty: "easy", category: "history", image: "",
    highlights: [], audio_guide: false, offline: false, price: "",
    steps: [{ ...step("x1", "Sin ubicación", null, null, 0) }],
  },
]

const plans = [
  {
    id: "p1", title: "Cine al aire libre E2E", description: "Película en el parque", type: "cultural", price: "free",
    price_amount: null, date: "Primer viernes del mes", time: "7:00 PM", location: "Parque Centenario", neighborhood: "Centro",
  },
  {
    id: "p2", title: "Noche de salsa E2E", description: "Salsa en vivo", type: "nightlife", price: "paid",
    price_amount: "$50.000 COP", date: "Viernes y sábados", time: "9:00 PM", location: "Café Havana", neighborhood: "Getsemaní",
  },
]

// un evento que siempre cae en los próximos días, para la sección "Esta semana"
const inTwoDays = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10)
const events = [
  {
    id: "ev1", title: "Festival E2E", title_en: "E2E Festival", slug: "festival-e2e", start_date: inTwoDays, end_date: null,
    type: "festival", venue: "Plaza de la Aduana", related_business_id: null, lat: 10.4226, lng: -75.5497, image: "",
    tags: [], description: "Festival de prueba", description_en: null, content: null,
  },
]

const state = { progressPuts: [], savedProgress: { "r-e2e": 1 } }

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" })
  res.end(JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve) => {
    let data = ""
    req.on("data", (c) => (data += c))
    req.on("end", () => resolve(data ? JSON.parse(data) : {}))
  })

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`)
    const path = url.pathname
    const authed = (req.headers.authorization || "").startsWith("Bearer ")

    if (path === "/__state") return json(res, 200, state)
    if (path === "/__reset") {
      state.progressPuts = []
      state.savedProgress = { "r-e2e": 1 }
      return json(res, 200, state)
    }
    if (path === "/api/businesses") return json(res, 200, businesses)
    if (path === "/api/routes") return json(res, 200, routes)
    if (path === "/api/plans") return json(res, 200, plans)
    if (path === "/api/events") return json(res, 200, events)
    const eventMatch = path.match(/^\/api\/events\/([^/]+)$/)
    if (eventMatch) {
      const e = events.find((x) => x.slug === eventMatch[1])
      return e ? json(res, 200, e) : json(res, 404, { error: "not found" })
    }
    const routeMatch = path.match(/^\/api\/routes\/([^/]+)$/)
    if (routeMatch) {
      const r = routes.find((x) => x.slug === routeMatch[1])
      return r ? json(res, 200, r) : json(res, 404, { error: "not found" })
    }
    if (path === "/api/me") {
      return authed
        ? json(res, 200, { id: "u1", email: "e2e@example.com", role: "user", created_at: "2026-01-01T00:00:00Z" })
        : json(res, 401, { error: "unauthorized" })
    }
    const progressMatch = path.match(/^\/api\/me\/route-progress\/([^/]+)$/)
    if (progressMatch) {
      if (!authed) return json(res, 401, { error: "unauthorized" })
      const id = progressMatch[1]
      if (req.method === "PUT") {
        const body = await readBody(req)
        state.progressPuts.push({ routeId: id, step: body.current_step })
        state.savedProgress[id] = body.current_step
        return json(res, 200, { route_id: id, current_step: body.current_step, updated_at: new Date().toISOString() })
      }
      const saved = state.savedProgress[id]
      return saved == null
        ? json(res, 404, { error: "not found" })
        : json(res, 200, { route_id: id, current_step: saved, updated_at: "2026-11-19T00:00:00Z" })
    }
    if (path.startsWith("/api/me/")) return json(res, 200, [])
    return json(res, 404, { error: `mock: ${path} no existe` })
  })
  .listen(port, "127.0.0.1", () => console.log(`mock api en :${port}`))
