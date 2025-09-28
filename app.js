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
    ? ['https://todo-list-sage-omega.vercel.app', 'https://todo-list-sage-omega.vercel.app/']
    : ['http://localhost:3000', 'http://localhost:1000'],
  credentials: true
}));

// API Routes
app.use("/api/v1", auth);
app.use("/api/v2", list);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
