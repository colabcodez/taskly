const mongoose = require("mongoose");
const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      default: 'general',
    },
    tags: [{
      type: String,
    }],
    subtasks: [{
      id: String,
      text: String,
      completed: {
        type: Boolean,
        default: false,
      },
    }],
    isRecurring: {
      type: Boolean,
      default: false,
    },
        recurringPattern: {
          type: String,
          enum: ['daily', 'weekly', 'monthly', 'yearly'],
          default: undefined,
        },
        recurringInterval: {
          type: Number,
          default: 1,
        },
        attachments: [{
          id: String,
          originalName: String,
          filename: String,
          mimeType: String,
          size: Number,
          path: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        }],
      },
      { timestamps: true }
    );

module.exports = mongoose.model("List", listSchema);
