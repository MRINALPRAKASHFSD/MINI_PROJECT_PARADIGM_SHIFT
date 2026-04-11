const express = require('express');
const Message = require('../models/Message');
const WorkspaceNote = require('../models/WorkspaceNote');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ── Personal Workspace Notes ──

// GET all personal notes
router.get('/notes', auth, async (req, res) => {
  try {
    const notes = await WorkspaceNote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a personal note
router.post('/notes', auth, async (req, res) => {
  try {
    const { content, status, color } = req.body;
    if (!content) return res.status(400).json({ error: 'Note content is required.' });

    const note = await WorkspaceNote.create({
      userId: req.user._id,
      content,
      status: status || 'Todo',
      color: color || '#3b82f6'
    });
    
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update a note (drag & drop status change or color)
router.put('/notes/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const note = await WorkspaceNote.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found.' });

    res.json({ note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a note
router.delete('/notes/:id', auth, async (req, res) => {
  try {
    const note = await WorkspaceNote.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ error: 'Note not found.' });

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Workspace Chat ──

// GET recent chat history for the company
router.get('/messages', auth, async (req, res) => {
  try {
    if (!req.user.companyName) {
      return res.status(400).json({ error: 'You are not assigned to a company.' });
    }
    
    // Fetch last 100 messages within the same company
    const messages = await Message.find({ companyName: req.user.companyName })
                                  .sort({ createdAt: 1 })
                                  .limit(100);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
