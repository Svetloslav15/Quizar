const home = require('./home-controller');
const users = require('./users-controller');
const admin = require('./admin-controller');
const teachers = require('./teachers-controller');
const forum = require('./forum-controller');

module.exports = {
    home: home,
    users: users,
    admin: admin,
    teachers: teachers,
    forum: forum
};
