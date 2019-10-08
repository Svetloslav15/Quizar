const controllers = require('../controllers');
const auth = require('./auth');
const routes = require('../routes/index');

module.exports = (app) => {
    app.get('/', controllers.home.index);
    app.get('/rules', controllers.home.rules);
    app.get('/chatroom', auth.isAuthenticated, controllers.home.chatRoom);
    app.get('/myprofile/:id', auth.isAuthenticated, controllers.home.myprofile);
    app.get('/rankings', auth.isAuthenticated, controllers.home.rankingGet);
    app.get('/rankings/:category', auth.isAuthenticated, controllers.home.rankingFilteredGet);
    app.get('/missions/today', auth.isAuthenticated, controllers.mission.getTodaysMissions);

    app.use('/administration', routes.admin);
    app.use('/forum', routes.forum);
    app.use('/game', routes.game);
    app.use('/teachers', routes.teachers);
    app.use('/users', routes.users);

    app.all('*', (req, res) => {
        res.render('users/NotFound');
    })
};