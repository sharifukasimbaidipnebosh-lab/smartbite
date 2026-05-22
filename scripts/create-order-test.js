const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

socket.on("connect", () => {
  console.log("Creating order...");

  socket.emit("create-order", {
    id: "ORDER_123",
    pickup: [25.2048, 55.2708],
    dropoff: [25.2148, 55.2808],
  });
});