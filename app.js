const express = require("express");
const app = express();
const cors = require("cors");
require("./conn/conn");
const path = require("path");
const auth = require("./routes/auth");
const list = require("./routes/list");

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://todo-list-eta-gold.vercel.app',
        'https://todo-list-eta-gold.vercel.app',
        'https://todo-list-eta-gold.vercel.app/'
      ]
    : ['http://localhost:3000', 'http://localhost:1000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use("/api/v1", auth);
app.use("/api/v2", list);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "TodoList API is running", timestamp: new Date().toISOString() });
});

// Test endpoint for debugging
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
