const mongoose = require('mongoose');

let reportSchema = mongoose.Schema({
    description: {type: String, required: true},
    questionId: {type: String, required: true},
    author: {type: String, required: true}
});

let Report = mongoose.model("Report", reportSchema);
module.exports = Report;