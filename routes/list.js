const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true);
  }
});

//create
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id, priority, dueDate, category, tags } = req.body;
    
    if (!title || !body || !id) {
      return res.status(400).json({ message: "Title, body, and user ID are required" });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ 
      title, 
      body, 
      user: existingUser._id,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category || 'general',
      tags: tags || []
    });
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
    const { title, body, priority, dueDate, category, tags } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const updateData = { title, body };
    if (priority) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;

    const list = await List.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

//getTask
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

//get categories
router.get("/categories/:id", async (req, res) => {
  try {
    const categories = await List.distinct("category", { user: req.params.id });
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get tasks by priority
router.get("/tasksByPriority/:id/:priority", async (req, res) => {
  try {
    const { priority } = req.params;
    const tasks = await List.find({ 
      user: req.params.id, 
      priority: priority 
    }).sort({ createdAt: -1 });
    res.status(200).json({ list: tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get overdue tasks
router.get("/overdueTasks/:id", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const overdueTasks = await List.find({ 
      user: req.params.id,
      dueDate: { $lt: today },
      completed: false
    }).sort({ dueDate: 1 });
    
    res.status(200).json({ list: overdueTasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//add subtask
router.post("/addSubtask/:taskId", async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.taskId;
    
    if (!text) {
      return res.status(400).json({ message: "Subtask text is required" });
    }

    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = {
      id: new Date().getTime().toString(),
      text: text.trim(),
      completed: false
    };

    task.subtasks.push(subtask);
    await task.save();
    
    res.status(200).json({ message: "Subtask added successfully", subtask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//toggle subtask completion
router.patch("/toggleSubtask/:taskId/:subtaskId", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    
    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    subtask.completed = !subtask.completed;
    await task.save();
    
    res.status(200).json({ message: "Subtask updated successfully", subtask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete subtask
router.delete("/deleteSubtask/:taskId/:subtaskId", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    
    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.pull({ _id: subtaskId });
    await task.save();
    
    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create recurring task
router.post("/createRecurringTask", async (req, res) => {
  try {
    const { title, body, id, priority, dueDate, category, tags, recurringPattern, recurringInterval } = req.body;
    
    if (!title || !body || !id) {
      return res.status(400).json({ message: "Title, body, and user ID are required" });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ 
      title, 
      body, 
      user: existingUser._id,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category || 'general',
      tags: tags || [],
      isRecurring: true,
      recurringPattern: recurringPattern || 'daily',
      recurringInterval: recurringInterval || 1
    });
    await list.save();
    
    existingUser.list.push(list);
    await existingUser.save();
    
    res.status(200).json({ message: "Recurring task created successfully", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// File attachment routes
router.post("/uploadAttachment", upload.single('file'), async (req, res) => {
  try {
    const { taskId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const attachment = {
      id: Date.now().toString(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date()
    };

    task.attachments = task.attachments || [];
    task.attachments.push(attachment);
    await task.save();

    res.status(200).json({ 
      message: "File uploaded successfully", 
      attachment 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/downloadAttachment/:attachmentId", async (req, res) => {
  try {
    const { attachmentId } = req.params;
    
    const task = await List.findOne({ 
      "attachments.id": attachmentId 
    });
    
    if (!task) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const attachment = task.attachments.find(att => att.id === attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const filePath = path.join(__dirname, '../uploads', attachment.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, attachment.originalName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteAttachment/:attachmentId", async (req, res) => {
  try {
    const { attachmentId } = req.params;
    
    const task = await List.findOne({ 
      "attachments.id": attachmentId 
    });
    
    if (!task) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const attachment = task.attachments.find(att => att.id === attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', attachment.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove attachment from task
    task.attachments = task.attachments.filter(att => att.id !== attachmentId);
    await task.save();

    res.status(200).json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
