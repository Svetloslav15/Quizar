const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const auth = require('../config/auth');

router.get('/start', auth.isAuthenticated, controllers.game.start);
router.get('/settings', auth.isAuthenticated, controllers.game.settings);
router.post('/settings', auth.isAuthenticated, controllers.game.setCategory);
router.get('/play', auth.isAuthenticated, controllers.game.play);
router.get('/answer/:questionId/:answer', auth.isAuthenticated, controllers.game.answerQuestion);
router.get('/over', auth.isAuthenticated, controllers.game.gameOver);
router.get('/over/over', auth.isAuthenticated, controllers.game.gameOverOver);
router.get('/answeredAllQuestions', auth.isAuthenticated, controllers.game.answeredAllQuestions);
router.get('/report/:id', auth.isAuthenticated, controllers.game.reportGet);
router.post('/report/:id', auth.isAuthenticated, controllers.game.reportPost);
router.get('/statistics', auth.isAuthenticated, controllers.game.gameStatisticsGet);

module.exports = router;