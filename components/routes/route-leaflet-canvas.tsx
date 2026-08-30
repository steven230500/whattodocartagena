"use client"

import { useEffect } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface RouteStepPoint {
  id: string
  title: string
  coordinates: { lat: number; lng: number }
}

interface RouteLeafletCanvasProps {
  steps: RouteStepPoint[]
  userLocation: { lat: number; lng: number } | null
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

function FitToSteps({ steps }: { steps: RouteStepPoint[] }) {
  const map = useMap()
  useEffect(() => {
    if (steps.length === 0) return
    const bounds = L.latLngBounds(steps.map((s) => [s.coordinates.lat, s.coordinates.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, steps])
  return null
}

export default function RouteLeafletCanvas({ steps, userLocation }: RouteLeafletCanvasProps) {
  const points = steps.map((s) => s.coordinates)

  return (
    <MapContainer center={[points[0]?.lat ?? 10.423, points[0]?.lng ?? -75.551]} zoom={17} className="h-full w-full">
      <FitToSteps steps={steps} />
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Polyline positions={points.map((p) => [p.lat, p.lng])} pathOptions={{ color: "#ff6b47", dashArray: "6,6", weight: 3 }} />

      {steps.map((step, index) => (
        <Marker key={step.id} position={[step.coordinates.lat, step.coordinates.lng]} icon={makeStepIcon(index + 1)}>
          <Popup>
            <span className="font-semibold">{step.title}</span>
          </Popup>
        </Marker>
      ))}

      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={makeUserIcon()} />}
    </MapContainer>
  )
}
