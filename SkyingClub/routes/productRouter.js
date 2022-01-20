var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy
var prodType = require("../models/shopManager/prodType"); ///// menu

var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online


var url = require('url');
var bodyParser = require('body-parser');


// default direct for css and html bug not load
var directName = require('../app');
console.log(directName.dirname);
router.use(express.static(directName.dirname + '/public'));
//

//asdaskdlsadklasd/

router.get('/danhsach?:type', function(req, res) { // ham index de vao web chinh
  var type = req.query.type;
  var product = require('../models/product')
  product.findProductByType(type, function(result) {
    product = result;
    console.log("type danh sach: " + type);
    prodType.prodTypeCollection(function(kq) {
      res.render('index', {
        prodType: kq,
        user: req.user,
        type: type,
        product: product,
        body: 'product/danhsach.ejs'
      });
    });
  });
});


router.get('/chitietsanpham?:ID', function(req, res) { // ham index de vao web chinh
  var ID = req.query.ID;
  console.log(ID);
  var product = require('../models/product');
  var OtherProducts = [];
  product.productCollection(function(result) {
    product = result;
    for (var i = 0; i < product.length; i++) {
      if (product[i].ID == ID) {
        info = product[i]
      }
    }

    for (var i = 0; i < product.length; i++) {
      if (product[i].type == info.type && product[i].ID != info.ID) {
        OtherProducts.push(product[i]);
      }

    }
    type = null;
    prodType.prodTypeCollection(function(kq) {
      res.render('index', {
        prodType: kq,
        user: req.user,
        infoProduct: info,
        product: OtherProducts,
        body: "product/chitietsanpham"
      });
    });
  });
});

router.get('/updateProduct', function(req, res) {

  res.render('staff/updateProduct', {
    flag: false,
    update: null,
    error: "Vui lòng nhập chính xác ID của sản phẩm để cập nhật"
  });
});

router.get('/removeProduct', function(req, res) {
  var customer = require('../models/customer');

  customer.removeProductByID(update[0].ID);
  console.log("remove Success");
  update = null;
  res.redirect('removeSuccess')

});

router.get('/updateSuccess', function(req, res) {
  res.render('staff/updateProduct', {
    flag: false
  });
})

router.get('/removeSuccess', function(req, res) {
  res.render('staff/updateProduct', {
    flag: false
  });
})


var searchProduct = new Array();

router.get('/searchProduct?:search', function(req, res) {
  var nameProduct = req.query.search;
  var searchtype = req.query.tproduct;
  console.log(searchtype);
  var sproduct = new Array();
  sproduct = [];
  searchProduct = [];
  var product = require('../models/product');

  console.log("nameProduct: " + nameProduct);
  if(searchtype == "name")
  {
       product.searchProductByName(nameProduct.toString(), function(result) {
      searchProduct = result;
      if (result[0] == "e" || nameProduct == " ") {
        searchProduct = [];
      } else {
        console.log(result.length);
        console.log("in ra mang search");
      }
      res.redirect('searchSuccess');
    });
  }

  else if(searchtype == "id")
  {
       product.searchProductByID(nameProduct.toString(), function(result) {
      searchProduct = result;
      if (result[0] == "e" || nameProduct == " ") {
        searchProduct = [];
      } else {
        console.log("in ra mang search");
      }
      res.redirect('searchSuccess');
    });
  }
  //price
  else if(searchtype == "price_1" || searchtype =="price_11"|| searchtype == "price_51" || searchtype == "price_101" || searchtype == "price_201")
    {
      product.searchPrice(nameProduct,searchtype,function(result){
        searchProduct = result;
        res.redirect('searchSuccess');
      });
    }
  //search type
  else if(searchtype == "mebe" || searchtype == "xe" || searchtype == "dientu" || searchtype == "fashion" || searchtype == "giadung" ||searchtype == "thucung")
    {
      product.searchType(nameProduct,searchtype,function(result){
        searchProduct = result;
        res.redirect('searchSuccess');
      });
    }
  else if(searchtype == "all")
    {
      product.searchAll(nameProduct,function(result){
        searchProduct = result;
        res.redirect('searchSuccess');
      });
    }
});

router.get('/searchSuccess', function(req, res) {
  var temp = searchProduct;
  //searchProduct = [];
  prodType.prodTypeCollection(function(kq) {
    res.render('index', {
      prodType: kq,
      user: req.user,
    //  type: type,
      product: temp,
      body: 'product/danhsach.ejs'
    });
  });
});

router.get('/searchnangcao', function(req, res) {
  //searchProduct = [];
  var temp = searchProduct;
  searchProduct = [];
  prodType.prodTypeCollection(function(kq) {
    res.render('index', {

      prodType: kq,
      user: req.user,
    //  type: type,
      product: temp,
      body: 'product/nangcao'
    });
  });
});

router.get('/searchnc?:search', function(req, res){
var nameProduct = req.query.search;
var tprice = req.query.tprice;
var ttype = req.query.ttype;
var tnameid = req.query.tnameid;
var sproduct = new Array();
sproduct = [];
searchProduct = [];
var product = require('../models/product');

  if(tprice =="" && ttype == "" && tnameid == "")
  {
    product.allNC(nameProduct,function(result){
      searchProduct = result;
      res.redirect("searchnangcao");
    });
  }
  else
  {
    if(tnameid !="" && tprice == "" && ttype =="")
    {
      product.datanameid(nameProduct,function(result){
        searchProduct = result;
        res.redirect("searchnangcao");
      });

    }
    else if((ttype != "" && tprice == "" && tnameid == "")|| (tnameid !="" && ttype!= "" && tprice == "" ))
    {
      if(nameProduct[0] == " " || nameProduct =="" || nameProduct == null)
      {
        product.spaceAllNC(ttype,tprice,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }
      else {
        product.typenameidNC(nameProduct,ttype,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }
    }
    else if((tprice != "" && ttype == "" && tnameid =="")||(tprice !=""&&ttype ==""&&tnameid!=""))
    {
      if(nameProduct[0] == " " || nameProduct =="" || nameProduct == null)
      {
        product.spaceAllNC(ttype,tprice,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }
      else{
        product.pricenameidNC(nameProduct,tprice,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }

    }
    else if((ttype != "" && tprice != "" && tnameid != "")||(tprice != "" && ttype !=""&&tnameid==""))
    {
      if(nameProduct[0] == " " || nameProduct =="" || nameProduct == null)
      {
        product.spaceAllNC(ttype,tprice,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }
      else {
        product.pricetypenameidNC(nameProduct,tprice,ttype,function(result){
          searchProduct = result;
          res.redirect('searchnangcao');
        });
      }

    }
  }
});



module.exports = router;
