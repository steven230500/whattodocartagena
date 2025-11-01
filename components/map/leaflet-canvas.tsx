"use client";

import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BasePoint, LatLng, PoiType } from "./types";

export default function LeafletCanvas({
  points,
  colorByType,
  onSelect,
  onGoTo,
}: {
  points: BasePoint[];
  colorByType: Record<PoiType, string>;
  onSelect: (p: BasePoint | null) => void;
  onGoTo: (coords: LatLng, label?: string) => void;
}) {
  const mapRef = useRef<L.Map | null>(null);

  // Iconos por defecto
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const makeIcon = (color: string) =>
    L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>`,
      iconAnchor: [10, 10],
    });

  const FitToHistoric = () => {
    const map = useMap();
    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
        const bounds = L.latLngBounds([10.418, -75.558], [10.435, -75.535]); // Centro histórico + San Felipe
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [map]);
    return null;
  };

  return (
    <MapContainer
      center={[10.423, -75.551]}
      zoom={15}
      scrollWheelZoom
      zoomControl={true}
      className="h-full w-full"
    >
      <FitToHistoric />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.coords.lat, p.coords.lng]}
          icon={makeIcon(colorByType[p.type] || "#F97360")}
          eventHandlers={{ click: () => onSelect(p) }}
        >
          <Popup>
            <h4 className="font-semibold">{p.name}</h4>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <button
              className="mt-2 text-sm text-coral underline"
              onClick={() => onGoTo(p.coords, p.name)}
            >
              Ver en Google Maps
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
