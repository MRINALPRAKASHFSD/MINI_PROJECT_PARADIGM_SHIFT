const express = require('express');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/announcements
router.get('/', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ companyName: req.user.companyName }).sort({ pinned: -1, createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/announcements
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { title, content, category, priority, pinned } = req.body;
    
    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'General',
      priority: priority || 'medium',
      pinned: pinned || false,
      companyName: req.user.companyName,
      author: req.user._id,
      authorName: req.user.name,
    });

    // Broadcast as Notification to all employees in the company
    const employees = await User.find({ companyName: req.user.companyName, role: 'employee' });
    
    const notifications = employees.map(emp => ({
      user: emp._id,
      type: 'system',
      title: `Announcement: ${title}`,
      message: content,
      companyName: req.user.companyName
    })).filter(n => n.user);

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    if (req.app.get('io')) {
      req.app.get('io').to(req.user.companyName).emit('DATA_UPDATED');
    }

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
    
    if (req.app.get('io')) {
      req.app.get('io').to(req.user.companyName).emit('DATA_UPDATED');
    }
    
    res.json({ announcement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    
    if (req.app.get('io')) {
      req.app.get('io').to(req.user.companyName).emit('DATA_UPDATED');
    }
    
    res.json({ message: 'Announcement deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
