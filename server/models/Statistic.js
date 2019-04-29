const mongoose = require('mongoose');

let statisticSchema = mongoose.Schema({
    correctAnswersCount: {type: Number, required: true},
    wrongAnswersCount: {type: Number, required: true},
    userId: {type: String, required: true}
});

let Statistic = mongoose.model("Statistic", statisticSchema);
module.exports = Statistic;