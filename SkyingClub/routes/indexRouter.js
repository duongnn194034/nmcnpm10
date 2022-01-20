var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy
var nodemailer = require("nodemailer");
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online
var crypto = require('crypto-js');
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

var transporter = nodemailer.createTransport({ // config mail server
  service: 'Gmail',
  auth: {
    user: 'group.npmcnpm@gmail.com',
    pass: 'NMCNPM10'
  }
});
//asdasd/
// default direct for css and html bug not load
var directName = require('../app');
router.use(express.static(directName.dirname + 'public'));
//

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

//  Routes in Index
router.get('/admin', function(req, res) {
	res.render("indexAdmin", {page: "hello"});
});

//register
router.get("/register", function(req, res) {
  res.render('login/register.ejs', {
    error: ""
  });
});

const User = require("../models/userNember")

router.post('/register', async (req, res) => {
	const {name, username, password, phone} = req.body

	// Simple validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user)
			return res
				.status(400)
				.json({ success: false, message: 'Username already taken' })

		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new User({name, username, password: hashedPassword, active: 1})
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post("/fileupload", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function(err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });

  });

})

router.get('/upload', function(req, res) {
  res.render('upload');
})


module.exports = router;
