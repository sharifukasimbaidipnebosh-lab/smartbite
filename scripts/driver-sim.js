const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

let lat = 25.2048;
let lng = 55.2708;

socket.on("connect", () => {
  console.log("Driver connected");

  // register driver
  socket.emit("register-driver", { lat, lng });

  setInterval(() => {
    lat += 0.0005;
    lng += 0.0005;

    socket.emit("driver-location", {
      roomId: "ORDER_123",
      lat,
      lng,
    });

    console.log("moving:", lat, lng);
  }, 2000);
});