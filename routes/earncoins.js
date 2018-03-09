var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var ECHandler = require('../controllers/earncoinsController')



router.get('/', ensureLoggedIn, function (req, res) {
	res.redirect('/earncoins/offerwall')
});

router.route('/offerwall')
	.get( ensureLoggedIn,ECHandler.GET_offerwall )

router.post('/missions/:id', ensureLoggedIn,ECHandler.POST_offerwall_mission_id)



router.route('/daily')
	.get(  ensureLoggedIn,ECHandler.GET_daily )
	.post( ensureLoggedIn,ECHandler.POST_daily)




router.route('/videos')
	.get( ensureLoggedIn,ECHandler.GET_videos)
	.post( ensureLoggedIn,ECHandler.POST_videos)






router.route('/invite')
	.get(ECHandler.GET_invite)



router.route('/code')
	.get( ensureLoggedIn,ECHandler.GET_code)
	.post( ensureLoggedIn,ECHandler.POST_code)




router.route('/buy')
	.get( ensureLoggedIn,ECHandler.GET_buy)


module.exports = router;


