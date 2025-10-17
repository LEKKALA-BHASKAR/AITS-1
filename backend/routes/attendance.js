const express = require('express');
const router = express.Router();
const { auth, teacherAuth } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

router.use(auth);

router.post('/', teacherAuth, async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;

    const attendance = new Attendance({
      studentId,
      subject,
      date,
      status,
      markedBy: req.user.id
    });

    await attendance.save();

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { subject, startDate, endDate } = req.query;
    const query = { studentId: req.params.studentId };

    if (subject) query.subject = subject;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name teacherId')
      .sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        attendance,
        statistics: {
          total,
          present,
          absent: attendance.filter(a => a.status === 'Absent').length,
          late: attendance.filter(a => a.status === 'Late').length,
          percentage
        }
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;