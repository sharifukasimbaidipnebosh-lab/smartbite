"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

type Driver = {
  driver_id: string;
  latitude: number;
  longitude: number;
};

export default function TrackingPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Load initial data
  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("driver_locations")
      .select("*");

    setDrivers(data || []);
  };

  useEffect(() => {
    fetchDrivers();

    // 🚀 REAL-TIME WEBSOCKET SUBSCRIPTION
    const channel = supabase
      .channel("driver-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations",
        },
        (payload: any) => {
          console.log("Realtime update:", payload);

          // refresh instantly
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
        center={[25.2048, 55.2708]} // Dubai
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