const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  remark: { type: String, required: true },
  type: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
  category: { type: String, enum: ['Academic', 'Behavioral', 'Attendance', 'Improvement'], default: 'Academic' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Remark', remarkSchema);