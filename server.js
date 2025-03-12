const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store all connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Add the new client to the set
  clients.add(ws);

  // Broadcast drawing data to all clients
  ws.on("message", (data) => {
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // Remove the client when they disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Serve the frontend
app.use(express.static("public"));

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});