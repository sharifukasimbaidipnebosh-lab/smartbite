"use client";

import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { supabase } from "@/lib/supabase";

export default function DriverMap() {
  const [driver, setDriver] =
    useState<[number, number]>([
      25.2048,
      55.2708,
    ]);

  useEffect(() => {
    loadDriver();

    const channel = supabase
      .channel("drivers-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drivers",
        },
        (payload) => {
          const d: any = payload.new;

          setDriver([
            Number(d.lat),
            Number(d.lng),
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDriver = async () => {
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setDriver([
        Number(data.lat),
        Number(data.lng),
      ]);
    }
  };

  return (
    <MapContainer
      center={driver}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      <Marker position={driver} />
    </MapContainer>
  );
}