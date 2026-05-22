export function calculateDriverPayout(total: number) {
  const platformFee = total * 0.20; // 20%
  const driverGets = total - platformFee;

  return {
    total,
    platformFee,
    driverGets,
  };
}