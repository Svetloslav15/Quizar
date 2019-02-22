const Question = require('mongoose').model('Question');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');
const Report = require('mongoose').model('Report');

module.exports = {
    start: (req, res) => {
        res.render('game/start');
    },
    settings: (req, res) => {
        res.render('game/settings');
    },
    setCategory: (req, res) => {
        let subject = req.body.subject;
        req.session.subject = subject;
        req.session.questions = [];
        res.redirect('/game/play');
    },
    play: async (req, res) => {
        let category = req.session.subject;
        let questionsUsed = req.session.questions;
        let question = '';
        let questions = await Question.find({});
        if (category !== 'all') {
            questions = questions.filter(x => x.subject === category);
        }
        questions = questions.filter(x => questionsUsed.includes(x._id.toString()) === false);

        if (questions.length == 0) {
            res.redirect('/game/answeredAllQuestions');
            return;
        }
        let min = 0;
        let max = questions.length - 1;
        question = questions[Math.floor(Math.random() * (max - min)) + min];
        res.render('game/main', question);
    },
    answerQuestion: async (req, res) => {
        let questionId = req.params.questionId;
        let userAnswer = req.params.answer;
        let question = await Question.findById(questionId);
        if (question.correctAnswer == userAnswer) {
            addUserPoints(req);
            let questions = req.session.questions;
            questions.push(questionId);
            req.session.questions = questions;
            res.redirect('/game/play')
        }
        else {
            res.redirect('/game/over');
        }
    },
    gameOver: async (req, res) => {
        let id = req.user._id;
        let user = await Student.findById(id);
        if (!user){
            user = await Teacher.findById(id);
        }
        user.points -= 5;
        if (user.points < 0){
            user.points = 0;
        }
        user.save();
        res.render('game/gameOver');
    },
    answeredAllQuestions: (req, res) => {
        res.render('game/allQuestionsAnswered.hbs');
    },
    reportGet: (req, res) => {
        let id = req.params.id.toString();
        res.render('game/addReport', {id});
    },
    reportPost: (req, res) => {
        let questionId = req.params.id;
        let description = req.body.description;
        let author = req.body.author;
        Report.create({description, questionId, author})
            .then((x) => {
                res.redirect('/game/start');
            }).catch(console.error);
    }
};

async function addUserPoints(req) {
    let userId = req.user._id;
    let user = await Student.findById(userId);
    if (!user) {
        user = await Teacher.findById(userId);
    }
    user.points += 3;
    user.save();
}