import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching"
import { clientsClaim } from "workbox-core"

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Parameters<typeof precacheAndRoute>[0]
}

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST)

// Clean up outdated caches
cleanupOutdatedCaches()

// Take control of all clients immediately
self.skipWaiting()
clientsClaim()

// Cache strategies for different types of content
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Cache images with cache-first strategy
  if (request.destination === "image") {
    event.respondWith(
      caches.open("images-cache").then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((fetchResponse) => {
            cache.put(request, fetchResponse.clone())
            return fetchResponse
          })
        })
      }),
    )
  }

  // Cache API responses with network-first strategy
  else if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(async () => {
        return (await caches.match(request)) ?? Response.error()
      }),
    )
  }
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  const syncEvent = event as ExtendableEvent & { tag: string }
  if (syncEvent.tag === "background-sync") {
    syncEvent.waitUntil(
      // Handle offline actions when connection is restored
      Promise.resolve().then(() => console.log("Background sync triggered")),
    )
  }
})
