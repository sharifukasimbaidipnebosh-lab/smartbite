import {
  assignBestDriver,
  calculateETA,
} from "@/lib/dispatch/aiDispatch";

export async function processDispatch(
  order: any,
  drivers: any[]
) {
  const bestDriver =
    assignBestDriver(drivers, order);

  if (!bestDriver) {
    return {
      success: false,
      message: "No driver available",
    };
  }

  const eta = calculateETA(
    bestDriver,
    order
  );

  return {
    success: true,
    driver: bestDriver,
    eta,
  };
}