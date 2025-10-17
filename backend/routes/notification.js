const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.use(auth);

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, message, target, targetIds, priority } = req.body;

    const notification = new Notification({
      title,
      message,
      postedBy: req.user.id,
      target,
      targetIds,
      priority
    });

    await notification.save();

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { target } = req.query;
    const query = target ? { target } : {};

    const notifications = await Notification.find(query)
      .populate('postedBy', 'name adminId')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;