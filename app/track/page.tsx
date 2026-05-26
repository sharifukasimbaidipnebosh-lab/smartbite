"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

type Driver = {
  driver_id: string;
  latitude: number;
  longitude: number;
};

// 🚨 IMPORTANT: disable SSR for Leaflet map
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

import "leaflet/dist/leaflet.css";

export default function TrackingPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("driver_locations")
      .select("*");

    setDrivers(data || []);
  };

  useEffect(() => {
    fetchDrivers();

    const channel = supabase
      .channel("driver-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
        },
        () => {
          fetchDrivers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[25.2048, 55.2708]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {drivers.map((d, i) => (
          <Marker key={i} position={[d.latitude, d.longitude]}>
            <Popup>
              🚚 Driver: {d.driver_id}
              <br />
              Live Location
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}