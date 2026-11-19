"use client"

import { useEffect, useMemo, useRef } from "react"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { LatLng, Place } from "../domain/place"
import { PLACE_COLORS } from "./palette"

/** Centro histórico + Getsemaní + San Felipe */
const HISTORIC_BOUNDS = L.latLngBounds([10.418, -75.558], [10.432, -75.536])

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

/** Mismo pin que el mapa 3D: punto con borde blanco y palito; el elegido, con su nombre. */
function pinIcon(place: Place, selected: boolean) {
  const size = selected ? 20 : 14
  const label = selected
    ? `<span style="margin-bottom:4px;white-space:nowrap;border-radius:6px;background:#2A1F1A;color:#fff;padding:3px 8px;font:500 12px/1.3 var(--font-instrument-sans),system-ui;box-shadow:0 2px 8px rgba(0,0,0,.3)">${escapeHtml(place.name)}</span>`
    : ""
  return L.divIcon({
    className: "",
    html: `<div data-map-pin="${place.id}" data-state="${selected ? "selected" : "idle"}" style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);position:absolute;left:0;top:0">${label}<span style="display:block;width:${size}px;height:${size}px;border-radius:999px;background:${PLACE_COLORS[place.kind]};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span><span style="display:block;width:1px;height:10px;background:rgba(255,255,255,.95);box-shadow:0 0 2px rgba(0,0,0,.4)"></span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

const userIcon = L.divIcon({
  className: "",
  html: `<div data-user-location style="width:16px;height:16px;border-radius:999px;background:#0ea5e9;border:3px solid #fff;box-shadow:0 0 0 6px rgba(14,165,233,.25);transform:translate(-50%,-50%)"></div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
})

/** Al cargar, encuadrar los lugares (no un rectángulo fijo que deja el Centro en un rincón). */
function FitPlacesOnce({ places }: { places: Place[] }) {
  const map = useMap()
  const done = useRef(false)
  useEffect(() => {
    if (done.current || places.length === 0) return
    done.current = true
    map.invalidateSize()
    const bounds = L.latLngBounds(places.map((p) => [p.position.lat, p.position.lng] as [number, number]))
    map.fitBounds(bounds.pad(0.08), { padding: [36, 36], maxZoom: 16 })
  }, [map, places])
  return null
}

function FlyToSelection({ selected, user }: { selected: Place | null; user: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.flyTo([selected.position.lat, selected.position.lng], Math.max(map.getZoom(), 17), { duration: 0.6 })
  }, [map, selected])
  useEffect(() => {
    if (!user) return
    // si el usuario está en la zona, incluirlo en el encuadre; si no, quedarse en el centro histórico
    const near = HISTORIC_BOUNDS.pad(1.5).contains([user.lat, user.lng])
    if (near) map.flyToBounds(HISTORIC_BOUNDS.extend([user.lat, user.lng]), { padding: [30, 30], duration: 0.6 })
  }, [map, user])
  return null
}

export default function LeafletPlaces({
  places,
  selectedId,
  user,
  onSelect,
}: {
  places: Place[]
  selectedId: string | null
  user: LatLng | null
  onSelect: (id: string | null) => void
}) {
  const selected = useMemo(() => places.find((p) => p.id === selectedId) ?? null, [places, selectedId])

  return (
    <MapContainer
      bounds={HISTORIC_BOUNDS}
      boundsOptions={{ padding: [20, 20] }}
      scrollWheelZoom
      zoomControl
      className="h-full w-full bg-[#e9dfcf]"
    >
      <TileLayer
        className="places-tiles"
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPlacesOnce places={places} />
      <FlyToSelection selected={selected} user={user} />
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.position.lat, p.position.lng]}
          icon={pinIcon(p, p.id === selectedId)}
          title={p.name}
          alt={p.name}
          zIndexOffset={p.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(p.id === selectedId ? null : p.id) }}
        />
      ))}
      {user && <Marker position={[user.lat, user.lng]} icon={userIcon} interactive={false} />}
    </MapContainer>
  )
}
