const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    name:  { type: String, unique: true},
    type:  { type: String},
    IDquestion: { type: Array }, 
    imagePath: { type: String, required: true }, 
    creator: { type: mongoose.Schema.Types.String, ref: "User", required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);
