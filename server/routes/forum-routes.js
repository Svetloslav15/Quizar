const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const auth = require('../config/auth');
const ROLES = require('../common/roles');

router.get('/', auth.isAuthenticated, controllers.forum.mainGet);
router.get('/create', auth.isAuthenticated, controllers.forum.createGet);
router.post('/create', auth.isAuthenticated, controllers.forum.createPost);
router.get('/questions/:id', auth.isAuthenticated, controllers.forum.getQuestionById);
router.get('/:subject', auth.isAuthenticated, controllers.forum.filteredBySubjectGet);
router.post('/comments/add/:id', auth.isAuthenticated, controllers.forum.createCommentPost);
router.get('/questions/like/main/:id', auth.isAuthenticated, controllers.forum.likeQuestionPostFromMain);
router.get('/questions/like/:id', auth.isAuthenticated, controllers.forum.likeQuestionPost);
router.get('/questions/dislike/main/:id', auth.isAuthenticated, controllers.forum.dislikeQuestionPostFromMain);
router.get('/questions/dislike/:id', auth.isAuthenticated, controllers.forum.dislikeQuestionPost);
router.get('/comments/like/:commentId/:questionId', auth.isAuthenticated, controllers.forum.likeCommentPost);
router.get('/comments/dislike/:commentId/:questionId', auth.isAuthenticated, controllers.forum.dislikeCommentPost);
router.get('/questions/delete/:id', auth.isInRole(ROLES.Admin), controllers.forum.deleteQuestionById);
router.get('/comments/delete/:commentId/:questionId', auth.isInRole(ROLES.Admin), controllers.forum.deleteCommentId);

module.exports = router;