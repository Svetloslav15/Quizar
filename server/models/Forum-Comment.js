const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
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
let ForumComment = mongoose.model('ForumComment', commentSchema);