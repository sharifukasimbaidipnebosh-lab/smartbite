export function calculateETA(
  driverLat: number,
  driverLng: number,
  orderLat: number,
  orderLng: number
) {
  const R = 6371;

  const dLat =
    ((orderLat - driverLat) * Math.PI) / 180;

  const dLng =
    ((orderLng - driverLng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (driverLat * Math.PI) / 180
    ) *
      Math.cos(
        (orderLat * Math.PI) / 180
      ) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const distance =
    R *
    (2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      ));

  // assume 40 km/h
  const etaMinutes =
    (distance / 40) * 60;

  return Math.round(etaMinutes);
}