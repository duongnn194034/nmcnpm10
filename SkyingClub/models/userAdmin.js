var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
var crypto = require('crypto-js');
var pass;

var someschema = new Schema({
	username: {
        type	: String,
        required: true,
        unique	: true
    },
    password: {
        type	: String,
        required: true
    },
    level: {
        type	: String,
        enum	: ['ADMIN', 'NEMBER']
    },

    active		: Boolean,
	  name		: String,
    dateOB		: Date,
    sex			: String,
    address		: String,
    email		: String,
    phone		: String,

	createAt: {
        type	: Date,
        default	: Date.now
    }
	
});



function adminCollection(callback) { // admin
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userAdmin").find().toArray(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
				for(var i = 0; i< result.length; i++)
				{
					var bytes = crypto.AES.decrypt(result[i].password,'skying');
					pass = bytes.toString(crypto.enc.Utf8);
					result[i].password = pass;
				}
				pass = null;
        callback(result);
      }
    });
		db.close();
  });
}

module.exports = mongoose.model('userAdmin',someschema);
module.exports.adminCollection = adminCollection;