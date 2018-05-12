var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('../config/connect-ensure-login.1/lib/ensureLoggedIn')()
const ensureLoggedOut = require('../config/connect-ensure-login.1/lib/ensureLoggedOut')()
const earncoinsHandler = require('../controllers/ECcontroller')



router.get('/', ensureLoggedIn, function (req, res) {
	res.redirect('/earncoins/offerwall')
});

router.route('/offerwall')
	.get( ensureLoggedIn,earncoinsHandler.GET_offerwall )

router.post('/missions/:id', ensureLoggedIn,earncoinsHandler.POST_offerwall_mission_id)



router.route('/daily')
	.get(  ensureLoggedIn,earncoinsHandler.GET_daily )
	.post( ensureLoggedIn,earncoinsHandler.POST_daily)



	

router.route('/videos')
	.get( ensureLoggedIn,earncoinsHandler.GET_videos)
	.post( ensureLoggedIn,earncoinsHandler.videoRateLimiter,earncoinsHandler.POST_videos)






router.route('/invite')
	.get(earncoinsHandler.GET_invite)



router.route('/code')
	.get( ensureLoggedIn,earncoinsHandler.GET_code)
	.post( ensureLoggedIn,earncoinsHandler.POST_code)




router.route('/buy')
	.get( ensureLoggedIn,earncoinsHandler.GET_buy)


module.exports = router;


