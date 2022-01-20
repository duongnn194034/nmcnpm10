var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient, // connect online
  uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority", // connect online
  crypto = require('crypto-js')

var admin = require('./userAdmin'),
    nember = require('./userNember')
var pass;
//sua
Passport.use(new LocalStrategy(
  (usern, password, done) => {
    console.log('passport user: '+ usern);
    console.log('passport pass: '+ password);

    var temp;
    if (usern[0] != '_') {
      console.log("nember"); 
      nember.nemberCollection(function(nember) {
        temp = nember;

        var user = temp.filter(x => x.username === usern);

        if (!user[0]) {
          return done(null, false);
        }
        if (user[0].password != password) {//user[0] là database password là trên ejs
          return done(null, false)
        }
        return done(null, user[0]);
      });
    } else {
      console.log("admin");
      admin.adminCollection(function(admin) {
        temp = admin;
        
        user = temp.filter(x => x.username == usern);

        if (!user[0]) {
          return done(null, false);
        }
        if (user[0].password != password) {
          return done(null, false)
        }
        return done(null, user[0]);
      });
    }
  }
)) // MongoClient


Passport.serializeUser((user, done) => {

  done(null, user.username)
})
Passport.deserializeUser((user, done) => {

  var myVar = "username";
  var params = {};
  params[myVar] = user;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    if (dbo.collection("userNember").findOne({  username: user})) {
      dbo.collection("userNember").find(params).toArray(function(err, result) {
        var bytes = crypto.AES.decrypt(result[0].password,'skying');
        pass = bytes.toString(crypto.enc.Utf8);
        result[0].password = pass;
        pass = null;
        done(err, result[0]);
      });
    } else if (dbo.collection("userAdmin").findOne({  username: user})) {
      var dbo = db.db("skyingclub");
      dbo.collection("userAdmin").find(params).toArray(function(err, result) {
        var bytes = crypto.AES.decrypt(result[0].password,'skying');
        pass = bytes.toString(crypto.enc.Utf8);
        result[0].password = pass;
        pass = null;
        done(err, result[0]);

      });
    }
    db.close();
  });
});


module.exports = Passport;
