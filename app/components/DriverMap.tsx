"use client";

import React from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

type Props = {
  driver: any;
};

export default function DriverMap({
  driver,
}: Props) {
  const { isLoaded } =
    useJsApiLoader({
      googleMapsApiKey:
        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    });

  // Workaround for TypeScript JSX typing issue with @react-google-maps/api
  const Map: React.ComponentType<any> = GoogleMap as unknown as React.ComponentType<any>;
  const MarkerComp: React.ComponentType<any> = Marker as unknown as React.ComponentType<any>;

  if (!isLoaded || !driver) {
    return <p>Loading map...</p>;
  }

  return (
    <Map
      zoom={14}
      center={{
        lat: driver.lat,
        lng: driver.lng,
      }}
      mapContainerStyle={{
        width: "100%",
        height: "400px",
      }}
    >
      <MarkerComp
        position={{
          lat: driver.lat,
          lng: driver.lng,
        }}
      />
    </Map>
  );
}