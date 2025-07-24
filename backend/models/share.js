const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  account_id: Number,
  nickname: String,
  type: { type: String, enum: ['replay', 'astuce'], required: true },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Share', shareSchema);
