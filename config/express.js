const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const expressHandlebars = require('express-handlebars');

module.exports = (app) => {
    app.engine('.hbs', expressHandlebars({
        defaultLayout: 'main',
        extname: '.hbs',
        partialsDir: 'views/partials'
    }));
    app.set('view engine', '.hbs');
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret: 'neshto-taino!@#$%',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cors());

    console.log('Express ready!')
};
