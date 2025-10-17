const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  target: { type: String, enum: ['all', 'students', 'teachers', 'section', 'department'], default: 'all' },
  targetIds: [{ type: mongoose.Schema.Types.ObjectId }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);