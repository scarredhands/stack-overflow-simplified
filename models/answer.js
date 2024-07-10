const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Answer', AnswerSchema);
