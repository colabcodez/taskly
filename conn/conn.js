const mongoose = require("mongoose");

const conn = async () => {
  try {
    // Use MongoDB Atlas or localhost based on environment
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/todo";
    
    await mongoose
      .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB successfully");
      });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

conn();
