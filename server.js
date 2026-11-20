const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-chat", (chatId) => {
    if (typeof chatId !== "string") return;
    socket.join(chatId);
  });

  socket.on("send-message", (data) => {
    if (!data || typeof data.chatId !== "string") return;
    if (!data.message || typeof data.message !== "object") return;

    socket.to(data.chatId).emit("new-message", data.message);
  });

  socket.on("message-reaction", (data) => {
    if (!data || typeof data.chatId !== "string") return;
    socket.to(data.chatId).emit("reaction-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`SYLORA Server running on port ${PORT}`);
});
