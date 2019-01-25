const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');
const Question = require('mongoose').model('Question');
const subjectsJSON = require('../config/subjectsJSON');

module.exports = {
    allQuestionsGet: async function (req, res) {
        let questions = await Question.find({author: res.locals.currentUser.username});
        res.json({
            success: true,
            data: questions
        });
    },
    editQuestionGet: (req, res) => {
        let id = req.params.id;
        Question.findById(id)
            .then((question) => {
                question.subjectName = subjectsJSON[question.subject];
                res.json({
                    success: true,
                    data: question
                });
            }).catch(err => console.log(err));
    },
    editQuestionPost: (req, res) => {
        let description = req.body.description;
        let difficulty = req.body.difficulty;
        let answerA = req.body.answerA;
        let answerB = req.body.answerB;
        let answerC = req.body.answerC;
        let answerD = req.body.answerD;
        let correctAnswer = req.body.correctAnswer;
        let subject = req.body.subject;
        let classQ = req.body.class;
        let questionid = req.params.id;
        Question.findByIdAndUpdate(questionid, {
            $set:{
                description,
                difficulty,
                answerA,
                answerB,
                answerC,
                answerD,
                correctAnswer,
                subject,
                class: classQ,
            }
        }).then((question) => {
            res.json({
                success: true,
                message: 'Successfully edited question!'
            });
        }).catch(err => console.log(err));
    },
    deleteQuestion: (req, res) => {
        let questionId = req.params.id;
        Question.deleteOne({_id: questionId})
            .then(() => {
                res.json({
                    success: true,
                    message: 'Successfully deleted question!'
                });
            }).catch(err => console.log(err));
    },
    addTeachersQuestionPost: (req, res) => {
        let description = req.body.description;
        let difficulty = req.body.difficulty;
        let answerA = req.body.answerA;
        let answerB = req.body.answerB;
        let answerC = req.body.answerC;
        let answerD = req.body.answerD;
        let correctAnswer = req.body.correctAnswer;
        let subject = req.body.subject;
        let classQ = req.body.class;
        let author = req.body.author;
        let obj = {
            description,
            difficulty,
            answerA,
            answerB,
            answerC,
            answerD,
            correctAnswer,
            author,
            subject,
            class: classQ,
            likes: 0,
            dislikes: 0
        };
        if (description.trim() != "" && difficulty && answerA.trim() != "" && answerB.trim() != "" &&
            answerC.trim() != "" && answerD.trim() != "" && correctAnswer.trim() != "" && subject && classQ && author){
            Question.create(obj).then(() => {
                res.json({
                    success: true,
                    message: 'You added new question successfully!'
                });
                return;
            }).catch(err => console.log(err));
        }
        else{
            res.locals.errorMessage = "Invalid data";
            res.render('teachersPanel/addQuestionView', {obj});
            res.json({
                success: false,
                message: 'Invalid data'
            });
            return;
        }
    }
};