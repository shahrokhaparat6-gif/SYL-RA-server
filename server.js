const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index2.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("chat-message", (message) => {
        io.emit("chat-message", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});