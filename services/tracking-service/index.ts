export function normalizeGPS(
  lat: number,
  lng: number
) {
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}