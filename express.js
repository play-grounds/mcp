#!/usr/bin/env node

// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Helper function to create a JSON-RPC response
function createResponse (id, result) {
  return {
    jsonrpc: "2.0",
    id: id,
    result: result
  };
}

// Helper function to create a JSON-RPC error response
function createErrorResponse (id, code, message) {
  return {
    jsonrpc: "2.0",
    id: id,
    error: {
      code: code,
      message: message
    }
  };
}

// Handle POST requests to the root endpoint
app.post('/', (req, res) => {
  try {
    const message = req.body;
    console.log("Received message:", message);

    // Validate JSON-RPC request
    if (!message.jsonrpc || message.jsonrpc !== "2.0") {
      return res.json(createErrorResponse(message.id, -32600, "Invalid JSON-RPC request"));
    }

    if (!message.method) {
      return res.json(createErrorResponse(message.id, -32600, "Method is required"));
    }

    // Handle the "initialize" method
    if (message.method === "initialize") {
      const response = {
        capabilities: {
          tools: { echo: { description: "Echo tool" } }
        },
        serverInfo: {
          name: "Simple MCP Server",
          version: "1.0.0"
        }
      };
      res.json(createResponse(message.id, response));
    }
    // Handle the "echo" method
    else if (message.method === "echo") {
      res.json(createResponse(message.id, { echoed: message.params }));
    }
    // If method not found, send an error response
    else {
      res.json(createErrorResponse(message.id, -32601, "Method not found"));
    }
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json(createErrorResponse(null, -32603, "Internal server error"));
  }
});

// Listen on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

