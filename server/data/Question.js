const mongoose = require('mongoose');

let questionSchema = mongoose.Schema({
    description: {type: String, required: true},
    difficulty: {type: Number, required: true},
    answerA: {type: String, required: true},
    answerB: {type: String, required: true},
    answerC: {type: String, required: true},
    answerD: {type: String, required: true},
    correctAnswer: {type: String, required: true},
    author: {type: String, required: true},
    subject: {type: String, required: true},
    class: {type: Number, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true}
});

let Question = mongoose.model("Question", questionSchema);
module.exports = Question;