# What to do Cartagena

Una guía interactiva completa para descubrir qué hacer en Cartagena de Indias, Colombia. Explora eventos, comercios, rutas turísticas, historia y más a través de una experiencia inmersiva y gamificada.

## 🌟 Características

- **Mapa Interactivo**: Navega por Cartagena con puntos de interés, rutas y filtros personalizados
- **Eventos Locales**: Descubre eventos culturales, festivales y actividades en tiempo real
- **Comercios y Servicios**: Encuentra restaurantes, tiendas y servicios locales
- **Rutas Turísticas**: Explora rutas temáticas como historia colonial, arte callejero y gastronomía
- **Gamificación**: Colecciona logros y desbloquea contenido exclusivo
- **Horarios de Misas**: Información actualizada sobre servicios religiosos
- **Multidioma**: Soporte para español e inglés
- **Modo Oscuro**: Interfaz adaptable a tus preferencias
- **PWA**: Funciona como aplicación móvil nativa

## 🚀 Tecnologías

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Mapas**: Integración con mapas interactivos
- **Gestión de Estado**: React Hooks
- **Formularios**: React Hook Form con Zod
- **Gráficos**: Recharts
- **Análisis**: Vercel Analytics
- **PWA**: Workbox

## 📦 Instalación

Asegúrate de tener Node.js (versión 18+) y pnpm instalados.

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/whattodocartagena.git
cd whattodocartagena

# Instala dependencias con pnpm
pnpm install

# Inicia el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🏗️ Estructura del Proyecto

```
whattodocartagena/
├── app/                    # Páginas y layouts de Next.js
│   ├── (pages)/           # Rutas principales
│   ├── api/               # Endpoints de API
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base de UI
│   ├── map/              # Componentes del mapa
│   ├── events/           # Componentes de eventos
│   └── ...
├── lib/                  # Utilidades y configuraciones
│   ├── data/             # Datos estáticos
│   ├── types/            # Definiciones TypeScript
│   └── utils.ts          # Funciones auxiliares
├── hooks/                # Hooks personalizados
├── public/               # Archivos estáticos
└── styles/               # Estilos adicionales
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo
pnpm build        # Construye para producción
pnpm start        # Inicia servidor de producción
pnpm lint         # Ejecuta linter

# Pruebas
pnpm test         # Unitarias (vitest): dominio del mapa 3D, datos y estado
pnpm test:e2e     # End-to-end (Playwright) del mapa 3D, escritorio y celular,
                  # contra una API simulada (tests/e2e/mock-api.mjs)

# Mapa 3D
pnpm city3d:build            # Regenera public/3d/cartagena.json desde la caché de OSM
pnpm city3d:build --fetch    # Vuelve a bajar los datos de OpenStreetMap
```

### Mapa 3D ("Cartagena viva", `/map/3d`)

- `scripts/city3d/build.mjs` convierte OpenStreetMap (edificios, muralla, calles, costa, barrios) en
  `public/3d/cartagena.json`. El JSON va al repo: el build no depende de la red. OSM no trae alturas en
  la zona, así que se estiman por barrio; los monumentos (Torre del Reloj, Catedral, San Pedro Claver,
  la Trinidad, Castillo San Felipe) tienen modelo propio en `presentation/mesh/landmarks.ts`.
- `src/features/city3d`: `domain` (proyección, sol, grafo de calles: puro), `application` (estado del
  explorador), `infrastructure` (carga del modelo y adaptadores de la API), `presentation` (escena
  React Three Fiber e interfaz).
- E2E: Chromium headless dibuja WebGL con SwiftShader. Para usar un Chromium local en vez de
  `pnpm exec playwright install chromium`, definir `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
- Datos © OpenStreetMap contributors (ODbL): la atribución se muestra en la escena.

## 🌐 Despliegue

Este proyecto está optimizado para desplegarse en Vercel, pero puede funcionar en cualquier plataforma que soporte Next.js.

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_MAP_API_KEY=tu_api_key_de_mapas
NEXT_PUBLIC_ANALYTICS_ID=tu_id_de_analytics
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Sitio Web**: [whattodocartagena.com](https://whattodocartagena.com)
- **Email**: info@whattodocartagena.com

## 🙏 Agradecimientos

- Cartagena de Indias por su rica historia y cultura
- La comunidad de desarrolladores de Next.js
- Todos los colaboradores que hacen posible este proyecto

---

¡Descubre la magia de Cartagena con What to do Cartagena! 🏰✨