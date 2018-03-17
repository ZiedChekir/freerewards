const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var moment = require('moment')

//models && functions && operatins
const User = require('../models/users');
const userOperation = require('../Operations/userOperations')
const UsersController = require('../controllers/UsersController')

// Register

router.route('/register')
	.get( ensureLoggedOut,UsersController.GET_register)
	.post( ensureLoggedOut,UsersController.POST_register)



// Login
router.route('/login')
	.get( ensureLoggedOut,UsersController.GET_login)
	.post( ensureLoggedOut,function(req,res,next){
			console.log(req.query)
			console.log(req.params)
			next()
	},passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/user/login', failureFlash: "invalid motherfucker" }))


router.get('/logout', ensureLoggedIn,UsersController.GET_logout);

module.exports = router;



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