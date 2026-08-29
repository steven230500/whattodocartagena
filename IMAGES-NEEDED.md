# Imágenes pendientes — fotos reales

Hoy el sitio corre con stock genérico reciclado (foto real de Cartagena, pero NO del lugar específico). Sirve para no mostrar imagen rota, pero no es la foto real del negocio. Reemplazar según prioridad.

## Cómo conseguir cada una (de mejor a peor)

1. **Pedirle al negocio directo.** Estándar en directorios locales — les das exposición gratis, casi siempre mandan 2-3 fotos por WhatsApp/mail. Mejor opción para los 10 comercios de abajo, son reales.
2. **Ir vos con el celular.** Si vas a caminar la ciudad, foto real tuya > cualquier stock. Gratis, sin licencia que pagar, y es exactamente el "no genérico" que buscás en DESIGN.md.
3. **Stock libre, solo para paisaje/landmark (NO para negocios específicos):** Unsplash, Pexels, Pixabay — buscar "Cartagena Colombia" + el lugar (ej. "Las Bóvedas Cartagena", "Castillo San Felipe"). Uso comercial gratis, sin atribución obligatoria en los tres.
4. **Evitar:** scrapear fotos de Google Maps/Instagram del negocio sin permiso — son de quien las subió, no tuyas para usar en un sitio comercial.

## Checklist — lib/data/commerces.ts

| Negocio | Barrio | Foto actual (genérica) | Buscar/pedir |
|---|---|---|---|
| La Cevichería | Centro Histórico | ceviche genérico | plato real del lugar, o fachada |
| Restaurante 1621 | Centro Histórico | festival gastronómico genérico | interior del Sofitel Santa Clara |
| Portal de los Dulces | Centro Histórico | calle colonial genérica | los puestos de dulces reales, gente vendiendo |
| Las Bóvedas | San Diego | muralla genérica | fachada de las bóvedas/arcos específicos |
| Caribe Plaza | Manga | mall genérico | fachada real del centro comercial |
| Mall Plaza El Castillo | Castillogrande | edificios Bocagrande genérico | fachada real, frente al mar |
| Café del Mar | Centro Histórico | atardecer en la muralla genérico | terraza real del bar |
| Bazurto Social Club | Getsemaní | concierto champeta genérico | fachada o interior real del club |
| Casa Abba | San Diego | arte callejero Getsemaní genérico | interior de la galería |
| St. Dom Boutique | Centro Histórico | Puerta del Reloj genérica | vitrina/interior real de la tienda |

## Checklist — collectibles-grid.tsx (barrios)

| Barrio | Foto actual | Buscar |
|---|---|---|
| San Diego | placeholder gris (sin foto) | calle/plaza de San Diego |
| Bocagrande | placeholder gris (sin foto) | skyline playa Bocagrande |

## Algo más importante que las fotos

`lib/data/commerces.ts` tiene teléfono, web e Instagram para cada negocio — y varios son negocios REALES (La Cevichería, el restaurante del Sofitel, Bazurto Social Club). Esos datos de contacto tienen toda la pinta de estar inventados (mismo patrón de teléfono, webs que no parecen ser las reales). Si esto va a producción tal cual, es un problema más serio que la foto: le estás mostrando a un turista un teléfono/web incorrecto de un negocio real que existe.

Antes de publicar, decidí una de estas:
- Confirmás y corregís el contacto real de cada uno (llamada rápida o su Google Business Profile), o
- Los cambiás a negocios ficticios con nombre inventado, para que no se confunda con el real.

Decime cuál preferís y lo dejamos consistente.
