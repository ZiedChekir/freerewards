const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
const ProfileController = require('../controllers/ProfileController')

const User = require('../models/users')


/* GET users listing. */


router.get('/', ensureLoggedIn, function (req, res, next) {

	res.redirect('/profile/overview')
})

router.get('/overview', ensureLoggedIn, ProfileController.GET_overview );

router.get('/orders', ensureLoggedIn,ProfileController.GET_orders)

router.get('/settings', ensureLoggedIn,ProfileController.GET_settings)




router.post('/update', ensureLoggedIn, ProfileController.POST_file,ProfileController.POST_update)


//Delete before production
router.get('/addcoin', ensureLoggedIn, async function (req, res, next) {
	//access Database anc check for this user's coin
	try {
		var user = await User.findOne(res.locals.user._id);
		user.coins += 10000;
		await user.save();
		res.redirect('/profile')
	} catch (err) {
		next(err)
	}

})
module.exports = router;