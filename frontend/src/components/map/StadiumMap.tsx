'use client';

import { useEffect, useState } from 'react';

import { useCrowd } from '@/hooks/useFirestore';
import { CrowdData } from '@/types';
import Legend from './Legend';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Next.js Leaflet marker 404 issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

import React from 'react';
export default React.memo(function StadiumMap({
  onLocationClick,
}: {
  onLocationClick?: (loc: string) => void;
}) {
  const { data: crowdData } = useCrowd();

  // Approximate coordinates for Lusail Stadium
  const stadiumCenter: [number, number] = [25.4208, 51.4903];

  // Mock coordinate mapping for stadium locations
  const coordinates: Record<string, [number, number]> = {
    'Gate A': [25.4215, 51.4903],
    'Gate B': [25.42, 51.4903],
    'Gate C': [25.4208, 51.489],
    'Gate D': [25.4208, 51.4916],
    'Food Court A': [25.4212, 51.4895],
    'Medical Room A': [25.4205, 51.491],
  };

  const crowdMap = React.useMemo(() => {
    const map: Record<string, CrowdData> = {};
    crowdData.forEach((c) => {
      map[c.locationId] = c;
    });
    return map;
  }, [crowdData]);

  const getDensityColor = (locationId: string) => {
    const crowd = crowdMap[locationId];
    if (!crowd) return 'gray';
    if (crowd.density === 'Low') return 'green';
    if (crowd.density === 'Medium') return 'orange';
    return 'red';
  };

  const getCrowdDetails = (locationId: string) => {
    return crowdMap[locationId];
  };

  // Ensure map is only rendered on client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient)
    return (
      <div className="w-full h-full bg-zinc-900 rounded-xl animate-pulse flex items-center justify-center">
        Loading Map...
      </div>
    );

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden glass border-white/10 z-0">
      <MapContainer
        center={stadiumCenter}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />

        {Object.entries(coordinates).map(([name, coords]) => {
          const crowd = getCrowdDetails(name);
          const color = getDensityColor(name);

          return (
            <Marker
              key={name}
              position={coords}
              eventHandlers={{ click: () => onLocationClick && onLocationClick(name) }}
              alt={`Map marker for ${name}`}
              title={name}
            >
              <Popup className="glass-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">{name}</h3>
                  {crowd ? (
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between">
                        <span>People:</span>{' '}
                        <span className="font-semibold">{crowd.peopleCount}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Density:</span>{' '}
                        <span className={`font-semibold text-${color}-500`}>{crowd.density}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Queue:</span>{' '}
                        <span className="font-semibold">{crowd.queueTime} mins</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No live data available</p>
                  )}
                  <button
                    onClick={() => onLocationClick && onLocationClick(name)}
                    className="w-full mt-3 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    aria-label={`Select ${name} as current location`}
                  >
                    Select Location
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <Legend />
    </div>
  );
});
