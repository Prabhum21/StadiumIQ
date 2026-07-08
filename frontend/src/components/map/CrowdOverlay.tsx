"use client";

import dynamic from "next/dynamic";
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });

interface CrowdOverlayProps {
  position: [number, number];
  density: "Low" | "Medium" | "High";
}

export default function CrowdOverlay({ position, density }: CrowdOverlayProps) {
  const color = density === "Low" ? "green" : density === "Medium" ? "orange" : "red";
  
  return (
    <CircleMarker 
      center={position} 
      pathOptions={{ color, fillColor: color, fillOpacity: 0.2, weight: 0 }} 
      radius={30}
    />
  );
}
