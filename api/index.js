const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Import models and routes
const User = require("../models/user");
const List = require("../models/list");

const app = express();

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

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/todo";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Connect to database
connectDB();

// Test endpoint
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ message: "Auth API is working", timestamp: new Date().toISOString() });
});

// SIGN UP
app.post("/api/v1/register", async (req, res) => {
  try {
    console.log("=== REGISTER ENDPOINT DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const { email, username, password } = req.body;

    // Validate inputs
    if (!email || !username || !password) {
      console.log("Validation failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Checking for existing user with email:", email);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return res.status(400).json({ message: "User Already Exists" });
    }

    console.log("Creating new user...");
    // Hash password and save user
    const hashpassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, username, password: hashpassword });
    await user.save();
    console.log("User created successfully:", user.email);
    res.status(201).json({ message: "Sign Up Successful", user: { email, username } });
  } catch (error) {
    console.error("=== REGISTER ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// SIGN IN
app.post("/api/v1/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please Sign Up First" });
    }

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    // Return user details (excluding password)
    const { password: _, ...others } = user._doc;
    res.status(200).json({ user: others });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the app for Vercel
module.exports = app;
