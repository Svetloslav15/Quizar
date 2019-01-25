const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');
const Question = require('mongoose').model('Question');
const subjectsJSON = require('../config/subjectsJSON');

module.exports = {
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
        return res.json({
            success: true,
            data: users
        });
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
        return res.json({
            success: true,
            data: user
        });
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
        return res.json({
            success: true,
            message: 'Successfully made an admin!'
        });
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
        return res.json({
            success: true,
            message: 'Successfully remove an admin!'
        });
    },
    getQuestionById: async function (req, res) {
        let id = req.query.id;
        let currentQuestion = await Question.findById(id);
        currentQuestion.subjectName = subjectsJSON[currentQuestion.subject];
        return res.json({
            success: true,
            data: currentQuestion
        });
    },
    filteredQuestionsGet: async function(req, res){
        let subject = req.query.subject;
        let className = req.query.class;
        let questions = await Question.find({subject: subject, class: className});
        questions.forEach(x => x.description = x.description.substr(0, 20) + "...");
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
                    message: 'Successfully deleted question'
                });
            }).catch(err => console.log(err));
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
                res.json({
                    success: true,
                    message: "You added new question successfully!"
                });
                return;
            }).catch(err => console.log(err));
        }
        else{
            res.locals.errorMessage = "Invalid data";
            res.json({
                success: false,
                message: "Invalid data!",
                data: obj
            });
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