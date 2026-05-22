import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function getRoute(origin: string, destination: string) {
  const res = await client.directions({
    params: {
      origin,
      destination,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  });

  return res.data;
}