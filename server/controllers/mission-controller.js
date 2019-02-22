const DailyMission = require('mongoose').model('Mission');
const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

module.exports = {
    missionsMainPage: (req, res) => {
        res.render('admins/missionsMain');
    },
    getTodaysMissions: async (req, res) => {
        let currDate = new Date();
        let day = currDate.getDate();
        let month = currDate.getMonth();
        let year = currDate.getFullYear();
        let missions = await DailyMission.find({});
        missions = missions.filter(x => x.date.getDate() == day && x.date.getMonth() == month && x.date.getFullYear() == year);

        let user = await Student.findById(req.user._id);
        if (!user){
            user = await Teacher.findById(req.user._id);
        }

        missions = missions.filter(x => user.missions.includes(x._id.toString()) == false);
        res.render('admins/listTodaysMission', {missions});
    },
    getAll: async (req, res) => {
        let missions = await DailyMission.find()
            .sort({date: 'descending'});
        missions.forEach((x, i) => {
            x.rank = i + 1;
        });
        res.render('admins/listAllMissions', {missions});
    },
    addMissionGet: (req, res) => {
        res.render('admins/addMissionGet');
    },
    addMissionPost: (req, res) => {
        let description = req.body.description;
        let answer = req.body.answer;
        if (description.trim() == "" || answer.trim() == "") {
            res.render('admins/addMissionGet', req.body);

        }
        else {
            DailyMission.create({
                description, answer
            }).then((d) => {
                res.redirect('/administration/missions/add');
            }).catch(console.error);
        }
    },
    editMissionGet: (req, res) => {
        let id = req.params.id;
        DailyMission.findById(id)
            .then((mission) => {
                res.render('admins/addMissionGet', mission);
            }).catch(err => console.log(err));

    },
    editMissionPost: (req, res) => {
        let id = req.params.id;
        let description = req.body.description;
        let answer = req.body.answer;
        if (description.trim() == "" || answer.trim() == "") {
            res.render('admins/addMissionGet', req.body);
        }
        else {
            DailyMission.findByIdAndUpdate(id, {
                description, answer
            }).then((d) => {
                res.redirect('/administration/missions');
            }).catch(console.error);
        }
    },
    deleteMission: (req, res) => {
        let id = req.params.id;
        DailyMission.findByIdAndRemove(id)
            .then(() => {
                res.redirect('/administration/missions');
            }).catch(console.error);
    },
    answerMissionGet: async (req, res) => {
        let id = req.params.id;
        let mission = await DailyMission.findById(id);
        res.render('admins/answerMission', mission);
    },
    answerMissionPost: async (req, res) => {
        let id = req.params.id;
        let answer = req.body.answer;
        let mission = await DailyMission.findById(id);
        if (answer == mission.answer){
            let user = await Student.findById(req.user._id);
            if (!user){
                user = await Teacher.findById(req.user._id);
            }
            user.points += 3;
            let temp = user.missions;
            temp.push(id.toString());
            user.missions = temp;
            user.save();
            res.redirect('/missions/today');
        }
        else{
            res.errorMessage = 'Грешен отговор. пробвай пак!';
            res.render('admins/answerMission', mission);
        }
    }
};