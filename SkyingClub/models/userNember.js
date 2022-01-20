var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
var crypto = require('crypto-js');

var someschema = new Schema({
    username: {
        type	  : String,
        required: true,
        unique	: true
    },
    password: {
        type	  : String,
        required: true
    },
    level: {
        type	  : String,
        enum	  : ['ADMIN', 'NEMBER']
    },

    active	    : Boolean,
	  name	      : String,
    dateOB	    : Date,
    sex		      : String,
    address	    : String,
    email	      : String,
    phone	      : String,
    accumulative_stars: Number,

	createAt: {
        type    : Date,
        default : Date.now
    }
});

var pass;
 function nemberCollection() {
	MongoClient.connect(uri, function(err, db) {
		if (err) throw err;
		var dbo = db.db("skyingclub");
		dbo.collection("userNember").find().toArray(function(err, result) {
			if (err) {
				throw err;
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

//sua
function nemberUpdate(user, password, name, dateOB, sex, address, email, phone) { // nember
  pass = crypto.AES.encrypt(password,'skying').toString();
  password = pass;
  pass = null;
  console.log("password update: " + password);
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userNember").update({
      username: user
    }, {
      $set: {
        name: name,
        password: password,
        dateOB: dateOB,
        sex: sex,
        address: address,
        email: email,
        phone: phone
      }
    }, {
      multi: true
    });
    db.close();
  });
}

function nemberRemove(user) { // nember
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userNember").remove({
      username: user
    });
    db.close();
  });
}


function findNember(unb, callback) { // nember
  MongoClient.connect(uri, function(err, db) {

    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userNember").findOne({
      username: unb
    }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
        callback("errorUserNember");
      }
      else {
          if (result != null) {
              var bytes = crypto.AES.decrypt(result.password,'skying');
              pass = bytes.toString(crypto.enc.Utf8);
              result.password = pass;
              callback(result);
              pass = null;
          }
          else callback("errorNember");
      }
    });
    db.close();
  });
}

module.exports = mongoose.model('userNember', someschema);
module.exports.nemberCollection = nemberCollection;
module.exports.nemberUpdate = nemberUpdate;
module.exports.nemberRemove = nemberRemove;
module.exports.findNember = findNember;
