const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/todo", {
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
