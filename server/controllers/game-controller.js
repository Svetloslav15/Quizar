const Question = require('mongoose').model('Question');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');
const Report = require('mongoose').model('Report');
const Statistic = require('mongoose').model('Statistic');

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
        req.session.lives = 3;
        req.session.correctAnswersCount = 0;
        req.session.wrongAnswersCount = 0;
        req.session.repeatedCorrectAnswers = 0;

        res.redirect('/game/play');
    },
    play: async (req, res) => {
        let category = req.session.subject;
        let questionsUsed = req.session.questions;
        let livesCount = req.session.lives;

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
        let lives = [];
        for (let i = 0; i < livesCount; i++) {
            lives.push(1);
        }
        res.render('game/main', {question, lives});
    },
    answerQuestion: async (req, res) => {
        let questionId = req.params.questionId;
        let userAnswer = req.params.answer;
        let correctAnswersCount = req.session.correctAnswersCount;
        let wrongAnswersCount = req.session.wrongAnswersCount;
        let repeatedCorrectAnswers = req.session.repeatedCorrectAnswers;

        let question = await Question.findById(questionId);
        if (question.correctAnswer == userAnswer) {
            if (+repeatedCorrectAnswers === 5){
                req.session.lives = +req.session.lives + 1;
                req.session.repeatedCorrectAnswers = 0;
            }
            addUserPoints(req);
            let questions = req.session.questions;
            questions.push(questionId);
            req.session.questions = questions;
            req.session.repeatedCorrectAnswers = +repeatedCorrectAnswers + 1;
            req.session.correctAnswersCount = +correctAnswersCount + 1;
            res.redirect('/game/play')
        }
        else {
            req.session.repeatedCorrectAnswers = 0;
            req.session.wrongAnswersCount = +wrongAnswersCount + 1;
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

        let lives = req.session.lives - 1;
        req.session.lives--;
        let isDead = false;
        if (+lives === 0){
            isDead = true;
            Statistic.create({
                correctAnswersCount: +req.session.correctAnswersCount,
                wrongAnswersCount: +req.session.wrongAnswersCount,
                userId: id
            }).then(() => {
                res.render('game/gameOver');
            })
        }
        if (!isDead){
            res.redirect('/game/play');
        }
    },
    gameOverOver: async (req, res) => {
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
        Statistic.create({
            correctAnswersCount: +req.session.correctAnswersCount,
            wrongAnswersCount: +req.session.wrongAnswersCount,
            userId: req.user._id
        }).then(() => {
            res.render('game/allQuestionsAnswered.hbs');
        })
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
    },
    gameStatisticsGet: (req, res) => {
        Statistic.find({userId: req.user._id.toString()})
            .then(statistics => {
                statistics.forEach((x, i) => {
                    x.position = i + 1;
                    x.username = req.user.username
                });
                res.render('game/game-statistics.hbs', {statistics});
            });
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