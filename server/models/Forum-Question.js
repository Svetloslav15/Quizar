const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.String
    },
    likes: [
        {
            type: String
        }
    ],
    dislikes: [
        {
            type: String
        }
    ],
    date: {
        type: Date,
        default: new Date()
    }
});
let ForumQuestion = mongoose.model('ForumQuestion', questionSchema);