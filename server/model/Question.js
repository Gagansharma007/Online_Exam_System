const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true }, 
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }
});

module.exports = mongoose.model('Question', questionSchema);
