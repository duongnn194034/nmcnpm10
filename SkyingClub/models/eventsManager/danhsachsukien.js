const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");
const someSchema = new mongoose.Schema({
    name: String,
    sport: String,
    timeStart: Date,
    timeEnd: Date,
    address: String,

    sport_id: [{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model("danhsachsukien", someSchema);