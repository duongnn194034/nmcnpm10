var express = require("express"),
  router = express.Router()
const verifyToken = require('../middleware/auth')
var admin = require('../models/userAdmin'),
    customer = require('../models/userNember')

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));



function isAdminLoggedin(req, res, next) {
  if (req.isAuthenticated() && req.user.level == 'ADMIN') {
    return next();
  }
  res.redirect('/');
}


// default direct for css and html bug not load
var directName = require('../app');

router.use(express.static(directName.dirname + 'public'));
//

var update;
router.post('/findProduct', function(req, res) {
  var idProduct = req.body.idProduct;

  product.findItemByID(idProduct, function(result) {
    if (result == "e" || result == null) {
      console.log("find Failed");
      res.redirect('findFailed');
    } else {
      console.log("findProduct" + result);
      update = result;
      res.redirect('findSuccess');
    }
  });
});

router.get('/findSuccess', function(req, res) {
  res.render('admin/updateProduct', {
    update: update,
    flag: true,
    error: ""
  });
});

router.get('/findFailed', function(req, res) {
  res.render('admin/updateProduct', {
    update: update,
    flag: false,
    error: "Không tìm thấy sản phẩm"
  });
});


router.post('/update', function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var link = req.body.link;
  var info = req.body.info;
  product.updateProductByID(update[0].ID, name, info, price, link);
  console.log("Update Success");
  res.redirect('updateSuccess')
  update = null;
});


router.get('/adminnn', isAdminLoggedin, function(req, res) { // ham index de vao web chinh
  console.log("admin login index: " + req.user);
  res.render('manage', {
    user: req.user,
    body: "admin/admin.ejs"
  });
});

router.get('/logout', function(req, res) { // ham index de vao web chinh
  console.log("logout")
  req.logout();
  req.user = null;
  res.redirect("/login");
});

module.exports = router;
