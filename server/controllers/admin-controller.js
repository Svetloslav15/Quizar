const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');
const Question = require('mongoose').model('Question');
const Report = require('mongoose').model('Report');

module.exports = {
    adminHome: (req, res) => {
        res.render('admins/home');
    },
    listUsers: async function (req, res) {
        let users = await Student.find()
            .sort({points: 'descending'});
        let teachers = await Teacher.find();
        for (let teacher of teachers) {
            users.push(teacher);
        }
        let currentPage = Number(req.query.page);
        let numberOfPages = Math.floor(users.length / 10);
        if (users.length % 10 != 0) {
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
        let lastIndex = Math.min(startIndex + 10, users.length - 1);
        let result = [];
        for (let index = startIndex; index <= lastIndex; index++) {
            result.push(users[index]);
        }
        result.forEach((x, i) => {
            x.position = i + 1 + (currentPage - 1) * 10;
        });
        res.render('admins/users', {users: result, previousPage, currentPage, nextPage});
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
        res.redirect('/administration/users?page=1');
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
        res.redirect('/administration/users?page=1');
    },
    questionsMainGet: (req, res) => {
        res.render('admins/mainquestions');
    },
    getQuestionById: async function (req, res) {
        let id = req.body.id;
        //TODO
    },
    questionsSearch: (req, res) => {
        res.render('admins/searchquestions');
    },
    filteredQuestionsGet: async (req, res) => {
        let subject = req.query.subject;
        let className = req.query.class;
        let questions = await Question.find({subject: subject, class: className});
        res.render('admins/list-questions', {questions})
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
        let answers = [answerA, answerB, answerC, answerD];
        answers = Array.from(new Set(answers))
        if (description.trim() != "" && difficulty && answerA.trim() != "" && answerB.trim() != "" &&
            answerC.trim() != "" && answerD.trim() != "" && correctAnswer.trim() != "" &&
            subject && classQ && author && answers.length == 4 && answers.includes(correctAnswer)){
            Question.create(obj).then(async () => {
                let user = await Student.findById(req.user.id);
                if (!user){
                    user = await Teacher.findById(req.user.id);
                }
                user.points += 3;
                user.save();
                res.locals.successMessage = "Успешно добави въпрос!";
                res.render('admins/addQuestionView');
                return;
            }).catch(err => console.log(err));
        }
        else{
            res.locals.errorMessage = "Невалидни данни";
            res.render('admins/addQuestionView', {obj});
            return;
        }
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
        }).then((x) => {
            res.redirect('/administration/questions/search');
        }).catch(err => console.log(err));
    },
    editQuestionGet: (req, res) => {
        let id = req.params.id;
        Question.findById(id)
            .then((question) => {
                res.render('admins/editQuestionView.hbs', {question});
            }).catch(err => console.log(err));
    },
    listReports: async (req, res) => {
        let reports = await Report.find({});
        reports.forEach((x, i) => {
           x.rank = i + 1;
        });
        res.render('admins/listReports', {reports});
    },
    deleteReport: async (req, res) => {
        let id = req.params.id;
        let report = await Report.findByIdAndRemove(id);
        res.redirect('/administration/reports');
    }
};