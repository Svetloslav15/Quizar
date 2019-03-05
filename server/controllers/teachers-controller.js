const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');
const Question = require('mongoose').model('Question');
const subjectsJSON = require('../config/subjectsJSON');

module.exports = {
    home: (req, res) => {
        res.render('teachersPanel/main');
    },
    addTeachersQuestionGet: async (req, res) => {
        let user = await Teacher.findById(req.user._id);
        let subjectsUser = user["subjects"];
        subjectsUser.forEach(x => {
            x.key = x;
            x.value = subjectsJSON[x];
        });
        let subjects = [];
        for (let item of subjectsUser) {
            let obj = {
                key: item,
                value: subjectsJSON[item]
            };
            subjects.push(obj);
        }
        res.render('teachersPanel/addQuestionView', {subjects});
    },
    addTeachersQuestionPost: async (req, res) => {
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
        let answers = [answerA, answerB, answerC, answerD];
        answers = Array.from(new Set(answers))
        if (description.trim() != "" && difficulty && answerA.trim() != "" && answerB.trim() != "" &&
            answerC.trim() != "" && answerD.trim() != "" && correctAnswer.trim() != "" &&
            answers.length == 4 && answers.includes(correctAnswer) && subject && classQ && author){
            Question.create(obj).then(async () => {
                let teacher = await Teacher.findById(req.user.id);
                teacher.points += 3;
                teacher.save();
                res.redirect('/teachers/questions/add');
                return;
            }).catch(err => console.log(err));
        }
        else{
            res.locals.errorMessage = "Невалидни данни";
            res.render('teachersPanel/addQuestionView', {obj});
            return;
        }
    },
    allQuestionsGet: async function (req, res) {
        let questions = await Question.find({author: res.locals.currentUser.username});
        let currentPage = Number(req.query.page);
        let numberOfPages = Math.floor(questions.length / 10);
        if (questions.length % 10 != 0) {
            numberOfPages++;
        }
        let previousPage = currentPage - 1;
        if (previousPage < 1) {
            previousPage = undefined;
        }
        let nextPage = currentPage + 1;
        if (nextPage > numberOfPages) {
            nextPage = undefined;
        }
        let startIndex = (currentPage - 1) * 10;
        let lastIndex = Math.min(startIndex + 10, questions.length - 1);
        let result = [];
        for (let index = startIndex; index <= lastIndex; index++) {
            result.push(questions[index]);
        }
        result.forEach((x, i) => {
            x.position = i + 1 + (currentPage - 1) * 10;
        });
        questions.forEach((x, i) => {
           x.rank = i + 1;
        });
        res.render('teachersPanel/list-questions', {questions: result, previousPage, currentPage, nextPage});
    },
    deleteQuestion: (req, res) => {
        let questionId = req.params.id;
        console.log(questionId);
        Question.deleteOne({_id: questionId})
            .then(() => {
                res.redirect('/teachers/questions?page=1');
            }).catch(err => console.log(err));
    },
    editQuestionGet: (req, res) => {
        let subjectsUser = req.user.subjects;
        subjectsUser.forEach(x => {
            x.key = x;
            x.value = subjectsJSON[x];
        });
        let subjects = [];
        for (let item of subjectsUser) {
            let obj = {
                key: item,
                value: subjectsJSON[item]
            };
            subjects.push(obj);
        }
        let id = req.params.id;
        Question.findById(id)
            .then((question) => {
                question.subjectName = subjectsJSON[question.subject];
                res.render('teachersPanel/editQuestionView.hbs', {question, subjects});
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
            res.redirect('/teachers/questions?page=1');
        }).catch(err => console.log(err));
    }
};