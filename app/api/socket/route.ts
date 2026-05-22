import { Server } from "socket.io";
import { subscriber } from "@/lib/redis/broker";

export const runtime = "nodejs";

let io: Server | null = null;

export async function GET() {
  if (!io) {
    io = new Server({
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("Gateway connected:", socket.id);

      // 📡 DRIVER GPS → BROADCAST ONLY
      socket.on("driver-location", (data) => {
        io?.emit("driver-live", data);
      });

      // 📦 ORDER EVENTS
      socket.on("join-order", (orderId) => {
        socket.join(orderId);
      });
    });

    // 📡 REDIS → SOCKET BRIDGE
    subscriber.subscribe("ORDER_ASSIGNED");

    subscriber.on(
      "message",
      (channel, message) => {
        const event = JSON.parse(message);

        if (channel === "ORDER_ASSIGNED") {
          io?.to(event.driverId).emit(
            "assigned-order",
            event
          );
        }
      }
    );
  }

  return new Response(
    "ENTERPRISE SOCKET GATEWAY ACTIVE"
  );
}