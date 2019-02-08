const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const expressHandlebars = require('express-handlebars');

module.exports = (app) => {
    app.engine('.hbs', expressHandlebars({
        defaultLayout: 'main',
        extname: '.hbs',
        partialsDir: 'views/partials'
    }));
    app.set('view engine', '.hbs');
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret: 'neshto-taino!@#$%',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;
            if (req.user.roles.indexOf('Admin') > -1) {
                res.locals.currentUser.isAdmin = true;
            }
            if (req.user.roles.indexOf('Teacher') > -1) {
                res.locals.currentUser.isTeacher = true;
            }
        }

        next()
    });

    app.use(express.static('public'));

    console.log('Express ready!')
};
