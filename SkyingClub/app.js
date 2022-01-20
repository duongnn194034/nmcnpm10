require('dotenv').config()
var express = require('express');
var sessions = require('express-session');
var url = require('url');
var app = express();
const cors = require('cors');
app.use(express.json())
app.use(cors())
var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var session;

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
mongoose.connect('mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Mongo connected error: " + err);
    } else {
        console.log("Mongo connected successfull.");
    }
});
app.use(sessions({
  secret: '(!)*#(!JE)WJEqw09ej12',
  resave: false,
  saveUninitialized: true
}));

var path = require('path');
const dirname = __dirname;
module.exports = {
  dirname: dirname
}
app.use(express.static(path.join(__dirname, 'public')));

var Passport = require("./models/Passport");
var LocalStrategy = require("passport-local").Strategy;
app.use(Passport.initialize());
app.use(Passport.session())

app.use('/change-lang/:lang', (req, res) => {
      res.cookie('lang', req.params.lang, { maxAge: 900000 });
      res.redirect('back');
});

////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("view options", { layout: "layout" });

var adminRouter = require('./routes/adminRouter.js');
var cartAndPaymentRouter = require('./routes/cartAndPaymentRouter.js');
var emailRouter = require('./routes/emailRouter.js');
var indexRouter = require('./routes/indexRouter.js');
var loginRouter = require('./routes/loginRouter.js');
var nemberRouter = require('./routes/nemberRouter.js');
var productRouter = require('./routes/productRouter.js');
var hoaDonM = require('./routes/admin/shopManager/hoaDonM.js');
var prodTypeM = require('./routes/admin/shopManager/prodTypeM');
var productsM = require('./routes/admin/shopManager/productsM');
var thongKeM = require('./routes/admin/shopManager/thongKeM');
var voucherM = require('./routes/admin/shopManager/hoaDonM');

app.use(adminRouter);
app.use(cartAndPaymentRouter);
app.use(emailRouter);
app.use(indexRouter);
app.use(loginRouter);
app.use(nemberRouter);
app.use(productRouter);
app.use(hoaDonM);
app.use(prodTypeM);
app.use(productsM);
app.use(thongKeM);
app.use(voucherM);

// Error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('errorPage', {
//     error : err.message
//   });
// });

const PORT = process.env.PORT || 8686;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
