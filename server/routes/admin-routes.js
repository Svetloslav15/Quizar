const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const auth = require('../config/auth');

router.get('/', auth.isInRole("Admin"), controllers.admin.adminHome);
router.get('/users', auth.isInRole("Admin"), controllers.admin.listUsers);
router.get('/users/:id', auth.isInRole("Admin"), controllers.admin.getCurrentUser);
router.post('/users/makeadmin/:id', auth.isInRole("Admin"), controllers.admin.makeAdmin);
router.post('/users/removeadmin/:id', auth.isInRole("Admin"), controllers.admin.removeAdmin);
router.post('/users/delete/:id', auth.isInRole("Admin"), controllers.admin.removeUser);
router.get('/questions', auth.isInRole("Admin"), controllers.admin.questionsMainGet);
router.get('/questions/search', auth.isInRole("Admin"), controllers.admin.questionsSearch);
router.get('/questions/add', auth.isInRole("Admin"), controllers.admin.addQuestionGet);
router.post('/questions/add', auth.isInRole("Admin"), controllers.admin.addQuestionPost);
router.get('/questions/filtered', auth.isInRole("Admin"), controllers.admin.filteredQuestionsGet);
router.get('/questions/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteQuestion);

router.get('/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionGet);
router.post('/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionPost);
router.get('/reports', auth.isInRole("Admin"), controllers.admin.listReports);
router.get('/reports/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteReport);

router.get('/missions', auth.isInRole("Admin"), controllers.mission.getAll);
router.get('/missions/main', auth.isInRole("Admin"), controllers.mission.missionsMainPage);
router.get('/missions/add', auth.isInRole("Admin"), controllers.mission.addMissionGet);
router.post('/missions/add', auth.isInRole("Admin"), controllers.mission.addMissionPost);
router.get('/missions/edit/:id', auth.isInRole("Admin"), controllers.mission.editMissionGet);
router.post('/missions/edit/:id', auth.isInRole("Admin"), controllers.mission.editMissionPost);
router.get('/missions/delete/:id', auth.isInRole("Admin"), controllers.mission.deleteMission);
router.get('/missions/answer/:id', auth.isAuthenticated, controllers.mission.answerMissionGet);
router.post('/missions/answer/:id', auth.isAuthenticated, controllers.mission.answerMissionPost);

module.exports = router;