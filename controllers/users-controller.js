const encryption = require('../utilities/encryption');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');
const passport = require('passport');

module.exports = {
    registerPost: async function (req, res) {
        let reqUser = req.body;
        let role = reqUser.role;
        let username = reqUser.username.trim();
        let firstName = reqUser.firstName.trim();
        let lastName = reqUser.lastName.trim();
        let email = reqUser.email.trim();
        let roles = reqUser.role;
        let points = 0;
        let salt = encryption.generateSalt();
        let password = reqUser.password;
        let repeatedPassword = reqUser.repeatedPassword;
        let hashedPassword = encryption.generateHashedPassword(salt, password);
        //VALIDATION
        if (!username || !firstName || !lastName || !email){
            return res.json({
                success: false,
                message: 'Invalid input data!',
                data: reqUser
            });
        }
        if (password !== repeatedPassword || password === "") {
            return res.json({
                success: false,
                message: 'Passwords don\'t match!',
                data: reqUser
            });
        }
        let usernameExists = false;
        await Teacher.find({}).where('username').equals(reqUser.username)
            .then(teacher => {
                if (teacher.length > 0){
                    usernameExists = true;
                }
            });
        await Student.find({}).where('username').equals(reqUser.username)
            .then(student => {
                if (student.length > 0){
                    usernameExists = true;
                }
            });
        if (usernameExists){
            res.locals.errorMessage = "Username already exists!";
            reqUser.username = "";
            return res.json({
                success: false,
                message: 'Username already exists!',
                data: reqUser
            });
        }
        if (role === "Student") {
            let studentClass = reqUser.class;
            Student.create({
                username,
                firstName,
                lastName,
                salt,
                hashedPassword,
                email,
                points,
                roles,
                class: studentClass
            }).then(user => {
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: err,
                            data: user
                        });
                        req.session.user = user;
                        return;
                    }
                    res.locals.successMessage = "Register successfully!";
                    res.json({
                        success: true,
                        message: "Register successfully!",
                        data: user
                    });
                })
            });

        }
        else if (role === "Teacher") {
            let subjects = reqUser.subjects.sub;
            Teacher.create({
                username,
                firstName,
                lastName,
                salt,
                hashedPassword,
                email,
                roles,
                points,
                subjects
            }).then(user => {
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: err,
                            data: user
                        });
                        return;
                    }
                    res.json({
                        success: true,
                        message: "Register successfully!",
                        data: user
                    });
                })
            });
        }
    },
    logout: (req, res) => {
        req.logout();
        res.json({
            success: true,
            message: "Successfully Logout!"
        })
    },
    loginPost: async function (req, res) {
        let reqUser = req.body;
        if (reqUser.username.trim() === "") {
            res.json({
                success: false,
                message: 'Cannot login without username!',
                data: reqUser
            });
            req.session.user = reqUser;
            return;
        }
        let user = await Teacher.findOne({username: reqUser.username});
        if (!user) {
            user = await Student.findOne({username: reqUser.username});
        }
        if (!user){
            res.json({
                success: false,
                message: 'Invalid user data',
                data: reqUser
            });
            return;
        }
        let userSalt = user.salt;
        let userHashedPassword = user.hashedPassword;
        let reqHashedPassword = encryption.generateHashedPassword(userSalt, reqUser.password);
        if (userHashedPassword !== reqHashedPassword) {
            res.json({
                success: false,
                message: 'Invalid username or password!',
                data: reqUser
            });
            return;
        }
        else {
            req.logIn(user, (err, user) => {
                if (err) {
                    res.json({
                        success: false,
                        message: err,
                        data: user
                    });
                }
                res.json({
                    success: true,
                    message: "Register successfully!",
                    data: user
                });
                req.session.user = user;
                return;

            })
        }
    }
};