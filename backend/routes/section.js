const express = require('express');
const router = express.Router();
const { auth, adminAuth, teacherAuth } = require('../middleware/auth');
const Section = require('../models/Section');
const Department = require('../models/Department');

router.use(auth);

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, departmentId, teacherId } = req.body;

    const section = new Section({ name, departmentId, teacherId });
    await section.save();

    await Department.findByIdAndUpdate(
      departmentId,
      { $push: { sections: section._id } }
    );

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { departmentId } = req.query;
    const query = departmentId ? { departmentId } : {};

    const sections = await Section.find(query)
      .populate('departmentId', 'name code')
      .populate('teacherId', 'name teacherId');

    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('departmentId')
      .populate('teacherId')
      .populate('studentIds');

    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;