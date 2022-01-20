var express = require("express"),
  router = express.Router()
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
var chitiethoadon = require('../../../models/shopManager/chitiethoadon'); /////// chi tiet hoa don
var thongke = require('../../../models/shopManager/hoadon');
var directName = require('../../../app');
var typeproduct = require("../../../models/shopManager/hoadon")
router.use(express.static('/public'));


var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

function isAdminLoggedin(req, res, next) {
  if (req.isAuthenticated() && req.user.ID[0] == 's') {
    return next();
  }
  res.redirect('/');
}

router.get('/admin/thongketop10', isAdminLoggedin, function(req, res) {
    res.render("manage", {
      user: req.user,
      body: "admin/chonloaithongke.ejs",
  });
});

router.post('/admin/top10', isAdminLoggedin, function(req, res) {
  var type =req.body.type;
  chitiethoadon.chitiethoadonGroup(function(result) {
    result.sort((a, b) => b.tongso - a.tongso);
    var kq;
    if(type=="all"){
      kq = result;
    } else{
      kq = result.filter(x => x._id.loaisp === type);
    }
    res.render("manage", {
      user: req.user,
      top10Product: kq,
      n: kq.length<=10 ? kq.length : 10,
      body: "admin/top10.ejs",
    });
  });
});

router.get('/admin/top10Type', isAdminLoggedin, function(req, res) {
  chitiethoadon.chitiethoadonGroupType(function(result) {
    result.sort((a, b) => b.tongso - a.tongso);
    res.render("manage", {
      user: req.user,
      top10Type: result,
      n: result.length<=10 ? result.length : 10,
      body: "admin/top10Type.ejs",
    });
  });
});

var doanhthuTheoNam;
router.get('/admin/chart', isAdminLoggedin, function(req, res) {
  thongke.TongDoanhThu(function(result) {
    tongdoanhthu = result
  });
  thongke.DoanhThuThangInYear(2018, function(result) {
    doanhthuTheoNam = result;
  })
  setTimeout(function() {
    res.render("admin/chart", {
      tongdoanhthu: tongdoanhthu,
      doanhthuTheoNam: doanhthuTheoNam,
      user: req.user
    })
  }, 3000);

});

router.get('/admin/thongke', isAdminLoggedin, function(req, res) {
  thongke.TongDoanhThu(function(result) {
    res.render("manage", {
      tongdoanhthu: result,
      user: req.user,
      body: "admin/thongke.ejs",
    });
  });
});

router.post('/admin/thongkedoanhso', isAdminLoggedin, function(req, res) {
  var type = req.body.loai;
  var ngay = req.body.bday;
  var thang = req.body.bmonth;
  var nam = req.body.byear;
  console.log(type+" "+ngay+" "+thang+" "+nam);
  if(type=="none")
  {
    thongke.TongDoanhThu(function(result) {
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "admin/thongke.ejs",
      });
    });
  }
  else if(type=="ngay")
  {
    thongke.thongKeTheoNgay(ngay,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "admin/thongkedoanhso.ejs",
      });
    });
  }
  else if(type=="thang")
  {
    thongke.thongKeTheoThang(thang,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "admin/thongkedoanhso.ejs",
      });
    });
  }
  else if(type=="nam")
  {
    thongke.thongKeTheoNam(nam,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "admin/thongkedoanhso.ejs",
      });
    });
  }
  
});

module.exports = router;
