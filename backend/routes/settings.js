const express = require('express');
const CompanySettings = require('../models/CompanySettings');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/settings
// Fetch company settings for the authenticated user's company
router.get('/', auth, async (req, res) => {
  try {
    const companyName = req.user.companyName;
    if (!companyName) {
      return res.status(400).json({ error: 'User is not assigned to a company.' });
    }

    let settings = await CompanySettings.findOne({ companyName });
    if (!settings) {
      // Create defaults if not exists
      settings = await CompanySettings.create({ companyName });
    }
    
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings
// Update company settings (Only Admin)
router.put('/', auth, authorize('admin'), async (req, res) => {
  try {
    const companyName = req.user.companyName;
    if (!companyName) {
      return res.status(400).json({ error: 'User is not assigned to a company.' });
    }

    const { theme, features } = req.body;
    
    let settings = await CompanySettings.findOne({ companyName });
    if (!settings) {
      settings = new CompanySettings({ companyName });
    }

    if (theme) settings.theme = { ...settings.theme, ...theme };
    if (features) settings.features = { ...settings.features, ...features };

    await settings.save();

    // Broadcast change to everyone in the company
    if (req.app.get('io')) {
      req.app.get('io').to(companyName).emit('SETTINGS_UPDATED', settings);
      req.app.get('io').to(companyName).emit('DATA_UPDATED');
    }

    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
