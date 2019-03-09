const subjectsJSON = require('../config/subjectsJSON');
const ForumQuestion = require('mongoose').model('ForumQuestion');
const ForumComment = require('mongoose').model('ForumComment');
const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

module.exports = {
    mainGet: async (req, res) => {
        let elements = [];
        for (let key in subjectsJSON) {
            elements.push({
                key: key,
                value: subjectsJSON[key]
            });
        }
        //Pagination
        let questions = await ForumQuestion.find();

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
        //END Pagination
        questions = await ForumQuestion.find()
            .sort({date: 'descending'})
            .skip((currentPage - 1) * 10)
            .limit(10);
        let isAdmin = req.user.roles.indexOf("Admin") > -1;

        questions.forEach(x => {
            x.content = x.content.substring(0, 50) + '...';
            x.likes = x.likes.length;
            x.dislikes = x.dislikes.length;
            x.isAdmin = isAdmin
        });
        res.render('forum/main', {elements, questions, currentPage, previousPage, nextPage});
    },
    filteredBySubjectGet: async (req, res) => {
        let subject = req.params.subject;
        let elements = [];
        for (let key in subjectsJSON) {
            elements.push({
                key: key,
                value: subjectsJSON[key]
            });
        }
        //Pagination
        let questions = await ForumQuestion.find({
            subject: subject
        });

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
        if (questions.length <= 10) {
            nextPage = undefined;
        }
        //END Pagination
        questions = await ForumQuestion.find({
            subject: subject
        }).sort({date: 'descending'})
            .skip((currentPage - 1) * 10)
            .limit(10);
        let isAdmin = req.user.roles.indexOf("Admin") > -1;

        questions.forEach(x => {
            x.content = x.content.substring(0, 100) + '...';
            x.likes = x.likes.length;
            x.dislikes = x.dislikes.length;
            x.isAdmin = isAdmin;
        });
        res.render('forum/main-filtered', {elements, questions, currentPage, previousPage, nextPage, subject});
    },
    createGet: (req, res) => {
        let elements = [];
        for (let key in subjectsJSON) {
            elements.push({
                key: key,
                value: subjectsJSON[key]
            });
        }
        res.render('forum/create-question', {elements});
    },
    createPost: (req, res) => {
        let {title, subject, content} = req.body;
        let questionBody = req.body;
        let userName = req.user.username;
        if (!title.trim() || !subject.trim() || !content.trim()) {
            let elements = [];
            for (let key in subjectsJSON) {
                elements.push({
                    key: key,
                    value: subjectsJSON[key]
                });
            }
            res.render('forum/create-question', {questionBody, elements});
            res.locals.errorMessage = "Fields are required";
            return;
        }
        ForumQuestion.create({
            title: title.trim(),
            subject,
            content: content.trim(),
            likes: [],
            dislikes: [],
            author: userName
        }).then(() => {
            let userId = req.user._id;
            let userRole = req.user.roles[0];
            if (userRole == 'teacher') {
                Teacher.findByIdAndUpdate(userId, {
                    $set: {
                        points: req.user.points + 5
                    }
                }).then(() => {
                    res.redirect('/forum/create');
                }).catch(console.error);
            }
            else{
                Student.findByIdAndUpdate(userId, {
                    $set: {
                        points: req.user.points + 5
                    }
                }).then(() => {
                    res.redirect('/forum/create');
                }).catch(console.error);
            }

        }).catch(() => {
            res.redirect('/forum');
        });
    },
    getQuestionById: async (req, res) => {
        let questionId = req.params.id;
        let question = await ForumQuestion.findById(questionId);
        let elements = [];
        for (let key in subjectsJSON) {
            elements.push({
                key: key,
                value: subjectsJSON[key]
            });
        }
        let comments = await ForumComment.find({
            questionId: questionId
        }).sort({date: 'ascending'});
        let isAdmin = req.user.roles.indexOf("Admin") > -1;
        comments.forEach(x => {
            x.likes = x.likes.length;
            x.dislikes = x.dislikes.length;
            x.isAdmin = isAdmin;
        });
        question.likes = question.likes.length;
        question.dislikes = question.dislikes.length;
        res.render('forum/question-details', {elements, question, comments});
    },
    createCommentPost: (req, res) => {
        let questionId = req.params.id;
        let comment = req.body.comment;
        let author = req.user.username;

        if (comment.trim() === "") {
            res.redirect(`/forum/questions/${questionId}`);
            return;
        }
        ForumComment.create({
            comment: comment.trim(),
            questionId,
            author,
            likes: [],
            dislikes: [],
        }).then(() => {
            let userId = req.user._id;
            let userRole = req.user.roles[0];
            if (userRole == 'teacher') {
                Teacher.findByIdAndUpdate(userId, {
                    $set: {
                        points: req.user.points + 1
                    }
                }).then(() => {
                    res.redirect(`/forum/questions/${questionId}`);
                }).catch(console.error);
            }
            else{
                Student.findByIdAndUpdate(userId, {
                    $set: {
                        points: req.user.points + 1
                    }
                }).then(() => {
                    res.redirect(`/forum/questions/${questionId}`);
                }).catch(console.error);
            }
        }).catch(() => {
            res.redirect(`/forum/questions/${questionId}`);
        });
    },
    likeQuestionPost: async (req, res) => {
        let questionid = req.params.id;
        let userId = req.user._id;

        let question = await ForumQuestion.findById(questionid);
        let likes = question.likes.filter(x => x != userId);
        question.dislikes = question.dislikes.filter(x => x != userId);
        likes.push(userId);
        question.save();
        await ForumQuestion.findByIdAndUpdate(questionid, {
            $set: {
                likes: likes
            }
        });
        res.redirect(`/forum/questions/${questionid}`);
    },
    likeQuestionPostFromMain: async (req, res) => {
        let questionid = req.params.id;
        let userId = req.user._id;

        let question = await ForumQuestion.findById(questionid);
        let likes = question.likes.filter(x => x != userId);
        question.dislikes = question.dislikes.filter(x => x != userId);
        likes.push(userId);
        question.save();
        await ForumQuestion.findByIdAndUpdate(questionid, {
            $set: {
                likes: likes
            }
        });
        res.redirect(`/forum?page=1`);
    },
    dislikeQuestionPostFromMain: async (req, res) => {
        let questionid = req.params.id;
        let userId = req.user._id;

        let question = await ForumQuestion.findById(questionid);
        let dislikes = question.dislikes.filter(x => x != userId);
        dislikes.push(userId);
        question.likes = question.likes.filter(x => x != userId);
        question.save();
        await ForumQuestion.findByIdAndUpdate(questionid, {
            $set: {
                dislikes: dislikes
            }
        });
        res.redirect(`/forum?page=1`);
    },
    dislikeQuestionPost: async (req, res) => {
        let questionid = req.params.id;
        let userId = req.user._id;

        let question = await ForumQuestion.findById(questionid);
        let dislikes = question.dislikes.filter(x => x != userId);
        dislikes.push(userId);
        question.likes = question.likes.filter(x => x != userId);
        question.save();
        await ForumQuestion.findByIdAndUpdate(questionid, {
            $set: {
                dislikes: dislikes
            }
        });
        res.redirect(`/forum/questions/${questionid}`);
    },
    likeCommentPost: async (req, res) => {
        let questionid = req.params.questionId;
        let commentId = req.params.commentId;
        let userId = req.user._id;

        let question = await ForumComment.findById(commentId);
        let likes = question.likes.filter(x => x != userId);
        question.dislikes = question.dislikes.filter(x => x != userId);
        question.save();
        likes.push(userId);
        await ForumComment.findByIdAndUpdate(commentId, {
            $set: {
                likes: likes
            }
        });
        res.redirect(`/forum/questions/${questionid}`);
    },
    dislikeCommentPost: async (req, res) => {
        let questionid = req.params.questionId;
        let commentId = req.params.commentId;
        let userId = req.user._id;

        let question = await ForumComment.findById(commentId);
        let dislikes = question.dislikes.filter(x => x != userId);
        dislikes.push(userId);
        question.likes = question.likes.filter(x => x != userId);
        question.save();
        await ForumComment.findByIdAndUpdate(commentId, {
            $set: {
                dislikes: dislikes
            }
        });
        res.redirect(`/forum/questions/${questionid}`);
    },
    deleteQuestionById: (req, res) => {
        let id = req.params.id;
        ForumQuestion.findByIdAndRemove(id)
            .then(() => {
                res.redirect('/forum?page=1');
            }).catch(console.error)
    },
    deleteCommentId: (req, res) => {
        let commentId = req.params.commentId;
        let questionId = req.params.questionId;
        ForumComment.findByIdAndRemove(commentId)
            .then(() => {
                res.redirect(`/forum/questions/${questionId}`);
            }).catch(console.error)
    }
}