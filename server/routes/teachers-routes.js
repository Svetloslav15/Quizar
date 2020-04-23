const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const auth = require('../config/auth');
const ROLES = require('../common/roles');

router.get('/home', auth.isInRole(ROLES.Teacher), controllers.teachers.home);
router.get('/questions', auth.isInRole(ROLES.Teacher), controllers.teachers.allQuestionsGet);
router.get('/questions/add', auth.isInRole(ROLES.Teacher), controllers.teachers.addTeachersQuestionGet);
router.post('/questions/add', auth.isInRole(ROLES.Teacher), controllers.teachers.addTeachersQuestionPost);
router.get('/questions/delete/:id', auth.isInRole(ROLES.Teacher), controllers.teachers.deleteQuestion);
router.get('/questions/edit/:id', auth.isInRole(ROLES.Teacher), controllers.teachers.editQuestionGet);
router.post('/questions/edit/:id', auth.isInRole(ROLES.Teacher), controllers.teachers.editQuestionPost);

module.exports = router;