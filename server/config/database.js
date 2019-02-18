const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Question = require('../models/Question');
const ForumQuestion = require('../models/Forum-Question');
const ForumComment = require('../models/Forum-Comment');
const Report = require('../models/Report');

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
