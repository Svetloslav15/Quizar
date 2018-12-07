const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');
const Question = require('mongoose').model('Question');
const subjectsJSON = require('../config/subjectsJSON');

module.exports = {
    adminHome: (req, res) => {
        res.render('admins/home');
    },
    listUsers: async function (req, res) {
        let students = await Student.find({})
            .sort("username")
            .then(users => {
                return users;
            });
        let teachers = await Teacher.find({})
            .sort("username")
            .then(users => {
                return users;
            });
        let users = students;
        for (let user of teachers) {
            users.push(user);
        }
        users.sort((a, b) => a.username.localeCompare(b.username));
        users.forEach((el, index) => {
            el.position = index + 1;
        });
        res.render('admins/users', {users});
    },
    getCurrentUser: async function (req, res) {
        let userId = req.params.id;
        let user = await Student.findById(userId);
        if (!user) {
            user = await Teacher.findById(userId);
        }
        if (user.roles.indexOf('Admin') > -1) {
            user.isAdmin = true;
        }
        res.render('admins/user-profile.hbs', {user});
    },
    makeAdmin: async function (req, res) {
        let userId = req.params.id;
        let isTeacher = true;
        let user = await Teacher.findById(userId);
        if (!user) {
            user = await Student.findById(userId);
            isTeacher = false;
        }
        let roles = user.roles;
        roles.push("Admin");
        if (isTeacher) {
            await Teacher.findByIdAndUpdate(userId, {
                $set: {roles: roles, isAdmin: true}
            });
        }
        else {
            await Student.findByIdAndUpdate(userId, {
                $set: {roles: roles, isAdmin: true}
            });
        }
        res.redirect('/administration/users');
    },
    removeAdmin: async function (req, res) {
        let userId = req.params.id;
        let isTeacher = true;
        let user = await Teacher.findById(userId);
        if (!user) {
            user = await Student.findById(userId);
            isTeacher = false;
        }
        let roles = user.roles;
        roles = roles.filter(x => x !== "Admin");
        if (isTeacher) {
            await Teacher.findByIdAndUpdate(userId, {
                $set: {roles: roles, isAdmin: false}
            });
        }
        else {
            await Student.findByIdAndUpdate(userId, {
                $set: {roles: roles, isAdmin: false}
            });
        }
        res.redirect('/administration/users');
    },
    questionsMainGet: (req, res) => {
        res.render('admins/mainquestions');
    },
    getQuestionById: async function (req, res) {
        console.log(req.path);
        let id = req.query.id;
        let currentQuestion = await Question.findById(id);
        currentQuestion.subjectName = subjectsJSON[currentQuestion.subject];
        res.render('admins/editQuestionView.hbs', currentQuestion);
    },
    questionsSearch: (req, res) => {
        res.render('admins/searchquestions');
    },
    filteredQuestionsGet: async function(req, res){
        let subject = req.query.subject;
        let className = req.query.class;
        let questions = await Question.find({subject: subject, class: className});
        questions.forEach(x => x.description = x.description.substr(0, 20) + "...");
        res.render('admins/filteredQuestions', {questions});
    },
    editQuestionGet: (req, res) => {
        let id = req.params.id;
        Question.findById(id)
            .then((question) => {
                question.subjectName = subjectsJSON[question.subject];
                res.render('admins/editQuestionView.hbs', question);
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
        let author = req.body.author;
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
            res.redirect('/administration/questions');
        }).catch(err => console.log(err));
    },
    deleteQuestion: (req, res) => {
        let questionId = req.params.id;
        Question.deleteOne({_id: questionId})
            .then(() => {
                res.redirect('/administration/questions');
            }).catch(err => console.log(err));
    },
    addQuestionGet: (req, res) => {
        res.render('admins/addQuestionView');
    },
    addQuestionPost: (req, res) => {
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
                res.locals.successMessage = "You added new question successfully!";
                res.render('admins/addQuestionView');
                return;
            }).catch(err => console.log(err));
        }
        else{
            res.locals.errorMessage = "Invalid data";
            res.render('admins/addQuestionView', {obj});
            return;
        }
    },

    listReports: (req, res) => {
        //TODO
    },
    listArchiveReports: (req, res) => {
        //TODO
    },
    getReport: (req, res) => {
        //TODO
    },
    reportArchive: (req, res) => {
        //TODO
    },
    reportActive: (req, res) => {
        //TODO
    },

    listMissions: (req, res) => {
        //TODO
    },
    addMissionGet: (req, res) => {
        //TODO
    },
    addMissionPost: (req, res) => {
        //TODO
    },
    editMissionGet: (req, res) => {
        //TODO
    },
    editMissionPost: (req, res) => {
        //TODO
    },
    deleteMission: (req, res) => {
        //TODO
    },
};