const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: '' },
  companyName: { type: String, required: true }, // Isolates chat into team silos
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
