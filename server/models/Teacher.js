const mongoose = require('mongoose');

let teacherSchema = mongoose.Schema({
    username: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    points: {type: Number},
    subjects: [],
    roles: ["Teacher"],
    salt: {type: String },
    hashedPassword: {type: String },
});

let Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;