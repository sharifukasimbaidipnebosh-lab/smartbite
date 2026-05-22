export type OrderStatus =
  | "created"
  | "assigned"
  | "accepted"
  | "picked_up"
  | "delivered"
  | "cancelled";

export function canTransition(
  from: OrderStatus,
  to: OrderStatus
) {
  const valid: Record<
    OrderStatus,
    OrderStatus[]
  > = {
    created: ["assigned", "cancelled"],
    assigned: ["accepted", "cancelled"],
    accepted: ["picked_up"],
    picked_up: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  return valid[from].includes(to);
}