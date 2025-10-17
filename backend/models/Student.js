const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  imageURL: { type: String, default: '' },
  phone: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  backlogCount: { type: Number, default: 0 },
  atRisk: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);