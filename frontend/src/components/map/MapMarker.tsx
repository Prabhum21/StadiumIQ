"use client";

import dynamic from "next/dynamic";
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

interface MapMarkerProps {
  position: [number, number];
  name: string;
  crowdData?: any;
  color?: string;
  onClick?: () => void;
}

export default function MapMarker({ position, name, crowdData, color = "gray", onClick }: MapMarkerProps) {
  return (
    <Marker position={position} eventHandlers={{ click: () => onClick && onClick() }}>
      <Popup className="glass-popup">
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">{name}</h3>
          {crowdData ? (
            <div className="space-y-1 text-sm">
              <p className="flex justify-between"><span>People:</span> <span className="font-semibold">{crowdData.peopleCount}</span></p>
              <p className="flex justify-between"><span>Density:</span> <span className={`font-semibold text-${color}-500`}>{crowdData.density}</span></p>
              <p className="flex justify-between"><span>Queue:</span> <span className="font-semibold">{crowdData.queueTime} mins</span></p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No live data available</p>
          )}
          <button 
            onClick={onClick}
            className="w-full mt-3 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Select Location
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
