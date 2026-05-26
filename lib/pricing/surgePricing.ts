type Driver = any;
type Order = any;

// 🚀 SIMPLE SURGE PRICING ENGINE
export function calculateSurge(
  driverCount: number,
  activeOrders: number
) {
  if (driverCount === 0) return 3.0;

  const demandRatio = activeOrders / driverCount;

  if (demandRatio < 1) return 1.0;
  if (demandRatio < 2) return 1.5;
  if (demandRatio < 3) return 2.0;

  return 3.0;
}