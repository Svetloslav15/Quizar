const admin = require('./admin-routes');
const forum = require('./forum-routes');
const game = require('./game-routes');
const teachers = require('./teachers-routes');
const users = require('./users-routes');

module.exports = {
  admin,
  forum,
  game,
  teachers,
  users
};