const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const cloudinary = require('../config/cloudinary');

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { studentId, title, description, category, date, certificateBase64 } = req.body;

    let certificateURL = '';
    if (certificateBase64) {
      const uploadResponse = await cloudinary.uploader.upload(certificateBase64, {
        folder: 'aits_certificates',
        resource_type: 'image'
      });
      certificateURL = uploadResponse.secure_url;
    }

    const achievement = new Achievement({
      studentId,
      title,
      description,
      category,
      date,
      certificateURL
    });

    await achievement.save();

    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { studentId: req.params.studentId };

    if (category) query.category = category;

    const achievements = await Achievement.find(query).sort({ date: -1 });

    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;