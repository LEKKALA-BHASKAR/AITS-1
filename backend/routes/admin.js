const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Department = require('../models/Department');
const Section = require('../models/Section');

router.use(auth, adminAuth);

router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    const totalTeachers = await Teacher.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const atRiskStudents = await Student.countDocuments({ atRisk: true });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalDepartments,
        atRiskStudents
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/search-student', async (req, res) => {
  try {
    const { query } = req.query;
    
    const students = await Student.find({
      $or: [
        { rollNumber: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).populate('departmentId sectionId').limit(20);

    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/at-risk-students', async (req, res) => {
  try {
    const students = await Student.find({ atRisk: true })
      .populate('departmentId sectionId')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    console.error('At-risk students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;