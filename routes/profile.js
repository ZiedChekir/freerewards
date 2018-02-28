var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var mongoose = require('mongoose');
var User = require('../models/users');
var coinsEncryption = require('../Operations/encryptCoins');
var userOp = require('../Operations/userOperations')
var User = require('../models/users')
var cloudinary = require('cloudinary');
var multer = require('multer')
var upload = multer({
	dest: 'uploads/'
})
var fs = require('fs')


var orders

cloudinary.config({
	cloud_name: 'dyy9ovwcv',
	api_key: '333274761868348',
	api_secret: 'bFypPblXA-7gKJl5OWO_UE-2fAk'
});

/* GET users listing. */
router.get('/', ensureLoggedIn, function (req, res, next) {
	console.log(req.flash())
	User.findOne({
		'_id': res.locals.user._id
	}, function (err, user) {
		orders = user.orders
		res.render('profile', {
			profile: true,
			user: res.locals.user,
			userProfile: JSON.stringify(res.locals.user, null, '  '),
			orders: orders,
			errors: req.flash('errors'),
			successMsg: req.flash('successMsg')
		})
	})

});

router.post('/updatepicture', upload.single('image'), function (req, res, next) {
	if (!req.file) {
		return res.redirect('/profile#settings')
	}
	cloudinary.v2.uploader.upload(req.file.path, async function (err, result) {
		if (err) {
			console.log(err)
			req.flash('errors', 'failed to upload the image')
			return res.redirect('/profile#settings')
		}
		User.getUserById(res.locals.user._id, function (err, user) {
			user.profileimgurl = result.secure_url
			user.save(function (err) {
				if (err) {
					next(err)
					req.flash('errors', 'failed to upload the image')
				}
			})			
			res.redirect('/profile#settings')
			fs.unlink('./uploads/' + result.original_filename)
		})
		
	})


})

router.post('/update', ensureLoggedIn, async function (req, res, next) {
	var username = req.body.editusername
	var email = req.body.editemail
	var newpassword = req.body.editpassword
	var passcofirm = req.body.pass


	//if any of the fields was updated
	if ((username || email || newpassword) && passcofirm) {
		//query the user and store it for later use 
		var user = await userOp.queryById(res.locals.user._id)

		User.comparePassword(passcofirm, user.password, async function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				if (username) {
					user.username = username
					await user.save()
				}
				if (email) {
					user.email = email
					await user.save()
				}
				if (newpassword) {
					User.hashandsave(user, newpassword, function (err) {
						if (err) throw err;
					})
				}
				req.flash('successMsg', "account successfully updated")
			} else { //old password is wrong	
				console.log('conf pass doesnt match')
				req.flash('errors', "Current password is invalid")

			}

			res.redirect('/profile#settings')
		})

	} else {
		console.log('nothing was touched')
		res.redirect('/profile#settings')
	}
})



router.get('/addcoin', ensureLoggedIn, function (req, res, next) {
	//access Database anc check for this user's coin
	User.findOne({
		'_id': res.locals.user._id
	}, function (err, user) {
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