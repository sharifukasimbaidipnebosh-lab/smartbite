"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

// 🚨 FIX: Leaflet SSR safe imports
const MapContainer = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.MapContainer
    ),
  { ssr: false }
);

const TileLayer = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.TileLayer
    ),
  { ssr: false }
);

const Marker = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.Marker
    ),
  { ssr: false }
);

const Popup = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.Popup
    ),
  { ssr: false }
);

const Polyline = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.Polyline
    ),
  { ssr: false }
);

// 📍 Static points
const restaurant: [number, number] = [
  25.2048, 55.2708,
];

const customer: [number, number] = [
  25.2148, 55.2808,
];

// ⚡ SOCKET CONNECTION
const socket = io("http://localhost:3000", {
  path: "/api/socket",
  transports: ["websocket"],
});

export default function TrackingPage() {
  const [driverPosition, setDriverPosition] =
    useState<[number, number]>(
      restaurant
    );

  const [icon, setIcon] =
    useState<any>(null);

  useEffect(() => {
    // 🟢 Load Leaflet icon only in browser
    import("leaflet").then((L) => {
      const driverIcon = new L.Icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [40, 40],
      });

      setIcon(driverIcon);
    });

    const orderId = "ORDER_1";

    // 🟢 JOIN ORDER ROOM
    socket.emit("join-order", orderId);

    // 🟢 LISTEN FOR LIVE DRIVER LOCATION
    socket.on(
      `order-${orderId}`,
      (data) => {
        if (!data?.lat || !data?.lng)
          return;

        setDriverPosition([
          data.lat,
          data.lng,
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={restaurant}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={restaurant}>
          <Popup>
            Restaurant
          </Popup>
        </Marker>

        <Marker position={customer}>
          <Popup>
            Customer
          </Popup>
        </Marker>

        {icon && (
          <Marker
            position={driverPosition}
            icon={icon}
          >
            <Popup>
              Live Driver 🚗
            </Popup>
          </Marker>
        )}

        <Polyline
          positions={[
            restaurant,
            driverPosition,
            customer,
          ]}
        />
      </MapContainer>
    </div>
  );
}