"use client";

import dynamic from "next/dynamic";
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

interface RoutePolylineProps {
  positions: [number, number][];
  color?: string;
}

export default function RoutePolyline({ positions, color = "blue" }: RoutePolylineProps) {
  return (
    <Polyline 
      positions={positions} 
      pathOptions={{ color, weight: 4, dashArray: "10, 10" }} 
      className="animate-pulse"
    />
  );
}
