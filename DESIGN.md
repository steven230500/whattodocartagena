# Design System — What To Do Cartagena

Borrador inicial. Ajusta valores, no la estructura — la estructura es la que evita que Claude vuelva al promedio genérico.

## Contexto

Subject: guía interactiva de Cartagena de Indias (qué hacer, historia, rutas, comercios, eventos, misas).
Audiencia: turistas extranjeros + locales — dos modos de uso distintos (explorar/descubrir vs. consultar rápido).
Trabajo de la página: que alguien en la calle, con una mano, encuentre "qué hago ahora" en <10s — y que alguien planeando el viaje se quede explorando.
Referencias: fotografía real del proyecto ya en `/public` (murallas, Getsemaní, Palenquera, Castillo San Felipe) — el activo más fuerte que tiene el sitio y el menos aprovechado hoy.
Anti-referencias: cualquier landing SaaS. Nada de "plataforma", nada de dashboard de startup.

## Auditoría — qué hay hoy y por qué se ve genérico

Encontrado en el código actual:

- **Inter** como body font (`app/layout.tsx`) — el tell #1 de output de IA.
- Grid de categorías: icono Lucide en cuadrado de color sólido + `rounded-lg` + `hover:shadow-lg` (`app/explore/page.tsx`) — patrón de tarjeta genérica de plantilla.
- Hero centrado con badge `bg-white/10 backdrop-blur-sm rounded-full` — glassmorphism de manual.
- Bloque de stats "+500 / 15 / +30" en grid simétrico de 4 columnas, número grande + label chico (`hero-section.tsx`) — tell directo de la lista de prohibidos.
- `animate-float` en el título — animación decorativa sin motivo.

Nada de esto es un error de gusto random — es exactamente el output por defecto de un modelo sin dirección. La buena noticia: el proyecto ya tiene material fuerte (fotografía documental real, paleta con intención Caribe/colonial) que la capa visual actual no usa — está enterrado bajo componentes shadcn sin ajustar.

## Color

```
--ink:      #2A1F1A   (texto — marrón-carbón cálido, no negro puro)
--surface:  #FEF7ED   (stone-warm, ya existe — crema cálido, no blanco de plantilla)
--accent:   #FF6B47   (coral — usar UNO solo por vista como acento de acción)
```

Secundarios con rol fijo (no intercambiables entre sí):
- `--caribbean-blue #0EA5E9` → solo para lo relacionado a mar/costa/mapa.
- `--colonial-gold #F59E0B` → solo para historia/patrimonio.
- `--forest #166534` → solo para naturaleza/rutas verdes.

Regla: cada color secundario está *casado* con una categoría de contenido, no es decorativo intercambiable. Si una tarjeta de "misas" usa coral en vez de su color asignado, es señal de que el sistema no se está siguiendo.

## Tipografía

```
Display:  Playfair Display — ya está bien, mantener. Usar SOLO en H1/H2, nunca en body ni botones.
Body:     reemplazar Inter → Instrument Sans (next/font/google, humanista, geométrica, no
          quemada como Inter en output de IA, buena legibilidad en móvil bajo sol)
Escala:   1.25 (major third), base 16px
```

## Layout

Romper el patrón "hero centrado + grid de 3-4 tarjetas redondeadas" en TODA la app, no solo en home. Página por página, no todo de una vez.

```
[ HERO: asimétrico — foto documental real a sangre, texto alineado a la izquierda
  sobre franja de color sólido, NO badge con blur ]
[ nav inferior fija en mobile — ya existe (MobileBottomNav), mantener ]
[ contenido: cards con foto real como protagonista, no icono en caja de color ]
```

## Signature

**La silueta de la muralla (almenas) como elemento gráfico recurrente.**

Cartagena se define visualmente por su muralla — es lo primero que cualquier local o turista reconoce. En vez de un `border-b` recto genérico entre secciones, usar el perfil dentado de las almenas (clip-path SVG) como divisor de sección, borde inferior del nav, o marco de foto destacada. Un solo elemento, repetido con disciplina, en vez de cinco efectos distintos repartidos por el sitio.

## Prohibido

- Inter en body
- Icono Lucide dentro de cuadrado de color sólido como patrón de tarjeta
- Badge con `backdrop-blur` sobre el hero
- Stat block "número grande + label chico" en grid simétrico
- Animación decorativa sin función (`animate-float` y similares)
- Gradientes morado/violeta (no aplica hoy, mantener fuera)
- `rounded-lg` + `shadow-lg` como única señal de interactividad en cards

## Cómo usar esto

1. Antes de tocar una pantalla, léela contra este archivo.
2. Sección por sección — nunca "rediseña la home completa" en un solo prompt.
3. Prueba A/B rápida: generar la misma sección con y sin este archivo referenciado. Si sigue saliendo genérica, el problema es el prompt, no el sistema.
4. `frontend-design` plugin ya instalado (`claude-plugins-official`) — sube el piso, este archivo pone la dirección específica de Cartagena que el plugin no puede inventar solo.
