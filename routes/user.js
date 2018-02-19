var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var Coins = require('../functionManagement/coins');
// Register
router.get('/register',ensureLoggedOut, function(req, res){
	res.render('user/register');
});

// Login
router.get('/login',ensureLoggedOut, function(req, res){
	res.render('user/login');
});

// Register User
router.post('/register', function(req, res){
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
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//Error handling
	var errors = [];
	var valErrors = req.validationErrors()
	
	if(valErrors){
		for (var i = 0; i < valErrors.length; i++) {
		 	errors.push(valErrors[i])
		}
		
		return res.render('user/register',{errors:errors})
		
	}

	User.findOne({'username':username}, function (err, user) {	
	 	if (err) return handleError(err);	
		if(user)
			{
				errors.push({msg:"username is already in use!"})				
				res.render('user/register',{
					errors:errors
				});
			}
			else {
				User.findOne({'email':email}, function (err, user) {
					if (err) return handleError(err);
					if(user){
						errors.push({msg:'email is already in use !'})		
						res.render('user/register',{
							errors:errors
						});			
					}	
					else{
						var coins = new Coins()
						var newUser = new User({
						name: name,
						email:email,
						username: username,
						password: password,
						coins:coins.initializeCoins(),
						joindate:getDate(),
						lastdailybonus:getPreviousDate()
						});
						
						User.createUser(newUser, function(err, user){
							if(err) throw err;		
						});
						req.flash('success_msg', 'You are registered and can now login');
						res.redirect('/user/login');
						}	
					

				});
			}
	});
			
})


passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);

				} else {
					return done(null, false, {message: 'Invalid password'});
				}
			});
		});
	}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect:'/user/login',failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	});

router.get('/logout',ensureLoggedIn, function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');

});

module.exports = router;







var moment = require('moment')
function getDate(){
	return moment().format('DD/MM/YYYY HH:mm')
}
function getPreviousDate(){
	return moment().subtract(1,'days').format('DD/MM/YYYY HH:mm')
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