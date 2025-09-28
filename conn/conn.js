const mongoose = require("mongoose");

const conn = async () => {
  try {
    // Use MongoDB Atlas or localhost based on environment
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/todo";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if database connection fails
  }
};

conn();
