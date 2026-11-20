"use client"

import { useSyncExternalStore } from "react"

/**
 * Favoritos guardados en el teléfono para quien no tiene cuenta. Al iniciar
 * sesión se suben a la cuenta (components/business/favorites-sync.tsx) y se
 * borran de aquí. localStorage puede no existir o fallar (modo privado): en ese
 * caso todo se comporta como una lista vacía, sin romper.
 */
const KEY = "cartagena-viva:favorites"
const EVENT = "cartagena-viva:favorites-change"
const EMPTY: string[] = []

let cache: { raw: string | null; list: string[] } = { raw: null, list: EMPTY }

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw === cache.raw) return cache.list
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY
    cache = { raw, list }
    return list
  } catch {
    return EMPTY
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...new Set(list)]))
  } catch {
    // sin almacenamiento disponible: el favorito no persiste, pero no rompe
  }
  window.dispatchEvent(new Event(EVENT))
}

export function getLocalFavorites(): string[] {
  return typeof window === "undefined" ? EMPTY : read()
}

export function toggleLocalFavorite(slug: string): boolean {
  const list = read()
  const has = list.includes(slug)
  write(has ? list.filter((s) => s !== slug) : [...list, slug])
  return !has
}

export function clearLocalFavorites() {
  write([])
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener("storage", cb)
  }
}

/** Lista de slugs favoritos del teléfono; vacía en el servidor. */
export function useLocalFavorites(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}
