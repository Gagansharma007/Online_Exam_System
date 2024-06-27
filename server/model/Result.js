const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  correct: { type: Number, required: true },
  incorrect: { type: Number, required: true },
  notAttempted: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  attemptedAnswers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' }
    }
  ]
});

module.exports = mongoose.model('Result', resultSchema);