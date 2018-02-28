const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var moment = require('moment')

//models && functions && operatins
const User = require('../models/users');
const Coins = require('../Operations/encryptCoins');
const userOperation = require('../Operations/userOperations')


// Register
router.get('/register', ensureLoggedOut, function (req, res) {
	res.render('user/register',{errors:req.flash('errors')});
});

// Login
router.get('/login', ensureLoggedOut, function (req, res) {
	console.log(req.flash())
	res.render('user/login',{errors:req.flash('error')});
});

// Register User
router.post('/register', async function (req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	//Error handling
	
	var valErrors = req.validationErrors()

	if (valErrors) {
		
		req.flash('errors',"fill all the blanks")
		return res.redirect('/user/register')

	}
	if(password != password2){
		req.flash('errors',"passwords don't match")
		return res.redirect('/user/register')

	}

	try {
		var emailExist = await userOperation.queryByEmail(email)
		var usernameExist = await userOperation.queryByUsername(username)

	} catch (err) {
		next(err)
	}
	if (emailExist) {
		req.flash('errors',"email already in use")
		return res.redirect('/user/register')
	}
	if (usernameExist) {
		req.flash('errors',"username already in use")
		return res.redirect('/user/register')

	}
	var newUser = new User({
		name: name,
		email: email,
		username: username,
		password: password,
		coins: Coins.initializeCoins(),
		joindate: getDate(),
		lastdailybonus: getPreviousDate(),
		profileimgurl:"http://res.cloudinary.com/dyy9ovwcv/image/upload/v1519766192/sw6calmlh1hjnqfbszch.png"
	});

	User.createUser(newUser, function (err, user) {
		if (err) {
			next(err)
			req.flash('errors',"a problem has occured. Please register again")
			return res.redirect('/user/register')

		}
	});
	req.flash('success_msg', 'You are registered and can now login');
	res.redirect('/user/login');
})







passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Invalid User or password' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);

				} else {
					return done(null, false, { message: 'Invalid User or password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {


	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/user/login', failureFlash: "invalid motherfucker" }));

router.get('/logout', ensureLoggedIn, function (req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');

});

module.exports = router;








function getDate() {
	return moment().format('DD/MM/YYYY HH:mm')
}
function getPreviousDate() {
	return moment().subtract(1, 'days').format('DD/MM/YYYY HH:mm')
}








// replaced with Ensure loging in library !
// function ensureLoggedIn(req, res, next) {	
//   if(req.user){
//     return next()
//   }else{
//     res.redirect('/user/login');
//   }
// }
// function ensureLoggedOut(req, res, next) {	
//   if(!req.user){
//     return next()
//   }else{
//     res.redirect('/');
//   }
// }