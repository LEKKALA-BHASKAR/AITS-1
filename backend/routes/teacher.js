const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, adminAuth } = require('../middleware/auth');
const Teacher = require('../models/Teacher');
const cloudinary = require('../config/cloudinary');

router.use(auth, adminAuth);

router.post('/', async (req, res) => {
  try {
    const { name, teacherId, email, password, departmentId, phone, subjects, experience, designation } = req.body;

    const existing = await Teacher.findOne({ $or: [{ email }, { teacherId }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Teacher with this email or ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      teacherId,
      email,
      password: hashedPassword,
      departmentId,
      phone,
      subjects,
      experience,
      designation
    });

    await teacher.save();

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({ success: true, data: teacherResponse });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { departmentId } = req.query;
    const query = departmentId ? { departmentId } : {};

    const teachers = await Teacher.find(query)
      .select('-password')
      .populate('departmentId', 'name code')
      .populate('assignedSections');

    res.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .select('-password')
      .populate('departmentId')
      .populate('assignedSections');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.teacherId;

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/upload-image', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'aits_teachers',
      resource_type: 'image'
    });

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { imageURL: uploadResponse.secure_url },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;