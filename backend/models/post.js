const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, unique:   true, required: true },
  type: { type: String, required: true },
  feedback: { type: String, required: true },
  answer: { type: Array, required: true },
  imagePath: { type: String, required: true }, 
  correctChoices: {type: Number},
  numberOfChoices: {type: Number},
  quiz: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Post', postSchema);
