var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy
var prodType = require("../models/shopManager/prodType");
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

function isLoggedin(req, res, next) {
  if (req.user == undefined) {
    return next();
  } else {
    res.redirect('/login');
  }
}


// default direct for css and html bug not load
var directName = require('../app');
router.use(express.static(directName.dirname + 'public'));
//

router.get('/login', function(req, res) {
  console.log("login in routes");
  res.render('login/login.ejs', {
    error: ""
  });
});

const User = require("../models/userNember")
router.post('/login', async (req, res) => {
	const { username, password } = req.body

	// Simple validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// Username found
		const passwordValid = await argon2.verify(user.password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// All good
		// Return token
		const accessToken = jwt.sign(
			{ userId: user._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.redirect("/admin");
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.get('/forgotPassword', function(req, res) {
  console.log("fogotpassword");
  res.render('login/fogotPassword', {
    error: ""
  });
})

module.exports = router;
