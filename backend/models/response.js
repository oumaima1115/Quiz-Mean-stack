const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId},
  quizId: { type: mongoose.Schema.Types.ObjectId},
  timeTaken: { type:Number},
  nbrEssay: { type:Number},
  answer: { type: Array}
});

module.exports = mongoose.model('Response', responseSchema);