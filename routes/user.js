const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('../config/connect-ensure-login.1/lib/ensureLoggedIn')()
const ensureLoggedOut = require('../config/connect-ensure-login.1/lib/ensureLoggedOut')()
var moment = require('moment')
const {check,validationResult } = require('express-validator/check')


//models && functions && operatins
const User = require('../models/users');
const userOperation = require('../Operations/userOperations')
const UsersController = require('../controllers/UsersController')
const debug = require('debug')('http')
  , http = require('http')

// Register

router.route('/register')
	.get(ensureLoggedOut, UsersController.GET_register)
	.post(ensureLoggedOut,[
		check('name').isLength({ min: 6,max: 20}).withMessage('Name must be between 6 and 20 characters'),

		check('username').isLength({ min: 6,max: 20}).withMessage('userame must be between 6 and 20 characters including numbers, no spacing and no speacial characters')
		.custom(function(value){
			var regex =  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
			return regex.test(value);
		}).withMessage('userame must be between 6 and 20 characters including numbers, no spacing and no speacial characters')		
		.custom(async function(value){//check if the username exits
			var user = await User.find({username:value})
			return user.length == 0;
		}).withMessage('Username already in use'),

		check('email').isEmail().withMessage('Invalid Email')
		.custom(async function(value){
			var user = await User.find({email:value})
			return user.length ==0;
		}).withMessage('Email already in use'),

		check('password').isLength({min: 8, max: 20}).withMessage('password must be between 8 and 20 characters')
		.custom(function(value){
			var regex =  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
			return regex.test(value);
		}).withMessage('password must be between 8 and 20 characters including numbers No special characters '),
		
		
	], UsersController.POST_register)



// Login
router.route('/login')
	.get(ensureLoggedOut, UsersController.GET_login)
	.post(ensureLoggedOut, UsersController.capatcherCheck, passport.authenticate('local', {
		
		successReturnToOrRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: 'invalid password or Username',
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