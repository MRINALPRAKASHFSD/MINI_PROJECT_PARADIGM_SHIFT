const express = require('express');
const Meeting = require('../models/Meeting');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/meetings
router.get('/', auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ companyName: req.user.companyName })
      .populate('organizer', 'name email avatar')
      .populate('participants', 'name email avatar')
      .sort({ date: 1, time: 1 });
    res.json({ meetings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/meetings
router.post('/', auth, async (req, res) => {
  try {
    const meeting = await Meeting.create({ 
      ...req.body, 
      organizer: req.user._id,
      companyName: req.user.companyName 
    });
    if (req.app.get('io')) {
      req.app.get('io').emit('DATA_UPDATED', { type: 'MEETING' });
    }
    res.status(201).json({ meeting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/meetings/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, companyName: req.user.companyName },
      req.body,
      { new: true }
    );
    if (!meeting) return res.status(404).json({ error: 'Meeting not found or unauthorized.' });
    if (req.app.get('io')) {
      req.app.get('io').emit('DATA_UPDATED', { type: 'MEETING' });
    }
    res.json({ meeting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/meetings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, companyName: req.user.companyName });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found or unauthorized.' });
    if (req.app.get('io')) {
      req.app.get('io').emit('DATA_UPDATED', { type: 'MEETING' });
    }
    res.json({ message: 'Meeting deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
