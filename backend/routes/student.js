const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, adminAuth, teacherAuth } = require('../middleware/auth');
const Student = require('../models/Student');
const Section = require('../models/Section');
const cloudinary = require('../config/cloudinary');

router.use(auth);

router.post('/', teacherAuth, async (req, res) => {
  try {
    const { name, rollNumber, email, password, departmentId, sectionId, phone, guardianName, guardianPhone, dateOfBirth, address } = req.body;

    const existing = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student with this email or roll number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      departmentId,
      sectionId,
      phone,
      guardianName,
      guardianPhone,
      dateOfBirth,
      address
    });

    await student.save();

    if (sectionId) {
      await Section.findByIdAndUpdate(sectionId, { $push: { studentIds: student._id } });
    }

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({ success: true, data: studentResponse });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { departmentId, sectionId, status, atRisk } = req.query;
    const query = {};

    if (departmentId) query.departmentId = departmentId;
    if (sectionId) query.sectionId = sectionId;
    if (status) query.status = status;
    if (atRisk !== undefined) query.atRisk = atRisk === 'true';

    const students = await Student.find(query)
      .select('-password')
      .populate('departmentId', 'name code')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate('departmentId')
      .populate('sectionId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', teacherAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.rollNumber;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/upload-image', teacherAuth, async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'aits_students',
      resource_type: 'image'
    });

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { imageURL: uploadResponse.secure_url },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'Inactive' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deactivated successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;