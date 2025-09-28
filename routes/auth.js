const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Test endpoint for debugging
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Auth API is working", timestamp: new Date().toISOString() });
});

// SIGN UP
router.post("/register", async (req, res) => {
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
router.post("/signin", async (req, res) => {
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

module.exports = router;
