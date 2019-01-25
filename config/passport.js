const passport = require('passport');
const LocalPassport = require('passport-local');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');

module.exports = () => {
    passport.use(new LocalPassport(async function(username, password, done){
        let user = await Teacher.findOne({ username: username });
        if (!user){
            user = await Student.findOne({username: username});
        }
        if (!user){
            return done(null, false);
        }
        if (!user.authenticate(password)){
            return done(null, false);
        }
        return done(null, user);
    }));

    passport.serializeUser((user, done) => {
        if (user){
            return done(null, user._id);
        }
    });

    passport.deserializeUser(async function(id, done){
        let user = await Teacher.findById(id);
        if (!user){
            user = await Student.findById(id);
        }
        if (!user){
            return done(null, false);
        }
        return done(null, user);
    });
};