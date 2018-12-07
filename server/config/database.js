const mongoose = require('mongoose');
const User = require('../data/User');
const Student = require('../data/Student');
const Teacher = require('../data/Teacher');
const Question = require('../data/Question');

mongoose.Promise = global.Promise;

module.exports = (settings) => {
  mongoose.connect(settings.db);
  let db = mongoose.connection;

  db.once('open', err => {
    if (err) {
      throw err;
    }

    console.log('MongoDB ready!')

  });

  db.on('error', err => console.log(`Database error: ${err}`))
};
