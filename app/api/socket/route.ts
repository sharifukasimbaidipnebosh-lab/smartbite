import { Server } from "socket.io";
import { dispatchOrder } from "@/lib/dispatch/dispatchController";
import { calculateSurge } from "@/lib/pricing/surgePricing";

export const runtime = "nodejs";

let io: Server | null = null;
let drivers: any[] = [];
let activeOrders: any[] = [];

export async function GET() {
  if (!io) {
    io = new Server({
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("connected:", socket.id);

      // DRIVER REGISTER
      socket.on("register-driver", (data) => {
        drivers.push({
          id: socket.id,
          lat: data.lat,
          lng: data.lng,
          active: true,
          reliability: 1,
        });
      });

      // DRIVER LOCATION UPDATE
      socket.on("driver-location", (data) => {
        drivers = drivers.map((d) =>
          d.id === socket.id
            ? { ...d, lat: data.lat, lng: data.lng }
            : d
        );

        io?.emit("driver-live", {
          driverId: socket.id,
          ...data,
        });
      });

      // ORDER CREATION (AI DISPATCH)
      socket.on("create-order", async (order) => {
        activeOrders.push(order);

        const surge = calculateSurge(
          drivers.length,
          activeOrders.length
        );

        const result = await dispatchOrder(io, drivers, order);

        // 🚨 SAFE CHECK (FIX)
        if (!result.success || !result.driver) {
          socket.emit("order-failed", {
            reason: "No drivers available",
          });
          return;
        }

        io?.to(result.driver.id).emit("assigned-order", {
          order,
          eta: result.eta,
          surge,
        });
      });

      // DRIVER DISCONNECT
      socket.on("disconnect", () => {
        drivers = drivers.filter(
          (d) => d.id !== socket.id
        );
      });
    });
  }

  return new Response("PRODUCTION UBER ENGINE ACTIVE");
}