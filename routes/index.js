const adminController = require('../controllers/admin-controller');
const teachersController = require('../controllers/teachers-controller');
const auth = require('../config/auth');
const usersRouter = require('./usersRouter');
const homeRouter = require('./homeRouter');

module.exports = (app) => {

    app.use('/', homeRouter);
    app.use('/users', usersRouter);

    app.get('/administration/users', auth.isInRole("Admin"), adminController.listUsers);
    app.get('/administration/users/:id', auth.isInRole("Admin"), adminController.getCurrentUser);
    app.post('/administration/users/makeadmin/:id', auth.isInRole("Admin"), adminController.makeAdmin);
    app.post('/administration/users/removeadmin/:id', auth.isInRole("Admin"), adminController.removeAdmin);
    app.post('/administration/questions/add', auth.isInRole("Admin"), adminController.addQuestionPost);
    app.get('/administration/questions/filtered', auth.isInRole("Admin"), adminController.filteredQuestionsGet);
    app.get('/administration/questions/edit/:id', auth.isInRole("Admin"), adminController.editQuestionGet);
    app.post('/administration/questions/edit/:id', auth.isInRole("Admin"),adminController.editQuestionPost);
    app.get('/administration/questions/delete/:id', auth.isInRole("Admin"), adminController.deleteQuestion);
    app.get('/administration/questions/getById', auth.isInRole("Admin"), adminController.getQuestionById);

    app.get('/administration/reports', auth.isInRole("Admin"), adminController.listReports);
    app.get('/administration/reports/archive', auth.isInRole("Admin"), adminController.listArchiveReports);
    app.get('/administration/reports/:id', auth.isInRole("Admin"), adminController.getReport);
    app.post('/administration/reports/archive/:id', auth.isInRole("Admin"), adminController.reportArchive);
    app.post('/administration/reports/active/:id', auth.isInRole("Admin"), adminController.reportActive);
    app.get('/administration/missions', auth.isInRole("Admin"), adminController.listMissions);
    app.get('/administration/missions/add', auth.isInRole("Admin"), adminController.addMissionGet);
    app.post('/administration/missions/add', auth.isInRole("Admin"), adminController.addMissionPost);
    app.get('/administration/missions/edit/:id', auth.isInRole("Admin"), adminController.editMissionGet);
    app.post('/administration/missions/edit/:id', auth.isInRole("Admin"), adminController.editMissionPost);
    app.get('/administration/missions/delete/:id', auth.isInRole("Admin"), adminController.deleteMission);

    app.get('/teachers/questions/filtered', auth.isInRole('Teacher'), teachersController.allQuestionsGet);
    app.get('/teachers/questions/edit/:id', auth.isInRole('Teacher'), teachersController.editQuestionGet);
    app.post('/teachers/questions/edit/:id', auth.isInRole('Teacher'), teachersController.editQuestionPost);
    app.post('/teachers/questions/add', auth.isInRole('Teacher'), teachersController.addTeachersQuestionPost);
    app.get('/teachers/questions/delete/:id', auth.isInRole('Teacher'), teachersController.deleteQuestion);

    app.all('*', (req, res) => {
        res.render('users/NotFound');
    })
};