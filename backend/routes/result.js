const express = require('express');
const router = express.Router();
const { auth, teacherAuth } = require('../middleware/auth');
const Result = require('../models/Result');

router.use(auth);

router.post('/', teacherAuth, async (req, res) => {
  try {
    const { studentId, semester, subject, marks, maxMarks, grade, examType } = req.body;

    const result = new Result({
      studentId,
      semester,
      subject,
      marks,
      maxMarks,
      grade,
      examType,
      createdBy: req.user.id
    });

    await result.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create result error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { semester, examType } = req.query;
    const query = { studentId: req.params.studentId };

    if (semester) query.semester = parseInt(semester);
    if (examType) query.examType = examType;

    const results = await Result.find(query)
      .populate('createdBy', 'name teacherId')
      .sort({ semester: 1, subject: 1 });

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', teacherAuth, async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;