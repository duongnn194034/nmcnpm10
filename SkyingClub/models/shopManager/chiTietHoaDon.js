var mysql = require('mysql');
var express = require('express');
var sessions = require('express-session');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var path = require('path');
var link = __dirname;
var nodemailer = require("nodemailer");

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online



function chitiethoadonCollecttion(callback) { // customer
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("chitiethoadon").find().toArray(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        callback(result);
      }
    });
    db.close();
  });
}

////chitiethoadon
function chitiethoadonGroup(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("chitiethoadon").aggregate([{$group : {_id : {idsp : "$IDsp", tensp : "$name", loaisp : "$type"}, tongso : {$sum : "$soluong"} } }]).toArray(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        callback(result);
      }
    });
    db.close();
  });
}//////

////chitiethoadon
function chitiethoadonGroupType(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("skyingclub");
    dbo.collection("chitiethoadon").aggregate([{$group : {_id : {loaisp : "$type"}, tongso : {$sum : "$soluong"} } }]).toArray(function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length > 0) {
        callback(result);
      }
    });
    db.close();
  });
}//////


module.exports.chitiethoadonCollecttion = chitiethoadonCollecttion
module.exports.chitiethoadonGroup = chitiethoadonGroup///chitiethoadon
module.exports.chitiethoadonGroupType = chitiethoadonGroupType
