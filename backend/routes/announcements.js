const express = require('express');
const Announcement = require('../models/Announcement');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/announcements
router.get('/', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().populate('author', 'name').sort({ pinned: -1, createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/announcements
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      author: req.user._id,
      authorName: req.user.name,
    });
    res.status(201).json({ announcement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/announcements/:id
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ error: 'Announcement not found.' });
    res.json({ announcement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
