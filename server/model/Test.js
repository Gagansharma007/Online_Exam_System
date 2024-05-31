const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Ensure unique test titles
  subject: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  timeLimit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
