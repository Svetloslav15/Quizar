const mongoose = require('mongoose');

let studentSchema = mongoose.Schema({
    username: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    points: {type: Number},
    class: {type: Number},
    roles: ["Student"],
    salt: {type: String},
    hashedPassword: {type: String},
});

let Student = mongoose.model("Student", studentSchema);
module.exports = Student;