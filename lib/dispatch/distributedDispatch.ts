import { sendEvent } from "@/lib/kafka/producer";

export async function dispatchOrderEvent(
  order: any,
  driver: any,
  eta: number
) {
  await sendEvent("order-events", {
    type: "ORDER_ASSIGNED",
    orderId: order.id,
    driverId: driver.id,
    eta,
  });
}