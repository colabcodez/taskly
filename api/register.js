const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.log("No MongoDB URI provided, skipping database connection");
      return;
    }
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

// Vercel serverless function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({ message: "Register API is working", timestamp: new Date().toISOString() });
  }

  // Only allow POST requests for registration
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    // Check if MongoDB is connected
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({ 
        message: "Database not configured. Please set MONGODB_URI environment variable." 
      });
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
};
