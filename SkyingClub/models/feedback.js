var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var someschema = new Schema({
	username : String,
	name : String,
	phone : String,
	email  : String,
	noidung : String,
	date  : Date,
	status: Number
});

module.exports = mongoose.model('Feedback',someschema);
