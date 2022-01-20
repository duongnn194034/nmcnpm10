var multer = require('multer');
var express = require("express"),
  router = express.Router()
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
var product = require('../../../models/shopManager/products');
var multer  = require('multer')
var directName = require('../../../app');
router.use(express.static('/public'));

const prodType = require("../../../models/shopManager/prodType")
const products = require("../../../models/shopManager/products")

//upload image
//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/upload')
    },
    filename : function(req, file, cb) {
        cb(null, Date.now() + "." + file.originalname)
    }
});
var upload = multer({
    storage: storage, 
    fileFilter: function(req, file, cb) {
        console.log(file);
        if( file.mimetype == "image/bmp" || 
            file.mimetype == "image/png" ||
            file.mimetype == "image/gif" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ){
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("fileImage");

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//products
router.get("/admin/shopManager/products", function(req, res){
  prodType.find(function(err, items){
      if(err){
          console.log("Cate list error " + err);
          res.render("indexAdmin", {page: "products"});
      } else {
          res.render("indexAdmin", {page: "products", prod_type: items});
      }
  });
});

router.post("/admin/shopManager/products", function(req, res){
  //upload
  upload(req, res, function(err){
      if(err instanceof multer.MulterError) {
          console.log("A multer error occurred when uploading.");
          res.json({kq:0});
      } else if (err) {
          console.log("An unknown error ocurred when uploading." + err);
      } else {
          console.log("Upload is okay");
          console.log(req.file);
          //req.file.filename
          var _products= new products({
              title: req.body.txtTitle,
              description: req.body.txtDescription,
              quantily: req.body.txtQuantily,
              importPrice: req.body.txtImportPrice,
              salePrice: req.body.txtSalePrice,
              image: req.file.filename
          });
          _products.save(function(err){
              if(err){
                  res.json({kq: 0, "err": err});
              } else {
                  //Add item products -> addProdType.products_id
                  prodType.findOneAndUpdate({_id:req.body.selectSex}, {$push: {products_id:_products._id} }, function(err){
                      if(err) {
                          res.json({kq:0, "err":err});
                      } else {
                          console.log("Product is okey");
                          res.redirect("addProducts")
                      }
                  });
              }
          });
      }
  });
});

function isAdminLoggedin(req, res, next) {
  if (req.isAuthenticated() && req.user.ID[0] == 's') {
    return next();
  }
  res.redirect('/');
}

router.get('/admin/gianhang', isAdminLoggedin, function(req, res) {
  res.render('manage', {
    user: req.user,
    body: 'admin/productManagement.ejs'
  })
});

router.get('/admin/quanlysanpham?:type', isAdminLoggedin, function(req, res) {
  console.log(directName.dirname);
  var type = req.query.type;
  product.findProductByType(type, function(result) {
    console.log("type danh sach trong admin: " + type);
    res.render('manage', {
      user: req.user,
      type: type,
      product: result,
      productresult: null,
      body: "admin/quanlysanpham.ejs"
    });
  });
});

//addproduct
var test;
   router.get('/admin/addproduct',isAdminLoggedin, function(req, res) { //
  //  console.log("ID get: " +  JSON.stringify(test));
      if(test != null && nameimg != null)
      {
          var test1 = test;
          var nameimg1 = nameimg;
            MongoClient.connect(uri, function(err, db) {
           //var ids = "/"+nameProduct+"/";
           if (err) throw err;

           var dbo = db.db("3dwebsite");
           dbo.collection("product").insert({
             ID: test1.id,
             name: test1.name,
             price: test1.price,
             type: test1.type,
             link: nameimg1,
             info: test1.Info,
             url: '0',
             status:20
           });
           db.close();

        });
        test = null;
        nameimg = null;
      }
      res.render('manage', {
      Test: test,
      user: req.user,
      body: "admin/addProduct.ejs"
    });

  });

/*async function TTest()
{
    await MongoClient.connect(uri, function(err, db) {
   //var ids = "/"+nameProduct+"/";
   if (err) throw err;

   var dbo = db.db("3dwebsite");
   dbo.collection("product").insert({
     ID: test.id,
     name: test.name,
     price: test.price,
     type: test.type,
     link: nameimg,
     info: test.Info,
     url: '0',
     status:20
   });
   db.close();
});
 test = await null;
 nameimg = await null;
}*/

var nameimg;
var Storage = multer.diskStorage({
  destination: function(req, file,callback){
    callback(null,"Data/img");
  },
  filename: function(req, file, callback){
    nameimg = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    callback(null,nameimg);
    console.log(nameimg);
  }
});
var upload = multer({
  storage: Storage
}).array("imgUploader",3);

router.post('/admin/addproduct', isAdminLoggedin, function(req,res){
  //test = null;
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var type = req.body.type;
  var Info = req.body.info;
  console.log(id);
  var checkid = true;
  product.productCollection(function(result) {

       for(var i = 0; i< result.length; i++)
      {
        if(id == result[i].ID)
        {
          checkid = false;
          console.log(checkid);
        }
      }
      console.log("checkid: " +checkid);
      if(checkid == true)
      {
        test = {id,name,price,type,Info};
        console.log(test);
        res.redirect('/admin/addproduct');
      }
      else
      {
        res.redirect('/admin/addproductFail');
      }
    });
});

router.post('/admin/addimage', isAdminLoggedin, function(req,res){
  upload(req,res,function(err){
    if(err){
      console.log("Something went wrong!!!");
      res.redirect('/admin/addproduct');
    }
    else
    {
      console.log("File uploaded successfully!");
      res.redirect('/admin/addproduct');
    }
  });

});

router.get('/admin/addproductFail', isAdminLoggedin, function(req,res){
  test = null;
  res.render('manage', {
      Test: test,
      user: req.user,
      body: "admin/addProduct.ejs"
    });
});

function findProduct(idsp, callback) { // customer
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("product").findOne({
      ID: idsp
    }, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
        callback("errorIDproduct");
      } else {
        callback(result);
      }
    });
  });
}

