const mongoose = require('mongoose');

let missionSchema = mongoose.Schema({
    description: {type: String, required: true},
    answer: {type: String, required: true},
    date: {type: mongoose.Schema.Types.Date, default: Date.now()}
});

let Mission = mongoose.model("Mission", missionSchema);
module.exports = Mission;