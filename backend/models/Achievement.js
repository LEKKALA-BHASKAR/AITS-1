const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: { type: String },
  certificateURL: { type: String },
  category: { type: String, enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Other'], default: 'Academic' },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', achievementSchema);