const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  theme: {
    primaryColor: { type: String, default: '#3b82f6' }, // Blue default
    mode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' }
  },
  features: {
    enableLeaves: { type: Boolean, default: true },
    enableExpenses: { type: Boolean, default: true },
    enableTimeTracking: { type: Boolean, default: true },
    enablePayroll: { type: Boolean, default: true },
    enableAnnouncements: { type: Boolean, default: true },
    enableTasks: { type: Boolean, default: true },
    enableDocuments: { type: Boolean, default: true },
    enableMeetings: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
