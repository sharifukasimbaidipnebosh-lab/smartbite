"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
});

export default function LiveMap() {
  const [position, setPosition] = useState({
    lat: 25.2048,
    lng: 55.2708,
  });

  useEffect(() => {
    socket.on("driver-location", (data) => {
      setPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
  }, []);

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[position.lat, position.lng]} icon={icon} />
    </MapContainer>
  );
}