var proresult;
router.post('/admin/findProduct', isAdminLoggedin, function(req, res) { //
  var idProduct = req.body.idProduct;
  findProduct(idProduct, function(kq) {
    if (kq == "errorIDproduct" || kq == null) {
      console.log("find Failed Product");
      proresult = null;
      res.redirect('/admin/findFailedProduct');
    } else {
      proresult = kq;
      var type = "";
      for (var i = 0; i < idProduct.length; i++) {
        if (idProduct[i] >= '0' && idProduct[i] <= '9') {
          break;
        } else {
          type += idProduct[i];
        }
      }
      product.findProductByType(type, function(result) {
        res.render('manage', {
          user: req.user,
          type: type,
          product: result,
          productresult: proresult,
          body: "admin/quanlysanpham.ejs"
        });
      });
    }
  });
});

router.get('/admin/findFailedProduct', isAdminLoggedin, function(req, res) { //
  res.render('manage', {
    user: req.user,
    type: null,
    product: null,
    productresult: null,
    body: "admin/quanlysanpham.ejs"
  });
});

function updatePro(id, name, info, price, link) { // customer
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("product").update({
      ID: id
    }, {
      $set: {
        name: name,
        info: info,
        price: price,
        link: link,
      }
    }, {
      multi: true
    });
  });
}

var updateProduct;
router.get('/admin/updateProduct?:ID', isAdminLoggedin, function(req, res) { //
  console.log("ID: " + req.query.ID);
  findProduct(req.query.ID, function(result) {
    res.render('manage', {
      user: req.user,
      updateProduct: result,
      body: "admin/updateProduct.ejs"
    });
  });
})

router.post('/admin/adminUpdateProduct', isAdminLoggedin, function(req, res) { //
  var idsp = req.body.ID;
  var type = req.body.type;
  var name = req.body.name;
  var info = req.body.info;
  var price = req.body.price;
  var link = req.body.link;
  updatePro(idsp, name, info, price, link);
  console.log("Update Success Product");
  var product = require('../../models/product')
  product.findProductByType(type, function(result) {
    console.log("type danh sach trong admin: " + type);
    res.render('manage', {
      user: req.user,
      type: type,
      product: result,
      productresult: null,
      body: "admin/quanlysanpham.ejs"
    });
  });
});

function removeProduct(id) { // customer
  MongoClient.connect(uri, function(err, db) {
    //var ids = "/"+nameProduct+"/";
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("product").remove({
      ID: id
    });
  });
}

var idsp;
var type;
router.get('/admin/removeProduct?:ID', isAdminLoggedin, function(req, res) { //, isAdminLoggedin
  idsp = req.query.ID;
  for (var i = 0; i < idsp.length; i++) {
    if (idsp[i] >= '0' && idsp[i] <= '9') {
      break;
    } else {
      type += idsp[i];
    }
  }
  removeProduct(idsp);
  console.log("remove product Success" + idsp + type);
  res.redirect('/admin/gianhang');
  //res.redirect('/admin/removeProductSuccess'); //bo tay, sai
  console.log("test");
});

router.get('/admin/removeProductSuccess', isAdminLoggedin, function(req, res) { //, isAdminLoggedin
  var product = require('../../models/product')
  product.findProductByType(type, function(result) {
    console.log("type danh sach trong admin: " + type);
    res.render('manage', {
      user: req.user,
      type: type,
      product: result,
      productresult: null,
      body: "admin/quanlysanpham.ejs"
    });
  });
  type = null;
  console.log("180 " + type + idsp);
}); /// sai r, bo tay r

module.exports = router;
