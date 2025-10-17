const express = require('express');
const router = express.Router();
const { auth, teacherAuth } = require('../middleware/auth');
const Remark = require('../models/Remark');

router.use(auth);

router.post('/', teacherAuth, async (req, res) => {
  try {
    const { studentId, remark, type, category } = req.body;

    const remarkDoc = new Remark({
      studentId,
      teacherId: req.user.id,
      remark,
      type,
      category
    });

    await remarkDoc.save();

    res.status(201).json({ success: true, data: remarkDoc });
  } catch (error) {
    console.error('Create remark error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { type, category } = req.query;
    const query = { studentId: req.params.studentId };

    if (type) query.type = type;
    if (category) query.category = category;

    const remarks = await Remark.find(query)
      .populate('teacherId', 'name teacherId')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: remarks });
  } catch (error) {
    console.error('Get remarks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const remark = await Remark.findByIdAndDelete(req.params.id);

    if (!remark) {
      return res.status(404).json({ success: false, message: 'Remark not found' });
    }

    res.json({ success: true, message: 'Remark deleted successfully' });
  } catch (error) {
    console.error('Delete remark error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;