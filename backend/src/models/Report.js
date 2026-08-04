const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: String,
  // Add/Verify these two array fields
  completedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  pendingTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);