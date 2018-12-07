const controllers = require('../controllers');
const auth = require('./auth');

module.exports = (app) => {
    app.get('/', controllers.home.index);
    app.get('/rules', controllers.home.rules);
    app.get('/chatroom', auth.isAuthenticated, controllers.home.chatRoom);
    app.get('/myprofile/:id', auth.isAuthenticated, controllers.home.myprofile);

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
    app.get('/administration/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionGet);
    app.post('/administration/questions/edit/:id', auth.isInRole("Admin"), controllers.admin.editQuestionPost);
    app.get('/administration/questions/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteQuestion);
    app.get('/administration/questions/getById', auth.isInRole("Admin"), controllers.admin.getQuestionById);

    app.get('/administration/reports', auth.isInRole("Admin"), controllers.admin.listReports);
    app.get('/administration/reports/archive', auth.isInRole("Admin"), controllers.admin.listArchiveReports);
    app.get('/administration/reports/:id', auth.isInRole("Admin"), controllers.admin.getReport);
    app.post('/administration/reports/archive/:id', auth.isInRole("Admin"), controllers.admin.reportArchive);
    app.post('/administration/reports/active/:id', auth.isInRole("Admin"), controllers.admin.reportActive);
    app.get('/administration/missions', auth.isInRole("Admin"), controllers.admin.listMissions);
    app.get('/administration/missions/add', auth.isInRole("Admin"), controllers.admin.addMissionGet);
    app.post('/administration/missions/add', auth.isInRole("Admin"), controllers.admin.addMissionPost);
    app.get('/administration/missions/edit/:id', auth.isInRole("Admin"), controllers.admin.editMissionGet);
    app.post('/administration/missions/edit/:id', auth.isInRole("Admin"), controllers.admin.editMissionPost);
    app.get('/administration/missions/delete/:id', auth.isInRole("Admin"), controllers.admin.deleteMission);

    app.get('/teachers/questions', auth.isInRole('Teacher'), controllers.teachers.teachersHomeGet);
    app.get('/teachers/questions/filtered', auth.isInRole('Teacher'), controllers.teachers.allQuestionsGet);
    app.get('/teachers/questions/edit/:id', auth.isInRole('Teacher'), controllers.teachers.editQuestionGet);
    app.post('/teachers/questions/edit/:id', auth.isInRole('Teacher'), controllers.teachers.editQuestionPost);
    app.get('/teachers/questions/add', auth.isInRole('Teacher'), controllers.teachers.addTeachersQuestionGet);
    app.post('/teachers/questions/add', auth.isInRole('Teacher'), controllers.teachers.addTeachersQuestionPost);
    app.get('/teachers/questions/delete/:id', auth.isInRole('Teacher'), controllers.teachers.deleteQuestion);

    app.all('*', (req, res) => {
        res.render('users/NotFound');
    })
};
