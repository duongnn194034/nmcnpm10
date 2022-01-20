var express = require("express"),
  router = express.Router()

var admin = require('../models/userAdmin'),
    nember = require('../models/userNember')

function isLoggedin(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}


// default direct for css and html bug not load
var directName = require('../app');

router.use(express.static('public'));


router.get('/history', isLoggedin, function(req, res) {
  var hoadon = require('../models/hoadon');
  hoadon.hoadonCollection(function(result) {
    var temp = result.filter(x => x.nember.id === req.user.ID);
    res.render('index', {
      user: req.user,
      hoadon: temp,
      body: "nember/history.ejs",
      typeproduct: null
    })
  })
});


router.get('/profile', isLoggedin, function(req, res) {
  res.render('index', {
    user: req.user,
    body: "nember/profile.ejs",
    typeproduct: null
  });
});



router.post('/updateProfile', isLoggedin, function(req, res) { //
  var idkh = req.body.username;
  var hoten = req.body.name;
  var password = req.body.password;
  var diachi = req.body.diachi;
  var email = req.body.email;
  var dienthoai = req.body.dienthoai;
req.user.password = password;
  nember.nemberUpdate(idkh, hoten, password, diachi, email, dienthoai);
  console.log("Update Success nember " + idkh);

  res.render('index', {
    user: req.user,
    body: "nember/profile.ejs",
    typeproduct: null
  });
  idkh = null;
});


router.get('/chitiethoadon?:id', isLoggedin, function(req, res) {
  var id = req.query.id;
  var hoadon = require('../models/hoadon');
  hoadon.hoadonCollection(function(result) {
    var temp = result.filter(x => x.ID == id);
    console.log(temp);
    res.render('index', {
      user: req.user,
      hoadon: temp,
      body: "nember/chitiethoadon.ejs",
      typeproduct: null
    })
  })
});

module.exports = router;
