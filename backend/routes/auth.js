const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
    }

    let user;
    let Model;
    
    if (role === 'admin') {
      Model = Admin;
      user = await Model.findOne({ email });
    } else if (role === 'teacher') {
      Model = Teacher;
      user = await Model.findOne({ email }).populate('departmentId');
    } else if (role === 'student') {
      Model = Student;
      user = await Model.findOne({ email }).populate('departmentId sectionId');
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const { name, adminId, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { adminId }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      adminId,
      email,
      password: hashedPassword,
      role: role || 'Super Admin'
    });

    await admin.save();

    res.status(201).json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;