const encryption = require('../utilities/encryption');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async function (req, res) {
        let reqUser = req.body;

        let role = reqUser.role;
        let username = reqUser.username.trim();
        let firstName = reqUser.firstName.trim();
        let lastName = reqUser.lastName.trim();
        let email = reqUser.email.trim();
        let roles = reqUser.role;
        let points = 300;
        let salt = encryption.generateSalt();
        let password = reqUser.password;
        let repeatedPassword = reqUser.repeatedPassword;
        let hashedPassword = encryption.generateHashedPassword(salt, password);
        //VALIDATION
        if (!username || !firstName || !lastName || !email){
            res.locals.errorMessage = "Невалидни данни!";
            res.render('users/register', {reqUser});
            return;
        }
        if (password !== repeatedPassword || password === "") {
            res.locals.errorMessage = "Паролите не съответстват!";
            res.render('users/register', {reqUser});
            return;
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
            res.locals.errorMessage = "Потребителското име не съществува!";
            reqUser.username = "";
            res.render('users/register', {reqUser});
            return;
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
                        res.locals.errorMessage = err;
                        res.render('users/register', user);
                        return;
                    }
                    res.locals.successMessage = "Успешна регистрация!";
                    res.redirect('/');
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
                        res.locals.errorMessage = err;
                        res.render('users/register', user);
                        return;
                    }
                    res.locals.successMessage = "Успешна регистрация!";
                    res.redirect('/')
                })
            });
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async function (req, res) {
        let reqUser = req.body;
        if (reqUser.username.trim() === "") {
            res.render('users/login', {errorMessage: 'Не можеш да влезеш без потребителско име!'});
            return;
        }
        let user = await Teacher.findOne({username: reqUser.username});
        if (!user) {
            user = await Student.findOne({username: reqUser.username});
        }
        if (!user){
            res.locals.errorMessage = 'Невалидни данни!';
            res.render('users/login');
            return;
        }
        let userSalt = user.salt;
        let userHashedPassword = user.hashedPassword;
        let reqHashedPassword = encryption.generateHashedPassword(userSalt, reqUser.password);
        if (userHashedPassword !== reqHashedPassword) {
            res.render('users/login', {errorMessage: 'Невалидни данни!', username: reqUser.username, password: reqUser.password});
            return;
        }
        else {
            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('users/login', {errorMessage: 'Невалидни данни!'});
                    return;
                }
                res.locals.successMessage = "Успешна регистрация!";
                res.redirect('/');
            })
        }
    },
    editProfile: async (req, res) => {
        let id = req.params.id;
        let username = req.body.username;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        if (username.trim() === "" || firstName.trim() === "" ||
            lastName.trim() === "" || email.trim() === ""){
            res.redirect('/myProfile/' + id);
            return;
        }
        let user = await Student.findById(id);
        if (!user){
            user = await Teacher.findById(id);
        }
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.save();
        res.redirect('/myProfile/' + id);
    }
};