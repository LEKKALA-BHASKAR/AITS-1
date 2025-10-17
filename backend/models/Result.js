const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: { type: String },
  examType: { type: String, enum: ['Internal', 'External', 'Assignment'], default: 'Internal' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);