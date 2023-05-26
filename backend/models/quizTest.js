const mongoose = require('mongoose');

const quizTestSchema = mongoose.Schema({
  nbrEssay: { type:Number},
  score: { type: Number },
  correctAnswer: { type: Number },
  incorrectAnswer: { type: Number },
  UnAnswered: { type: Number },
  passingGrade: { type: String },
  timeTaken: { type:Number},
  quizId: {type: mongoose.Schema.Types.ObjectId},
  userId: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('QuizTest', quizTestSchema);