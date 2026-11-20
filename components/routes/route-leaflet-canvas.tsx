"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type LatLng = { lat: number; lng: number }

interface RouteStepPoint {
  id: string
  title: string
  coordinates: LatLng
}

interface RouteLeafletCanvasProps {
  steps: RouteStepPoint[]
  /** camino por calles; null = línea recta punteada entre paradas */
  path: LatLng[] | null
  userLocation: LatLng | null
  placeUrl: (p: LatLng) => string
  placeLabel: string
}

const makeStepIcon = (number: number) =>
  L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#1c1917;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);">${number}</div>`,
    iconAnchor: [14, 14],
  })

const makeUserIcon = () =>
  L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 4px rgba(59,130,246,.3);"></div>`,
    iconAnchor: [8, 8],
  })

function FitTo({ points }: { points: LatLng[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    // abajo queda el panel con la distancia y el botón de Google Maps
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), {
      paddingTopLeft: [40, 70],
      paddingBottomRight: [40, 140],
      maxZoom: 18,
    })
  }, [map, points])
  return null
}

export default function RouteLeafletCanvas({ steps, path, userLocation, placeUrl, placeLabel }: RouteLeafletCanvasProps) {
  const stops = useMemo(() => steps.map((s) => s.coordinates), [steps])
  const fit = path ?? stops
  const line = fit.map((p) => [p.lat, p.lng] as [number, number])

  return (
    <MapContainer center={[stops[0]?.lat ?? 10.423, stops[0]?.lng ?? -75.551]} zoom={17} className="h-full w-full">
      <FitTo points={fit} />
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {path ? (
        <>
          <Polyline positions={line} pathOptions={{ color: "#fff", weight: 8, opacity: 0.9 }} />
          <Polyline positions={line} pathOptions={{ color: "#e4572e", weight: 5, lineJoin: "round", className: "route-street-path" }} />
        </>
      ) : (
        <Polyline positions={line} pathOptions={{ color: "#e4572e", dashArray: "6,8", weight: 3 }} />
      )}

      {steps.map((step, index) => (
        <Marker key={step.id} position={[step.coordinates.lat, step.coordinates.lng]} icon={makeStepIcon(index + 1)} title={step.title}>
          <Popup>
            <span className="block font-semibold">{step.title}</span>
            <a href={placeUrl(step.coordinates)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold">
              {placeLabel}
            </a>
          </Popup>
        </Marker>
      ))}

      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={makeUserIcon()} />}
    </MapContainer>
  )
}
