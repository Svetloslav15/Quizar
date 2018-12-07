const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    },
    rules: (req, res) => {
        res.render('home/rules');
    },
    chatRoom: (req, res) => {
        res.render('home/chatroom');
    },
    myprofile: async function(req, res) {
        let myId = req.params.id;
        let user = await Student.findById(myId);
        if (!user) {
            user = await Teacher.findById(myId);
        }
        res.render('home/myprofile.hbs', {user});
    }
};
