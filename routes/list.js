const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");

//create
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id } = req.body;
    
    if (!title || !body || !id) {
      return res.status(400).json({ message: "Title, body, and user ID are required" });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ title, body, user: existingUser._id });
    await list.save();
    
    existingUser.list.push(list);
    await existingUser.save();
    
    res.status(200).json({ message: "Task added successfully", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const list = await List.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task Updated", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const task = await List.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingUser = await User.findByIdAndUpdate(id, {
      $pull: { list: req.params.id },
    });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await List.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//getTska
router.get("/getTasks/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ list: list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//toggle completion
router.patch("/toggleTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: "Completed status must be a boolean" });
    }

    const task = await List.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = completed;
    await task.save();

    res.status(200).json({ 
      message: `Task ${completed ? 'completed' : 'uncompleted'} successfully`,
      task 
    });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
