const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// SIGN UP
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate inputs
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Hash password and save user
    const hashpassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, username, password: hashpassword });
    await user.save();
    res.status(201).json({ message: "Sign Up Successful" });
  } catch (error) {
    console.error(error);
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
