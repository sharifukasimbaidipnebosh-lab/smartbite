export function assignBestDriver(drivers: any[], order: any) {
  if (!drivers.length) return null;

  let bestDriver = drivers[0];
  let shortestDistance = Infinity;

  for (const driver of drivers) {
    const distance = Math.sqrt(
      Math.pow(driver.lat - order.pickup[0], 2) +
      Math.pow(driver.lng - order.pickup[1], 2)
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      bestDriver = driver;
    }
  }

  return bestDriver;
}

export function calculateETA(driver: any, order: any) {
  const distance = Math.sqrt(
    Math.pow(driver.lat - order.pickup[0], 2) +
    Math.pow(driver.lng - order.pickup[1], 2)
  );

  return Math.round(distance * 12);
}