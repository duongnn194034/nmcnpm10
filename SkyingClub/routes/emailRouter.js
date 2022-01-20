var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  crypto = require('crypto-js')

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({ // setting email for sender
  service: 'Gmail',
  auth: {
    user: 'group.nmcnpm@gmail.com',
    pass: 'NMCNPM10'
  }
});

var directName = require('../app');
router.use(express.static(directName.dirname + 'public'));

router.post('/email', function(req, res, next) {

var pass;
pass = crypto.AES.encrypt('ABCDE12345','skying').toString();
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userNember").updateOne({
      email: req.body.email
    }, {
      $set: {
        password: pass
      }
    });
    db.close();
  });

  var Mail = require("../models/email");
  var sendMail = new Mail();
  sendMail.resetMail(req.body.email)

  transporter.sendMail(sendMail.mail, function(err, info) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log('Message sent: ' + info.response);
      res.redirect('/');
    }
  });
});


router.get('/verify?:ID', function(req, res) {
  var ID = req.query.ID;
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("userNember").updateOne({
      username: ID
    }, {
      $set: {
        verify: 1
      }
    })
  })
  res.render('login/login', {
    error: "Tai khoan da kick hoat, vui long dang nhap lai"
  });
});

module.exports = router;
