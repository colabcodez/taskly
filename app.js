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

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  // Only serve React app if the build directory exists
  const buildPath = path.join(__dirname, "frontend", "build", "index.html");
  if (require('fs').existsSync(buildPath)) {
    res.sendFile(buildPath);
  } else {
    res.status(404).json({ message: 'Frontend not built' });
  }
});

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
