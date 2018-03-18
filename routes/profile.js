var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var mongoose = require('mongoose');
var User = require('../models/users');
var userOp = require('../Operations/userOperations')
var User = require('../models/users')
var cloudinary = require('cloudinary');
var multer = require('multer')
var Orders = require('../models/orders')

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
router.get('/', ensureLoggedIn, async function (req, res, next) {
	
	// let user = await User.findOne({_id: res.locals.user._id})
	let orders = await Orders.find({email:res.locals.user.email})

	res.render('profile', {
			profile: true,
			user: res.locals.user,
			orders: orders,
			
		
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

router.post('/update', ensureLoggedIn, async  function (req, res, next) {
	
	var errors = []

	// req.checkBody('email', 'invalid email').isEmail()
	var username = req.body.editusername
	var email = req.body.editemail
	var newpassword = req.body.editpassword
	var passcofirm = req.body.pass

	
if(!passcofirm || passcofirm == ''){
	req.flash('errors','Please confirm your current password')
	return res.redirect('/profile#settings')
}


	if(username ){
		req.checkBody('editusername', 'username length must be between 6 and 20 characters').notEmpty().len({ min: 6 , max:20})

	}
	if(email){
		req.checkBody('editemail', 'invalid email').isEmail()

	}
	if(newpassword){
		req.checkBody('editpassword', 'new password length must be between 8 and 20 characters').notEmpty().len({ min: 8 , max:20})
	}
	
	if(req.validationErrors()){	
		req.validationErrors().map(function(x){
			errors.push(x.msg)
		})
		req.flash('errors',errors)	
		 return res.redirect(`/profile#settings`)
	}


	//if any of the fields was updated
	if ((username || email || newpassword) && passcofirm) {
		//query the user and store it for later use 
	
try{
	if (process.env.NODE_ENV == 'production') {
		var recapatcha = req.body['g-recaptcha-response']
		if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
			
			req.flash('errors', 'Make sure to check recapatcha')
			return res.redirect(`/profile#settings`)	
		}
		var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
	
		console.log('before request')
		request(verificationUrl, function (error, res, body) {
			console.log('inside request')
			if (body.success !== undefined && !body.success) {
				console.log('success is false')
				req.flash('errors', 'something went wrong with recapatcha!')
				return res.redirect(`/profile#settings`)
	
			}
		  
				req.flash('success', 'you are now logged in!')
				next()
			
	
		})
	} 
	else {
		next()
	}

		var user = await userOp.queryById(res.locals.user._id)
		User.comparePassword(passcofirm, user.password, async function (err, isMatch) {
			if (err) next(err);
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
	}catch(err){
		req.flash('errors','something went wrong please retry later')
		next(err)
	}
	
	} else {
		console.log('nothing was touched')
		res.redirect('/profile#settings')
	}
})



router.get('/addcoin', ensureLoggedIn,async  function (req, res, next) {
	//access Database anc check for this user's coin
	try{
		var user = await User.findOne(res.locals.user._id);
		user.coins += 10000;
		await user.save();
		res.redirect('/profile')
	}catch(err){
		next(err)
	}

})
module.exports = router;