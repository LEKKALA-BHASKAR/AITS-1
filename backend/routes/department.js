const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Department = require('../models/Department');
const Section = require('../models/Section');

router.use(auth);

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, code } = req.body;

    const existing = await Department.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Department code already exists' });
    }

    const department = new Department({ name, code });
    await department.save();

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hodId', 'name teacherId')
      .populate('sections');

    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hodId')
      .populate('sections');

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;