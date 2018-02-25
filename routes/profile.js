var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var mongoose = require('mongoose');
var User = require('../models/users');
var coinsEncryption = require('../Operations/encryptCoins');
var orders



/* GET users listing. */
router.get('/', ensureLoggedIn, function (req, res, next) {
	User.findOne({ '_id': res.locals.user._id }, function (err, user) {
		orders = user.orders
		res.render('profile', {
			profile: true,
			user: res.locals.user,
			userProfile: JSON.stringify(res.locals.user, null, '  '),
			orders: orders
		})
	})

});



router.get('/addcoin', ensureLoggedIn, function (req, res, next) {
	//access Database anc check for this user's coin
	User.findOne({ '_id': res.locals.user._id }, function (err, user) {
		if (err) return handleError(err);
		//under this line the encrypted value of coins gets decrypted ,  added some number, encrypted it again and stored it in a variable
		user.coins = coinsEncryption.encryptcoins((Number(coinsEncryption.decryptcoins(user.coins)) + 10000).toString());
		user.completedMissions.push('clas of clans')
		user.save(function (err) { // user coins saved to database
			if (err) return handleError(err);

		});
	});



	res.redirect('/profile')
})
module.exports = router;
