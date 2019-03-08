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
    myprofile: async function (req, res) {
        let myId = req.params.id;
        let user = await Student.findById(myId);
        if (!user) {
            user = await Teacher.findById(myId);
        }
        res.render('home/myprofile.hbs', {user});
    },
    rankingGet: async (req, res) => {
        let users = await Student.find()
            .sort({points: 'descending'});
        let teachers = await Teacher.find()
            .sort({points: 'descending'});
        for (let teacher of teachers) {
            users.push(teacher);
        }
        users = users.sort((a, b) => b.points - a.points);

        let currentPage = Number(req.query.page);
        let numberOfPages = Math.floor(users.length / 10);
        if (users.length % 10 != 0) {
            numberOfPages++;
        }
        let previousPage = currentPage - 1;
        if (previousPage < 1) {
            previousPage = undefined;
        }
        let nextPage = currentPage + 1;
        if (nextPage > numberOfPages) {
            nextPage = undefined;
        }
        let startIndex = (currentPage - 1) * 10;
        let lastIndex = Math.min(startIndex + 10, users.length - 1);
        let result = [];
        for (let index = startIndex; index <= lastIndex; index++) {
            result.push(users[index]);
        }

        result.forEach((x, i) => {
            x.position = i + 1 + (currentPage - 1) * 10;
        });
        res.render('home/ranking', {users: result, previousPage, currentPage, nextPage});
    },
    rankingFilteredGet: async (req, res) => {
        let category = req.params.category;

        let allStudents;
        if (category === 'rabbits') {
            allStudents = await Student.find()
                .where('class')
                .lt(8);
        }
        else if (category === "wolves") {
            allStudents = await Student.find()
                .where('class')
                .gt(7)
                .lt(11);
        }
        else if (category === 'lions') {
            allStudents = await Student.find()
                .where('class')
                .gt(10)
        }
        else if (category === 'teachers') {
            allStudents = await Teacher.find();
        }
        let currentPage = Number(req.query.page);
        let numberOfPages = Math.floor(allStudents.length / 10);
        if (allStudents.length % 10 != 0) {
            numberOfPages++;
        }
        let previousPage = currentPage - 1;
        if (previousPage < 1) {
            previousPage = undefined;
        }
        let nextPage = currentPage + 1;
        if (nextPage > numberOfPages) {
            nextPage = undefined;
        }
        if (category === 'rabbits') {
            allStudents = await Student.find()
                .sort({points: 'descending'})
                .where('class')
                .lt(8)
                .skip((currentPage - 1) * 10)
                .limit(10);
        }
        else if (category === "wolves") {
            allStudents = await Student.find()
                .sort({points: 'descending'})
                .where('class')
                .gt(7)
                .lt(11)
                .skip((currentPage - 1) * 10)
                .limit(10);
        }
        else if (category === 'lions') {
            allStudents = await Student.find()
                .sort({points: 'descending'})
                .where('class')
                .gt(10)
                .skip((currentPage - 1) * 10)
                .limit(10);
        }
        else if (category === 'teachers') {
            allStudents = await Teacher.find()
                .sort({points: 'descending'})
                .skip((currentPage - 1) * 10)
                .limit(10);
        }
        allStudents.forEach((x, i) => {
            x.position = i + 1 + (currentPage - 1) * 10;
        });
        res.render('home/ranking-filtered', {users: allStudents, previousPage, currentPage, nextPage, category});
    }
};
