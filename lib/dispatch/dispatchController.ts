import {
  assignBestDriver,
  calculateETA,
} from "./aiDispatch";

export async function dispatchOrder(
  io: any,
  drivers: any[],
  order: any
) {
  let attempts = 0;
  let driver = null;

  while (attempts < 3) {
    driver = assignBestDriver(
      drivers,
      order
    );

    if (!driver) {
      attempts++;
      continue;
    }

    const eta = calculateETA(
      driver,
      order
    );

    io.to(driver.id).emit(
      "assigned-order",
      {
        order,
        eta,
        attempt: attempts,
      }
    );

    return {
      success: true,
      driver,
      eta,
    };
  }

  return {
    success: false,
    message:
      "No driver available after retries",
  };
}