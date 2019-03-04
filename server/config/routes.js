const controllers = require('../controllers');
const auth = require('./auth');

module.exports = (app) => {
    app.get('/', controllers.home.index);
    app.get('/rules', controllers.home.rules);
    app.get('/chatroom', auth.isAuthenticated, controllers.home.chatRoom);
    app.get('/myprofile/:id', auth.isAuthenticated, controllers.home.myprofile);
    app.get('/rankings', auth.isAuthenticated, controllers.home.rankingGet);
    app.get('/rankings/:category', auth.isAuthenticated, controllers.home.rankingFilteredGet);

    app.get('/game/start', auth.isAuthenticated, controllers.game.start);
    app.get('/game/settings', auth.isAuthenticated, controllers.game.settings);
    app.post('/game/settings', auth.isAuthenticated, controllers.game.setCategory);
    app.get('/game/play', auth.isAuthenticated, controllers.game.play);
    app.get('/game/answer/:questionId/:answer', auth.isAuthenticated, controllers.game.answerQuestion);
    app.get('/game/over', auth.isAuthenticated, controllers.game.gameOver);
    app.get('/game/answeredAllQuestions', auth.isAuthenticated, controllers.game.answeredAllQuestions);
    app.get('/game/report/:id', auth.isAuthenticated, controllers.game.reportGet);
    app.post('/game/report/:id', auth.isAuthenticated, controllers.game.reportPost);

    app.get('/users/register', controllers.users.registerGet);
    app.post('/users/register', controllers.users.registerPost);
    app.get('/users/login', controllers.users.loginGet);
    app.post('/users/login', controllers.users.loginPost);
    app.get('/users/logout', controllers.users.logout);

    app.get('/administration', auth.isInRole("Admin"), controllers.admin.adminHome);
    app.get('/administration/users', auth.isInRole("Admin"), controllers.admin.listUsers);
    app.get('/administration/users/:id', auth.isInRole("Admin"), controllers.admin.getCurrentUser);
    app.post('/administration/users/makeadmin/:id', auth.isInRole("Admin"), controllers.admin.makeAdmin);
    app.post('/administration/users/removeadmin/:id', auth.isInRole("Admin"), controllers.admin.removeAdmin);
    app.get('/administration/questions', auth.isInRole("Admin"), controllers.admin.questionsMainGet);
    app.get('/administration/questions/search', auth.isInRole("Admin"), controllers.admin.questionsSearch);
    app.get('/administration/questions/add', auth.isInRole("Admin"), controllers.admin.addQuestionGet);
    app.post('/administration/questions/add', auth.isInRole("Admin"), controllers.admin.addQuestionPost);
    app.get('/administration/questions/filtered', auth.isInRole("Admin"), controllers.admin.filteredQuestionsGet);
    app.get('/administration/questions/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteQuestion);

    app.get('/administration/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionGet);
    app.post('/administration/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionPost);
    app.get('/administration/questions/getById', auth.isInRole("Admin"), controllers.admin.getQuestionById);
    app.get('/administration/reports', auth.isInRole("Admin"), controllers.admin.listReports);
    app.get('/administration/reports/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteReport);

    app.get('/administration/missions', auth.isInRole("Admin"), controllers.mission.getAll);
    app.get('/missions/today', auth.isAuthenticated, controllers.mission.getTodaysMissions);
    app.get('/administration/missions/main', auth.isInRole("Admin"), controllers.mission.missionsMainPage);
    app.get('/administration/missions/add', auth.isInRole("Admin"), controllers.mission.addMissionGet);
    app.post('/administration/missions/add', auth.isInRole("Admin"), controllers.mission.addMissionPost);
    app.get('/administration/missions/edit/:id', auth.isInRole("Admin"), controllers.mission.editMissionGet);
    app.post('/administration/missions/edit/:id', auth.isInRole("Admin"), controllers.mission.editMissionPost);
    app.get('/administration/missions/delete/:id', auth.isInRole("Admin"), controllers.mission.deleteMission);
    app.get('/administration/missions/answer/:id', auth.isAuthenticated, controllers.mission.answerMissionGet);
    app.post('/administration/missions/answer/:id', auth.isAuthenticated, controllers.mission.answerMissionPost);

    app.get('/teachers/home', auth.isInRole('Teacher'), controllers.teachers.home);
    app.get('/teachers/questions', auth.isInRole('Teacher'), controllers.teachers.allQuestionsGet);
    app.get('/teachers/questions/add', auth.isInRole('Teacher'), controllers.teachers.addTeachersQuestionGet);
    app.post('/teachers/questions/add', auth.isInRole('Teacher'), controllers.teachers.addTeachersQuestionPost);
    app.get('/teachers/questions/delete/:id', auth.isInRole('Teacher'), controllers.teachers.deleteQuestion);
    app.get('/teachers/questions/edit/:id', auth.isInRole('Teacher'), controllers.teachers.editQuestionGet);
    app.post('/teachers/questions/edit/:id', auth.isInRole('Teacher'), controllers.teachers.editQuestionPost);

    app.get('/forum', auth.isAuthenticated, controllers.forum.mainGet);
    app.get('/forum/create', auth.isAuthenticated, controllers.forum.createGet);
    app.post('/forum/create', auth.isAuthenticated, controllers.forum.createPost);
    app.get('/forum/questions/:id', auth.isAuthenticated, controllers.forum.getQuestionById);
    app.get('/forum/:subject', auth.isAuthenticated, controllers.forum.filteredBySubjectGet);
    app.post('/forum/comments/add/:id', auth.isAuthenticated, controllers.forum.createCommentPost);
    app.get('/forum/questions/like/:id', auth.isAuthenticated, controllers.forum.likeQuestionPost);
    app.get('/forum/questions/dislike/:id', auth.isAuthenticated, controllers.forum.dislikeQuestionPost);
    app.get('/forum/comments/like/:commentId/:questionId', auth.isAuthenticated, controllers.forum.likeCommentPost);
    app.get('/forum/comments/dislike/:commentId/:questionId', auth.isAuthenticated, controllers.forum.dislikeCommentPost);
    app.get('/forum/questions/delete/:id', auth.isInRole('Admin'), controllers.forum.deleteQuestionById);
    app.get('/forum/comments/delete/:commentId/:questionId', auth.isInRole('Admin'), controllers.forum.deleteCommentId);

    app.all('*', (req, res) => {
        res.render('users/NotFound');
    })
};
