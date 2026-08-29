# Backend — plan

Borrador. Las 3 cosas que pediste (panel de contenido, cuentas de usuario, negocios auto-gestionados) son en realidad UN backend, no tres — comparten la misma base: Postgres + API en Go + sistema de roles. Lo que cambia es el rol de quien pega a la API.

## Hoy (para no perder de vista qué cambia)

Todo vive hardcodeado en `lib/data/*.ts` (`commerces.ts`, `events.ts`, `parishes.ts`, `plans.ts`), importado directo por las páginas de Next. Cero base de datos, cero auth, cero persistencia — el "progreso" de coleccionables en `user-progress.tsx` es un objeto fijo en el componente, no se guarda en ningún lado. Cero dependencias de auth/DB en `package.json`.

## Roles (misma tabla `users`, un campo `role`)

- **visitor** — no logueado, solo lee (como hoy)
- **user** — cuenta logueada: favoritos, rutas guardadas, progreso de coleccionables real
- **business_owner** — todo lo de `user` + puede editar SOLO los negocios que reclamó
- **admin** — vos. Edita todo, aprueba reclamos de negocio, modera reviews

## Modelo de datos (Postgres)

Mapeo directo desde los types que ya existen en `lib/types/`, más lo nuevo que hace falta:

```
users            id, email, password_hash, role, created_at
businesses       ← de Commerce: name, slug, type, subtype, barrio, coords,
                   image, tags[], contact_jsonb, hours, price_hint, description
                   + owner_id (FK a users, null hasta que alguien lo reclame)
events           ← de Event: title, slug, start/end_date, type, venue,
                   related_commerce_id (FK), coords, image, tags[], description
parishes         ← de Parish: name, address, neighborhood, phone,
                   schedules_jsonb
plans            ← de Plan: title, description, type, price, date, time,
                   location, neighborhood
routes           ← NO existe en lib/data hoy, está hardcodeada inline en
                   app/routes/[id]/page.tsx con SOLO 1 de las "15 rutas" reales.
                   Hay que modelarla desde cero: route_steps como tabla aparte
business_claims  business_id, user_id, status (pending/approved/rejected)
user_favorites   user_id, business_id
user_route_progress   user_id, route_id, step_index, completed_at
user_collectibles      user_id, collectible_id, found_at
```

## API (Go, REST, JSON)

```
GET  /api/businesses            ?type=&barrio=&q=       — público
GET  /api/businesses/:slug                              — público
POST /api/businesses/:id        (solo owner del negocio o admin)
POST /api/businesses/:id/claim  (solo user logueado → crea business_claim)

GET  /api/events, /api/plans, /api/parishes, /api/routes  — mismo patrón

POST /api/auth/register, /api/auth/login, /api/auth/logout
GET  /api/me                    — perfil + favoritos + progreso

POST /api/me/favorites/:business_id
POST /api/me/route-progress/:route_id
POST /api/me/collectibles/:collectible_id

# admin-only
GET  /api/admin/claims          — cola de reclamos pendientes
POST /api/admin/claims/:id/approve
```

Framework: **Gin** — es el que tiene más ejemplos/docs para alguien haciendo su primer backend en Go, no hace falta nada más pesado para esto. DB: `pgx` + `sqlc` (SQL a mano, tipado, sin ORM mágico — es donde Go realmente se siente bien comparado a un ORM tipo Prisma).

## Auth

JWT access token (corta duración) + refresh token en cookie httpOnly. Passwords con `bcrypt`. Nada de Auth0/Clerk a menos que quieras ahorrarte el trabajo — para un proyecto propio, rolarlo vos en Go es razonable y es justo el tipo de cosa que sirve para aprender el lenguaje.

## Deploy en tu droplet

Un solo `docker-compose.yml`:

```
services:
  postgres   (imagen oficial, volumen persistente)
  api        (tu binario Go, Dockerfile simple, multi-stage build)
  caddy      (reverse proxy + HTTPS automático — mucho más simple que nginx+certbot)
```

Pregunta antes de avanzar: **¿el Next.js también va a vivir en ese droplet, o se queda donde está hoy (Vercel u otro) y solo el backend Go va al droplet?** Si va todo junto, sumamos un cuarto servicio `web` al mismo compose y es un solo `docker compose up -d` para todo. Si el front se queda separado, hay que configurar CORS entre dominios — no es difícil, pero cambia la config.

## Orden sugerido (no todo junto)

1. **Fase 1 — fundación:** Postgres + API Go con auth (register/login/me) + migrar `commerces`/`events`/`parishes`/`plans` a la DB con un script de seed (los datos que ya arreglamos hoy). Next.js sigue leyendo estático por ahora — no tocamos el frontend todavía.
2. **Fase 2 — Next.js lee de la API** en vez de `lib/data/*.ts`. Es el momento de más riesgo de romper cosas porque toca TODAS las páginas que hoy hacen `import { commerces } from "@/lib/data/commerces"`.
3. **Fase 3 — panel admin** (rutas protegidas dentro del mismo Next.js, pegándole a la API con rol admin). Esto ya te resuelve el dolor de hoy (editar sin tocar código).
4. **Fase 4 — cuentas de usuario** en el frontend: login real, favoritos, progreso de coleccionables que persiste.
5. **Fase 5 — negocios se auto-gestionan:** flujo de reclamo + panel simplificado para `business_owner`.

Fase 1 es la que menos riesgo tiene y ya te deja algo corriendo en el droplet para probar. ¿Arrancamos por ahí, o querés que ajuste el orden?
