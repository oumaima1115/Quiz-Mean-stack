const mongoose = require('mongoose');

const quizEssaySchema = mongoose.Schema({
  nbrEssay: { type:Number},
  score: { type: Number },
  correctAnswer: { type: Number },
  incorrectAnswer: { type: Number },
  UnAnswered: { type: Number },
  passingGrade: { type: String },
  timeTaken: { type:Number},
  IDResponse: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('QuizEssay', quizEssaySchema);