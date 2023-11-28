const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected with socket id :", socket.id);
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("show_typing_status");
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("stop_typing_status");
  });
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
