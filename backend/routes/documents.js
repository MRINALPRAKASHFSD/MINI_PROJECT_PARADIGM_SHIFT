const express = require('express');
const Doc = require('../models/Document');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/documents
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.employee = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const documents = await Doc.find(filter).populate('employee', 'name employeeId department').sort({ createdAt: -1 });
    const counts = {
      verified: documents.filter(d => d.status === 'verified').length,
      pending: documents.filter(d => d.status === 'pending').length,
      rejected: documents.filter(d => d.status === 'rejected').length,
    };
    res.json({ documents, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents — upload (employee)
router.post('/', auth, async (req, res) => {
  try {
    const doc = await Doc.create({
      ...req.body,
      employee: req.user._id,
      employeeName: req.user.name,
      department: req.user.department,
    });
    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/documents/:id/verify — admin verifies
router.put('/:id/verify', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const doc = await Doc.findByIdAndUpdate(req.params.id, { status: 'verified', verifiedBy: req.user._id }, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/documents/:id/reject
router.put('/:id/reject', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const doc = await Doc.findByIdAndUpdate(req.params.id, { status: 'rejected', verifiedBy: req.user._id }, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Doc.findOneAndDelete({ _id: req.params.id, employee: req.user._id });
    res.json({ message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
