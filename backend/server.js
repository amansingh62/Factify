// Imported required packages and variables
const dotenv = require("dotenv");
const { createServer } = require('http');
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./src/config/db");

// Loaded environment variables and connected to mongodb
dotenv.config();
connectDB();

// Set constant port from env and fallback to 5000
const PORT = process.env.PORT || 5000;

// Created an http server using Express app
const httpServer = createServer(app);

// Initialized SocketIo connections for real time communication
const io = new Server(httpServer, {
    cors: { origin: "*"}
});

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});

// Started the server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})