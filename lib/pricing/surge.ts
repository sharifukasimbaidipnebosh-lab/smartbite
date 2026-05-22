export function surgePrice(
  drivers: number,
  orders: number
) {
  const ratio = orders / (drivers || 1);

  if (ratio < 1) return 1.0;
  if (ratio < 2) return 1.3;
  if (ratio < 3) return 1.7;
  if (ratio < 5) return 2.2;

  return 3.0;
}