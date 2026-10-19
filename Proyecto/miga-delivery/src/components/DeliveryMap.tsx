import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fijar íconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordenadas reales de Cali
const ORIGIN_COORDS: [number, number] = [3.4516, -76.5320]; // Zona Norte / Granada
const DEST_UAO_COORDS: [number, number] = [3.3536, -76.5225]; // Universidad Autónoma de Occidente

// Ruta 1: Óptima calculada por Dijkstra (Por Calle 5ta y Cañasgordas ~ 12.9 km)
const OPTIMAL_ROUTE_COORDS: [number, number][] = [
  ORIGIN_COORDS,
  [3.4400, -76.5350], // Mall Plaza / San Fernando
  [3.4150, -76.5420], // Calle 5ta / Tequendama
  [3.3850, -76.5350], // Unicentro / Ciudad Jardín
  [3.3650, -76.5280], // Valle del Lili
  DEST_UAO_COORDS,     // UAO
];

// Ruta 2: Alternativa (Por Simón Bolívar / Ciudad 2000 ~ 12.4 km)
const ALTERNATIVE_ROUTE_COORDS: [number, number][] = [
  ORIGIN_COORDS,
  [3.4300, -76.5150], // Simón Bolívar Norte
  [3.3950, -76.5180], // Ciudad 2000
  [3.3700, -76.5200], // Caney
  DEST_UAO_COORDS,     // UAO
];

interface DeliveryMapProps {
  distance: number;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ distance }) => {
  return (
    <div className="w-full h-[380px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
      <MapContainer
        center={[3.4000, -76.5280]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Capa de Mapa Real OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ruta Óptima en Púrpura (Destacada) */}
        <Polyline
          positions={OPTIMAL_ROUTE_COORDS}
          pathOptions={{ color: '#6366f1', weight: 6, opacity: 0.9 }}
        />

        {/* Ruta Alternativa en Gris/Azul */}
        <Polyline
          positions={ALTERNATIVE_ROUTE_COORDS}
          pathOptions={{ color: '#94a3b8', weight: 4, dashArray: '8, 8', opacity: 0.7 }}
        />

        {/* Marcador de Origen */}
        <Marker position={ORIGIN_COORDS}>
          <Popup>
            <div className="text-xs font-bold">📍 Origen: Restaurante Miga (Sede Norte)</div>
          </Popup>
        </Marker>

        {/* Marcador de Destino UAO */}
        <Marker position={DEST_UAO_COORDS}>
          <Popup>
            <div className="text-xs font-bold">🎓 Destino: Universidad Autónoma de Occidente (UAO)</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">Distancia óptima: {distance} Km</div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Leyenda flotante tipo Google Maps */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-md z-[1000] text-xs space-y-1 border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-indigo-500 rounded-full" />
          <span className="font-bold text-gray-800">Ruta óptima: 30 min (12.9 km)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-slate-400 rounded-full border-dashed" />
          <span className="text-gray-500">Ruta Alt. (Simón Bolívar): 31 min (12.4 km)</span>
        </div>
      </div>
    </div>
  );
};