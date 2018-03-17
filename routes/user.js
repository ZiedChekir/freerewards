const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var moment = require('moment')
const request = require('request')
//models && functions && operatins
const User = require('../models/users');
const userOperation = require('../Operations/userOperations')
const UsersController = require('../controllers/UsersController')
const debug = require('debug')('http')
  , http = require('http')

// Register

router.route('/register')
	.get(ensureLoggedOut, UsersController.GET_register)
	.post(ensureLoggedOut, UsersController.POST_register)



// Login
router.route('/login')
	.get(ensureLoggedOut, UsersController.GET_login)
	.post(ensureLoggedOut, async function (req, res, next) {
		req.checkBody('username','username at least 6 characters').notEmpty().isLength({min:6,max:20})
		req.checkBody('password','password at least 8 characters').notEmpty().isLength({min:8,max:20})
		var valErrors = req.validationErrors()
		if(valErrors){
			var errors = []
			valErrors.map(function(error){errors.push(error)})
			req.flash('errors',errors)
			return res.redirect('/user/login')
		}
		if(proccess.env.enableRecapatcha)
		{	
		var recapatcha = req.body['g-recaptcha-response']
		if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
			debug('recapatcha wasnt checked')
		req.flash('errors','Make sure to check recapatcha')
			return res.redirect('/user/login')
		}
		var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

		console.log('before request')
		request(verificationUrl, function (error, res, body) {
			if (body.success !== undefined && !body.success) {
				debug('success is false')
				req.flash('errors','something went wrong with recapatcha!')
				return res.redirect('/user/login')
			}
			if (body.success) {
		req.flash('success','you are now logged in!')
				next()
			}

		})
	}else{

	}
next()
	}, passport.authenticate('local', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: "invalid motherfucker"
	}))


router.get('/logout', ensureLoggedIn, UsersController.GET_logout);

module.exports = router;



passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, {
					message: 'Invalid User or password'
				});
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);

				} else {
					return done(null, false, {
						message: 'Invalid User or password'
					});
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